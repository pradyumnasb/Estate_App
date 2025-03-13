const express = require("express");
const { getChats, getChat, addChat, readChat, deleteChat } = require("../Controllers/chat.controller.js"); // Added deleteChat
const { verifyToken } = require("../Middleware/auth.middleware.js");

const router = express.Router();

router.get("/", verifyToken, getChats);
router.get("/:id", verifyToken, getChat);
router.post("/", verifyToken, addChat);
router.put("/read/:id", verifyToken, readChat);
router.delete("/:id", verifyToken, deleteChat); // ✅ Added DELETE route

module.exports = router;
