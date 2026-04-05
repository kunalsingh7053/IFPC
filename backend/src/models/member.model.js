const mongoose = require("mongoose");
const ChatMessage = require("./chat.model");

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
      ref: "Admin",
      default: null,
    },

    // ✅ account active or blocked
    isActive: {
      type: Boolean,
      default: true,
    },

    profileImage: String,
    profileImageFileId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Cascade delete member chat messages when member is deleted via document.deleteOne().
memberSchema.pre("deleteOne", { document: true, query: false }, async function () {
  await ChatMessage.deleteMany({
    senderType: "member",
    senderId: this._id,
  });
});

// Cascade delete member chat messages when member is deleted via findOneAndDelete/findByIdAndDelete.
memberSchema.pre("findOneAndDelete", async function () {
  const doc = await this.model.findOne(this.getFilter()).select("_id");
  if (!doc) return;

  await ChatMessage.deleteMany({
    senderType: "member",
    senderId: doc._id,
  });
});

const User = mongoose.model("members", memberSchema);

module.exports = User;