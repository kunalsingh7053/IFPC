// models/member.model.js

const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    fullName: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    position: {
      type: String,
      enum: [
        "president",
        "vice-president",
        "secretary",
        "treasurer",
        "head",
        "core",
        "member",
      ],
      default: "member",
    },

    department: String,

    canLogin: { type: Boolean, default: false },

    isActive: { type: Boolean, default: true },

    // ✅ ADD THIS BACK (VERY IMPORTANT)
    profileImage: {
      type: String,
      default: "",
    },

    profileImageFileId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("members", memberSchema);