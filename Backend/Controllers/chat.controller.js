const Chat = require("../models/Chat.modal");
const User = require("../models/user.modal");
const Post = require("../models/Post.modal");
const Message = require("../models/Message.modal");
const mongoose = require("mongoose");

const getChats = async (req, res, next) => {
  const tokenUserId = req.user?.id; // Fix here

  if (!tokenUserId) {
    return res.status(401).json({ message: "Unauthorized: Token user ID not found" });
  }

  try {
    const chats = await Chat.find({ users: tokenUserId }).populate("users", "id username avatar");

    const formattedChats = chats.map(chat => {
      const receiver = chat.users.find(user => user._id.toString() !== tokenUserId);
      return { ...chat.toObject(), receiver };
    });

    res.status(200).json(formattedChats);
  } catch (err) {
    console.error("Error fetching chats:", err.message);
    next(err);
  }
};

const deleteChat = async (req, res) => {
  const tokenUserId = req.user?.id;
  const { id } = req.params; // Chat ID from request

  if (!tokenUserId) {
    return res.status(401).json({ message: "Unauthorized: Token user ID not found" });
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid chat ID!" });
    }

    // Find the chat
    const chat = await Chat.findById(id);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found!" });
    }

    // Delete messages related to this chat
    await Message.deleteMany({ chat: id });

    // Delete chat itself
    await Chat.findByIdAndDelete(id);

    // Remove chatId from any related Post
    await Post.updateMany({ chatId: id }, { $unset: { chatId: "" } });

    return res.status(200).json({ message: "Chat deleted successfully!" });
  } catch (err) {
    console.error("Error deleting chat:", err.message);
    res.status(500).json({ message: "Failed to delete chat!" });
  }
};


const getChat = async (req, res, next) => {
  const tokenUserId = req.user?.id;

  console.log("User from token:", req.user); 
  console.log("Chat ID from params:", req.params.id); 

  if (!tokenUserId) {
    return res.status(401).json({ message: "Unauthorized: Token user ID not found" });
  }

  // ✅ Validate chat ID before querying
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid chat ID!" });
  }

  try {
    const chat = await Chat.findOne({ _id: req.params.id, users: tokenUserId })
      .populate("messages")
      .exec();

    console.log("Fetched Chat:", chat);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found!" });
    }

    await Chat.updateOne(
      { _id: req.params.id },
      { $addToSet: { seenBy: tokenUserId } }
    );

    res.status(200).json(chat);
  } catch (err) {
    console.error("Error fetching chat:", err.message);
    next(err);
  }
};



const addChat = async (req, res) => {
  const tokenUserId = req.user?.id;
  const { postId } = req.body;

  if (!tokenUserId) {
    return res.status(401).json({ message: "Unauthorized: Token user ID not found" });
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post ID provided!" });
    }

    // ✅ Fetch post details
    const post = await Post.findById(postId);
    console.log("Fetched Post:", post); // 🔴 Debug log

    if (!post) {
      return res.status(404).json({ message: "Post not found!" });
    }

    const receiverId = post.user;
    console.log("Receiver ID:", receiverId); // 🔴 Debug log

    if (!receiverId || !mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ message: "Invalid post owner ID!" });
    }

    let existingChat = await Chat.findOne({
      users: { $all: [tokenUserId, receiverId] }
    }).populate("users", "id username avatar");

    if (existingChat) {
      return res.status(200).json(existingChat);
    }

    const newChat = new Chat({
      users: [tokenUserId, receiverId],
      messages: [],
      seenBy: [],
    });

    await newChat.save();
    await Post.findByIdAndUpdate(postId, { chatId: newChat._id });

    res.status(201).json(newChat);
  } catch (err) {
    console.error("Error creating chat:", err);
    res.status(500).json({ message: "Failed to create chat!" });
  }
};





const readChat = async (req, res, next) => {
  const tokenUserId = req.user?.id; // Fix here

  if (!tokenUserId) {
    return res.status(401).json({ message: "Unauthorized: Token user ID not found" });
  }

  try {
    const chat = await Chat.findOneAndUpdate(
      { _id: req.params.id, users: tokenUserId },
      { $addToSet: { seenBy: tokenUserId } },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ message: "Chat not found!" });
    }

    res.status(200).json(chat);
  } catch (err) {
    console.error("Error marking chat as read:", err.message);
    next(err);
  }
};

module.exports = { getChats, getChat, addChat, readChat, deleteChat };
