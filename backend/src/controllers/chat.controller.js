const ChatMessage = require("../models/chat.model");

// POST /api/chat/messages
async function sendMessage(req, res) {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const chatUser = req.chatUser;

    if (!chatUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const newMessage = await ChatMessage.create({
      senderType: chatUser.type,
      senderId: chatUser.id,
      senderName: chatUser.name,
      message: message.trim(),
    });

    return res.status(201).json({
      success: true,
      data: newMessage,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

// GET /api/chat/messages
async function getMessages(req, res) {
  try {
    const messages = await ChatMessage.find()
      .sort({ createdAt: 1 });

    return res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

// DELETE /api/chat/messages/:id
// Admin can delete any message
// Member can delete only their own message
async function deleteMessage(req, res) {
  try {
    const { id } = req.params;
    const chatUser = req.chatUser;

    if (!chatUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const message = await ChatMessage.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    const isAdmin = chatUser.type === "admin";
    const isSender =
      message.senderType === chatUser.type &&
      String(message.senderId) === String(chatUser.id);

    if (!isAdmin && !isSender) {
      return res.status(403).json({
        success: false,
        message: "Not allowed to delete this message",
      });
    }

    await message.deleteOne();

    return res.json({
      success: true,
      message: "Message deleted",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

module.exports = {
  sendMessage,
  getMessages,
  deleteMessage,
};
