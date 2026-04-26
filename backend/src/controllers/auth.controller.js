const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');
const User = require('../models/member.model');
const Event = require('../models/events.model');
const SystemSetting = require('../models/systemSetting.model');
const bcrypt = require("bcryptjs");
const { uploadImageAsset, deleteImageByFileId } = require("../service/imagekit.service");

const MEDICAPS_EMAIL_DOMAIN = "@medicaps.ac.in";
const isMedicapsEmail = (email = "") =>
  String(email).trim().toLowerCase().endsWith(MEDICAPS_EMAIL_DOMAIN);

const FIXED_ADMIN = {
  email: "anil.patidar@medicaps.ac.in",
  password: "12345678",
  username: "anil.patidar",
  fullName: {
    firstName: "Anil",
    lastName: "patidar",
  },
  position: "admin",
  phone: "9999999999",
  status: "allow",
};

async function ensureFixedAdminAccount() {
  const fixedEmail = FIXED_ADMIN.email.toLowerCase();
  const hashedPassword = await bcrypt.hash(FIXED_ADMIN.password, 10);

  let admin = await Admin.findOne({ email: fixedEmail });

  if (!admin) {
    admin = await Admin.create({
      username: FIXED_ADMIN.username,
      fullName: FIXED_ADMIN.fullName,
      email: fixedEmail,
      position: FIXED_ADMIN.position,
      password: hashedPassword,
      phone: FIXED_ADMIN.phone,
      status: FIXED_ADMIN.status,
    });

    return admin;
  }

  admin.username = FIXED_ADMIN.username;
  admin.fullName = FIXED_ADMIN.fullName;
  admin.position = FIXED_ADMIN.position;
  admin.password = hashedPassword;
  admin.phone = FIXED_ADMIN.phone;
  admin.status = FIXED_ADMIN.status;
  await admin.save();

  return admin;
}

async function getOrCreateAppSetting() {
  let setting = await SystemSetting.findOne({ key: "app-settings" });

  if (!setting) {
    setting = await SystemSetting.create({
      key: "app-settings",
      memberRegistrationOpen: false,
    });
  }

  return setting;
}



async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (normalizedEmail !== FIXED_ADMIN.email) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (password !== FIXED_ADMIN.password) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const admin = await ensureFixedAdminAccount();

    // check status
    if (admin.status !== "allow") {
      return res.status(403).json({
        message: "Admin not allowed by system",
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
    return res.status(403).json({
      message: "Admin registration is disabled. Only fixed admin is allowed.",
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

async function getMemberRegistrationStatus(req, res) {
  try {
    const setting = await getOrCreateAppSetting();

    return res.json({
      success: true,
      data: {
        memberRegistrationOpen: Boolean(setting.memberRegistrationOpen),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function updateMemberRegistrationStatus(req, res) {
  try {
    const { memberRegistrationOpen } = req.body || {};

    if (typeof memberRegistrationOpen !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "memberRegistrationOpen must be boolean",
      });
    }

    const setting = await getOrCreateAppSetting();
    setting.memberRegistrationOpen = memberRegistrationOpen;
    await setting.save();

    return res.json({
      success: true,
      message: memberRegistrationOpen
        ? "Member registration is now open"
        : "Member registration is now closed",
      data: {
        memberRegistrationOpen: setting.memberRegistrationOpen,
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
  getMemberRegistrationStatus,
  updateMemberRegistrationStatus,
};