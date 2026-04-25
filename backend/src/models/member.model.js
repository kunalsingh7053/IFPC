const mongoose = require("mongoose");
const ChatMessage = require("./chat.model");

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
    },

    password: {
      type: String,
      required: true,
    },

    // ✅ FIXED (added "core")
    position: {
      type: String,
      enum: [
        "president",
        "vice-president",
        "secretary",
        "treasurer",
        "head",
        "core",   // 🔥 ADDED
        "member",
      ],
      default: "member",
    },

    department: String,

    canLogin: { type: Boolean, default: false },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },

    isActive: { type: Boolean, default: true },

    profileImage: String,
    profileImageFileId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Cascade delete
memberSchema.pre("deleteOne", { document: true, query: false }, async function () {
  await ChatMessage.deleteMany({
    senderType: "member",
    senderId: this._id,
  });
});

memberSchema.pre("findOneAndDelete", async function () {
  const doc = await this.model.findOne(this.getFilter()).select("_id");
  if (!doc) return;

  await ChatMessage.deleteMany({
    senderType: "member",
    senderId: doc._id,
  });
});

module.exports = mongoose.model("members", memberSchema);