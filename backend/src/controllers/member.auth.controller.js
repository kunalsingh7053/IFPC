const User = require("../models/member.model");
const Admin = require("../models/admin.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { uploadImage } = require("../service/imagekit.service");

const MEDICAPS_EMAIL_DOMAIN = "@medicaps.ac.in";
const isMedicapsEmail = (email = "") =>
  String(email).trim().toLowerCase().endsWith(MEDICAPS_EMAIL_DOMAIN);

async function register(req, res) {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      position,
      department,
    } = req.body;

    // check required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    if (!isMedicapsEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Only @medicaps.ac.in email is allowed",
      });
    }

    // check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const user = await User.create({
      fullName: {
        firstName,
        lastName,
      },
      email,
      password: hashedPassword,
      position,
      department,

      // allow login right after registration
      canLogin: true,
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

    if (!isMedicapsEmail(email)) {
      return res.status(400).json({
        message: "Only @medicaps.ac.in email is allowed",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // approval check
    if (!user.canLogin) {
      return res.status(403).json({
        message: "Not approved yet",
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

    // create token
    const token = jwt.sign(
      {
        id: user._id,
        type: "member",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // cookie
    res.cookie("memberToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      memberToken: token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        position: user.position,
      },
    });

  } catch (error) {
    res.status(500).json({
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
    const imageUrl = await uploadImage(req.file, "members/profile");
    user.profileImage = imageUrl;
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

async function getMembers(req, res) {
  try {
    const members = await User.find()
      .select("fullName email position department profileImage canLogin isActive createdAt")
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
  getMembers,
  getPublicMembers

};