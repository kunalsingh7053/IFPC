const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");
const Member = require("../models/member.model");

// Allow access if request is authenticated as either admin or member
async function chatAuthMiddleware(req, res, next) {
  try {
    // Try admin token first
    const adminToken =
      req.cookies.adminToken || req.headers.admintoken;

    if (adminToken) {
      try {
        const decodedAdmin = jwt.verify(
          adminToken,
          process.env.JWT_SECRET
        );

        const admin = await Admin.findById(decodedAdmin.id).select(
          "-password"
        );

        if (admin) {
          if (admin.status !== "allow") {
            return res.status(403).json({ message: "Admin access blocked" });
          }

          req.admin = admin;
          req.chatUser = {
            type: "admin",
            id: admin._id,
            name: `${admin.fullName.firstName} ${admin.fullName.lastName}`,
          };
          return next();
        }
      } catch (err) {
        // ignore and try member token below
      }
    }

    // Try member token
    const memberToken =
      req.cookies.memberToken || req.headers.membertoken;

    if (!memberToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decodedMember = jwt.verify(
      memberToken,
      process.env.JWT_SECRET
    );

    const member = await Member.findById(decodedMember.id).select(
      "-password"
    );

    if (!member) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!member.canLogin) {
      return res.status(403).json({ message: "Your account is pending admin approval" });
    }

    if (!member.isActive) {
      return res.status(403).json({ message: "Your account is blocked. Contact admin" });
    }

    req.user = member;
    req.chatUser = {
      type: "member",
      id: member._id,
      name: `${member.fullName.firstName} ${member.fullName.lastName}`,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = {
  chatAuthMiddleware,
};
