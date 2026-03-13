const adminModel = require("../models/admin.model");
const jwt = require("jsonwebtoken");

async function adminAuthMiddleware(req, res, next) {
  try {
    // ✅ read adminToken instead of token
    const token =
      req.cookies.adminToken ||
      req.headers.admintoken;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const admin = await adminModel
      .findById(decoded.id)
      .select("-password");

    if (!admin) {
      return res.status(401).json({
        message: "Admin not found",
      });
    }

    req.admin = admin;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
}

module.exports = {
  adminAuthMiddleware,
};