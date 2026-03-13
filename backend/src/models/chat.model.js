const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema(
  {
    // "member" or "admin"
    senderType: {
      type: String,
      enum: ["member", "admin"],
      required: true,
    },
    // ID of the member/admin who sent the message
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);

module.exports = ChatMessage;
