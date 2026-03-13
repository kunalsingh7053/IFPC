const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    fullName: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
    },

    email: {
      type: String,
      required: true,
      unique: true,
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
        "member",
      ],
      default: "member",
    },

    department: {
      type: String,
    },

    // ✅ login allowed or not
    canLogin: {
      type: Boolean,
      default: false,
    },

    // ✅ who approved this user
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ✅ account active or blocked
    isActive: {
      type: Boolean,
      default: true,
    },

    profileImage: String,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("members", memberSchema);

module.exports = User;