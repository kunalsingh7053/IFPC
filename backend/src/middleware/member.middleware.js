const jwt = require("jsonwebtoken");
const User = require("../models/member.model");

async function memberAuthMiddleware(req, res, next) {
  try {
    const token =
      req.cookies.memberToken ||
      req.headers.membertoken;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(
      decoded.id
    ).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
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

module.exports = {
  memberAuthMiddleware,
};