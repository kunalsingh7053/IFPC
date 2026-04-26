// middleware/adminAuth.middleware.js

const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");

async function adminAuthMiddleware(req, res, next) {
  try {
    const token =
      req.cookies.adminToken ||
      req.headers.admintoken ||
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

    if (decoded.type !== "admin") {
      return res.status(403).json({
        message: "Not an admin",
      });
    }

    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return res.status(401).json({
        message: "Admin not found",
      });
    }

    if (admin.status !== "allow") {
      return res.status(403).json({
        message: "Admin blocked",
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

module.exports = { adminAuthMiddleware };