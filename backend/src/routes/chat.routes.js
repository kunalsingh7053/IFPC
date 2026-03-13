const express = require("express");
const { chatAuthMiddleware } = require("../middleware/chat.middleware");
const chatController = require("../controllers/chat.controller");

const router = express.Router();

// Only logged-in admins or members can send, read and delete chat messages
router.post("/messages", chatAuthMiddleware, chatController.sendMessage);
router.get("/messages", chatAuthMiddleware, chatController.getMessages);
router.delete("/messages/:id", chatAuthMiddleware, chatController.deleteMessage);

module.exports = router;
