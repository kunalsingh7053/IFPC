const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');
const User = require('../models/member.model');
const Event = require('../models/events.model');
const bcrypt = require("bcryptjs");
const { uploadImageAsset, deleteImageByFileId } = require("../service/imagekit.service");

const MEDICAPS_EMAIL_DOMAIN = "@medicaps.ac.in";
const isMedicapsEmail = (email = "") =>
  String(email).trim().toLowerCase().endsWith(MEDICAPS_EMAIL_DOMAIN);



async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body;

    if (!isMedicapsEmail(email)) {
      return res.status(400).json({
        message: "Only @medicaps.ac.in email is allowed",
      });
    }

    // find admin
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // check status
    if (admin.status !== "allow") {
      return res.status(403).json({
        message: "Admin not allowed by system",
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // update last login
    admin.lastLogin = new Date();
    await admin.save();

    const adminPosition = admin.position || admin.role || "admin";

    // create token
    const token = jwt.sign(
      {
        id: admin._id,
        position: adminPosition,
        type: "admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ cookie name changed
    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ✅ response also changed
    res.json({
      message: "Login successful",
      adminToken: token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        position: adminPosition,
        fullName: admin.fullName,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
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
      position,
    
    } = req.body;

    if (!isMedicapsEmail(email)) {
      return res.status(400).json({ message: "Only @medicaps.ac.in email is allowed" });
    }

    // check existing email across admins and members
    const normalizedEmail = String(email).trim().toLowerCase();
    const [existingAdmin, existingMember] = await Promise.all([
      Admin.findOne({ email: normalizedEmail }),
      User.findOne({ email: normalizedEmail }),
    ]);

    if (existingAdmin || existingMember) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const normalizedPosition = (position || "admin").toLowerCase().trim();

    // create admin
    const admin = await Admin.create({
      username,
      fullName: {
        firstName,
        lastName
      },
      email: normalizedEmail,
      position: normalizedPosition,
      password: hashedPassword,
      phone,
      status: "allow"
    });

    res.status(201).json({
      message: "Admin registered successfully",
      admin: {
        id: admin._id,
        username: admin.username,
        fullName: admin.fullName,
        email: admin.email,
        position: admin.position || "admin",
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
      position: admin.position || "admin",
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
    if (req.body?.position !== undefined) {
      admin.position = String(req.body.position).toLowerCase().trim();
    }

    if (firstName !== undefined) admin.fullName.firstName = firstName;
    if (lastName !== undefined) admin.fullName.lastName = lastName;

    // profile image upload
    if (req.file) {
      const oldFileId = admin.profileImageFileId;
      const uploaded = await uploadImageAsset(req.file, "admins/profile");
      admin.profileImage = uploaded.url;
      admin.profileImageFileId = uploaded.fileId;

      if (oldFileId) {
        await deleteImageByFileId(oldFileId);
      }
    }

    await admin.save();

    res.json({
      message: "Profile updated successfully",
      admin: {
        id: admin._id,
        username: admin.username,
        fullName: admin.fullName,
        email: admin.email,
        position: admin.position || "admin",
        phone: admin.phone,
        profileImage: admin.profileImage
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function logoutAdmin(req, res) {
  try {
    res.clearCookie("adminToken", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getAdminDashboardStats(req, res) {
  try {
    const now = new Date();

    const [
      totalMembers,
      approvedMembers,
      activeMembers,
      totalEvents,
      eventsCovered,
      upcomingEvents,
      rawPositionCounts,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ canLogin: true }),
      User.countDocuments({ isActive: true }),
      Event.countDocuments(),
      Event.countDocuments({ eventDate: { $lte: now } }),
      Event.countDocuments({ eventDate: { $gt: now } }),
      User.aggregate([
        {
          $group: {
            _id: "$position",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const positionCounts = rawPositionCounts.reduce((acc, item) => {
      const key = item._id || "member";
      acc[key] = item.count;
      return acc;
    }, {});

    const corePositions = ["president", "presedent", "vice-president", "secretary", "treasurer", "head"];
    const coreMembers = corePositions.reduce(
      (sum, role) => sum + (positionCounts[role] || 0),
      0
    );

    return res.json({
      success: true,
      data: {
        totalMembers,
        approvedMembers,
        activeMembers,
        totalEvents,
        eventsCovered,
        upcomingEvents,
        positionCounts,
        headMembers: positionCounts.head || 0,
        coreMembers,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  loginAdmin,
  registerAdmin,
  getAdminProfile,
  updateAdminProfile,
  logoutAdmin,
  getAdminDashboardStats,
};