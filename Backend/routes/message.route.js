const express = require("express");
const { addMessage, getMessages } = require("../Controllers/message.controller.js");
const { verifyToken } = require("../middleware/auth.middleware.js");

const router = express.Router();

// Route to send a message
router.post("/:chatId", verifyToken, addMessage);

// Route to fetch messages
router.get("/:chatId", verifyToken, getMessages);

module.exports = router;
