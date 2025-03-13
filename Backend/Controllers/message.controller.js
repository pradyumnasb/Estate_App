const Chat = require("../models/Chat.modal");
const Message = require("../models/Message.modal");
const mongoose = require("mongoose");

const addMessage = async (req, res, next) => {
  const tokenUserId = req.user?.id;  // ✅ Ensure the token user ID is set
  const chatId = req.params.chatId;
  const text = req.body.text;

  // ✅ Validate chatId format
  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    console.log("❌ Invalid Chat ID format!");
    return res.status(400).json({ message: "Invalid chat ID!" });
  }

  try {
    console.log("🔍 Checking if chat exists...");
    const chat = await Chat.findOne({
      _id: chatId,
      users: { $in: [tokenUserId] }
    });

    console.log("📌 Chat Found:", chat);

    if (!chat) {
      console.log("❌ Chat not found for user!");
      return res.status(404).json({ message: "Chat not found!" });
    }

    // ✅ Create and Save Message
    const message = new Message({
      text,
      chat: chatId,
      userId: tokenUserId,
    });

    console.log("📝 Saving message...", message);
    await message.save();
    console.log("✅ Message saved successfully!");

    // ✅ Update Chat with the new message
    console.log("🔄 Updating chat with new message...");
    const updateResult = await Chat.updateOne(
      { _id: chatId },
      {
        $set: { lastMessage: text },
        $push: { messages: message._id },
        $addToSet: { seenBy: tokenUserId }
      }
    );

    console.log("✅ Chat updated!", updateResult);

    res.status(201).json(message);
  } catch (err) {
    console.error("❌ Error adding message:", err.message);
    next(err);
  }
};



const getMessages = async (req, res, next) => {
  const chatId = req.params.chatId;
  const tokenUserId = req.user.id; // Ensure this is correct

  console.log("Fetching messages for Chat ID:", chatId);

  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    return res.status(400).json({ message: "Invalid chat ID!" });
  }

  try {
    const chat = await Chat.findOne({
      _id: chatId,
      users: { $in: [tokenUserId] } // Ensure user is part of the chat
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found!" });
    }

    const messages = await Message.find({ chat: chatId })
      .sort({ createdAt: 1 }) // Sort by oldest to newest
      .populate("userId", "name"); // Populate sender info if needed

    res.status(200).json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err.message);
    next(err);
  }
};

module.exports = { addMessage, getMessages };

