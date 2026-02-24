const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');
const bcrypt = require("bcryptjs");
const { uploadImage} = require("../service/imagekit.service");



async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body;

    // find admin
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // check status allow/block
    if (admin.status !== "allow") {
      return res.status(403).json({ message: "Admin not allowed by system" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // update last login
    admin.lastLogin = new Date();
    await admin.save();

    // create token
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      message: "Login successful",
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        fullName: admin.fullName
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function registerAdmin(req, res) {
  try {
    const {
      username,
      fullName:{
        firstName,
        lastName
      }, 
      email,
      password,
      phone,
    
    } = req.body;

    // check existing admin
    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create admin
    const admin = await Admin.create({
      username,
      fullName: {
        firstName,
        lastName
      },
      email,
      password: hashedPassword,
      phone,
      status: "block" // or "block" if approval needed
    });

    res.status(201).json({
      message: "Admin registered successfully",
      admin: {
        id: admin._id,
        username: admin.username,
        fullName: admin.fullName,
        email: admin.email,
        status: admin.status
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function getAdminProfile(req, res) {
  try {
    const admin = req.admin; // set by adminAuthMiddleware

    if (!admin) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.json({
      id: admin._id,
      username: admin.username,
      fullName: admin.fullName,
      email: admin.email,
      phone: admin.phone,
      profileImage: admin.profileImage,
      status: admin.status,
      lastLogin: admin.lastLogin,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
} 
async function updateAdminProfile(req, res) {
  try {
    const adminId = req.admin._id;

    const { username, firstName, lastName, email, phone } = req.body || {};

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // text updates
    if (username !== undefined) admin.username = username;
    if (email !== undefined) admin.email = email;
    if (phone !== undefined) admin.phone = phone;

    if (firstName !== undefined) admin.fullName.firstName = firstName;
    if (lastName !== undefined) admin.fullName.lastName = lastName;

    // profile image upload
    if (req.file) {
      const imageUrl = await uploadImage(req.file, "admins/profile");
      admin.profileImage = imageUrl;
    }

    await admin.save();

    res.json({
      message: "Profile updated successfully",
      admin: {
        id: admin._id,
        username: admin.username,
        fullName: admin.fullName,
        email: admin.email,
        phone: admin.phone,
        profileImage: admin.profileImage
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}




module.exports = {
  loginAdmin,
  registerAdmin,
  getAdminProfile,
  updateAdminProfile
};