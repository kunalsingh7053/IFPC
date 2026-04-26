const User = require("../models/member.model");
const Admin = require("../models/admin.model");
const SystemSetting = require("../models/systemSetting.model");
const ChatMessage = require("../models/chat.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { uploadImageAsset, deleteImageByFileId } = require("../service/imagekit.service");

const MEDICAPS_EMAIL_DOMAIN = "@medicaps.ac.in";
const isMedicapsEmail = (email = "") =>
  String(email).trim().toLowerCase().endsWith(MEDICAPS_EMAIL_DOMAIN);

const LEADERSHIP_ADMIN_POSITIONS = ["president", "vice-president", "presedent"];

const normalizeLeadershipPosition = (value = "") => {
  const normalized = String(value).trim().toLowerCase();
  if (normalized === "presedent") return "president";
  if (normalized === "vice president") return "vice-president";
  return normalized;
};

async function syncLeadershipAdminToMember(admin) {
  const normalizedEmail = String(admin.email || "").trim().toLowerCase();
  const normalizedPosition = normalizeLeadershipPosition(admin.position || admin.role);

  if (!["president", "vice-president"].includes(normalizedPosition)) {
    return null;
  }

  const firstName = String(admin.fullName?.firstName || "IFPC").trim() || "IFPC";
  const lastName = String(admin.fullName?.lastName || "Member").trim() || "Member";

  let user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    user = await User.create({
      fullName: { firstName, lastName },
      email: normalizedEmail,
      password: admin.password,
      position: normalizedPosition,
      department: "Administration",
      canLogin: true,
      isActive: true,
      profileImage: admin.profileImage || "",
    });

    return user;
  }

  user.fullName = { firstName, lastName };
  user.password = admin.password;
  user.position = normalizedPosition;
  user.canLogin = true;
  user.isActive = true;
  if (admin.profileImage) {
    user.profileImage = admin.profileImage;
  }
  if (!user.department) {
    user.department = "Administration";
  }
  await user.save();

  return user;
}

async function register(req, res) {
  try {
    const setting = await SystemSetting.findOne({ key: "app-settings" });

    if (!setting?.memberRegistrationOpen) {
      return res.status(403).json({
        success: false,
        message: "Member registration is currently closed by admin",
      });
    }

    const {
      firstName,
      lastName,
      email,
      password,
      position,
      department,
    } = req.body;

    // ✅ required check
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    if (!isMedicapsEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Only @medicaps.ac.in email allowed",
      });
    }

    // 🔥 POSITION VALIDATION
    const allowedPositions = [
      "president",
      "vice-president",
      "secretary",
      "treasurer",
      "head",
      "core",
      "member",
    ];

    if (position && !allowedPositions.includes(position)) {
      return res.status(400).json({
        success: false,
        message: "Invalid position selected",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const [existingUser, existingAdmin] = await Promise.all([
      User.findOne({ email: normalizedEmail }),
      Admin.findOne({ email: normalizedEmail }),
    ]);

    if (existingUser || existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // 🔐 hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 🔥 SAFE CREATE
    const user = await User.create({
      fullName: { firstName, lastName },
      email: normalizedEmail,
      password: hashedPassword,
      position: position || "member", // 🔥 FIX
      department,
      canLogin: false,
    });

    return res.status(201).json({
      success: true,
      message: "Registered successfully. Wait for approval",
      data: user,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}




async function loginMember(req, res) {
  try {
    const { email, password } = req.body;

    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!isMedicapsEmail(normalizedEmail)) {
      return res.status(400).json({
        message: "Only @medicaps.ac.in email allowed",
      });
    }

    let user = await User.findOne({
      email: normalizedEmail,
    });

    const leadershipAdmin = await Admin.findOne({
      email: normalizedEmail,
      status: "allow",
      position: { $in: LEADERSHIP_ADMIN_POSITIONS },
    });

    if (leadershipAdmin) {
      user = await syncLeadershipAdminToMember(leadershipAdmin);
    }

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 🔥 MAIN ISSUE FIX (head login problem)
    if (!user.canLogin) {
      return res.status(403).json({
        message: "Admin approval required",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "Account blocked",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.position,
        type: "member", // ✅ VERY IMPORTANT
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("memberToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    res.json({
      message: "Login successful",
      memberToken: token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        position: user.position,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}


async function updateMemberApproval(req, res) {
  try {
    const { id } = req.params;
    const { approved } = req.body;

    if (typeof approved !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "approved must be true or false",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    user.canLogin = approved;
    if (approved) {
      user.isActive = true;
    }
    user.approvedBy = approved ? req.admin?._id : null;
    await user.save();

    return res.json({
      success: true,
      message: approved ? "Member approved successfully" : "Member approval revoked",
      data: {
        _id: user._id,
        email: user.email,
        canLogin: user.canLogin,
        approvedBy: user.approvedBy,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function rejectMemberApproval(req, res) {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    user.canLogin = false;
    user.isActive = false;
    user.approvedBy = null;
    await user.save();

    return res.json({
      success: true,
      message: "Member rejected successfully",
      data: {
        _id: user._id,
        email: user.email,
        canLogin: user.canLogin,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
async function getProfile(req, res) {
  try {
    const user = req.user;

    res.json({
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      position: user.position,
      department: user.department,
      profileImage: user.profileImage,
      phone: user.phone,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}
 
async function logoutMember(req, res) {

try {
  res.clearCookie("memberToken", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });
  res.json({ message: "Logout successful" });
} catch (error) {
  console.error("Logout error:", error);
  res.status(500).json({ message: error.message });
}


}


async function updateProfile(req, res) {
try {
  const user = req.user;
  const { username, email, phone, firstName, lastName } = req.body;

  // text updates
  if (username !== undefined) user.username = username;
  if (email !== undefined) user.email = email;
  if (phone !== undefined) user.phone = phone;
  if (firstName !== undefined) user.fullName.firstName = firstName;
  if (lastName !== undefined) user.fullName.lastName = lastName;
  // image updates
  if (req.file) {
    const oldFileId = user.profileImageFileId;
    const uploaded = await uploadImageAsset(req.file, "members/profile");
    user.profileImage = uploaded.url;
    user.profileImageFileId = uploaded.fileId;

    if (oldFileId) {
      await deleteImageByFileId(oldFileId);
    }
  } 
  await user.save();
  res.json({
    message: "Profile updated successfully",
    user: {
      id: user._id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage
    }
  }); 
} catch (error) {
  res.status(500).json({
    message: error.message
  });
}
}

async function deleteMember(req, res) {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    // Delete member profile image from ImageKit if tracked.
    if (user.profileImageFileId) {
      await deleteImageByFileId(user.profileImageFileId);
    }

    // Delete all member chat messages.
    await ChatMessage.deleteMany({
      senderType: "member",
      senderId: user._id,
    });

    await user.deleteOne();

    return res.json({
      success: true,
      message: "Member and related data deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function getMembers(req, res) {
  try {
    const members = await User.find()
      .select("fullName email position department profileImage canLogin isActive approvedBy createdAt")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: members,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Public endpoint: show only approved and active members without login
async function getPublicMembers(req, res) {
  try {
    const leadershipPositions = ["president", "vice-president", "presedent"];

    const [members, leadershipAdmins] = await Promise.all([
      User.find({
        isActive: true,
        $or: [
          { canLogin: true },
          { position: { $in: leadershipPositions } }
        ]
      })
        .select("fullName email position department profileImage createdAt")
        .sort({ createdAt: -1 }),
      Admin.find({
        status: "allow",
        $or: [
          { role: { $in: leadershipPositions } },
          { position: { $in: leadershipPositions } },
        ],
      }).select("fullName email role position profileImage createdAt")
    ]);

    const memberEmailSet = new Set(
      members
        .map((member) => (member.email || "").toLowerCase())
        .filter(Boolean)
    );

    const adminAsTeamMembers = leadershipAdmins
      .filter((admin) => !memberEmailSet.has((admin.email || "").toLowerCase()))
      .map((admin) => ({
        _id: `admin-${admin._id}`,
        fullName: admin.fullName,
        email: admin.email,
        position: (admin.position || admin.role) === "presedent" ? "president" : (admin.position || admin.role),
        department: "Administration",
        profileImage: admin.profileImage,
        createdAt: admin.createdAt,
      }));

    const teamMembers = [...members, ...adminAsTeamMembers]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const positionCounts = teamMembers.reduce((acc, member) => {
      const key = member.position || "member";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return res.json({
      success: true,
      summary: {
        totalApprovedMembers: teamMembers.length,
        positionCounts,
      },
      data: teamMembers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}




module.exports = {
  register,
  loginMember,
  getProfile,
  logoutMember,
  updateProfile,
  updateMemberApproval,
  rejectMemberApproval,
  deleteMember,
  getMembers,
  getPublicMembers

};