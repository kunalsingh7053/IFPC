const User = require("../models/member.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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

      // important
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




module.exports = {
  register,
  loginMember,
  getProfile,
  logoutMember,
  updateProfile

};