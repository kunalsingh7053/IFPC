// middleware/memberAuth.middleware.js

const jwt = require("jsonwebtoken");
const User = require("../models/member.model");

async function memberAuthMiddleware(req, res, next) {
  try {
    const token =
      req.cookies.memberToken ||
      req.headers.membertoken ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // ❌ block admin token
    if (decoded.type !== "member") {
      return res.status(403).json({
        message: "Not a member token",
      });
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    if (!user.canLogin) {
      return res.status(403).json({
        message: "Pending approval",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "Blocked",
      });
    }

    req.user = user;

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
}

module.exports = { memberAuthMiddleware };