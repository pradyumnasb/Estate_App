const User = require("../models/user.modal");
const bcrypt = require("bcrypt");

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find(); // Mongoose query
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get users!" });
  }
};

// Get a single user by ID
exports.getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found!" });
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get user!" });
  }
};

// Update user ✅ FIXED
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { password, ...updateData } = req.body;

  if (req.user.id !== id) {
    return res.status(403).json({ message: "Not Authorized!" });
  }

  try {
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedUser) return res.status(404).json({ message: "User not found!" });

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user!" });
  }
};

// Delete user ✅ FIXED
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    console.log("Request Params ID:", id);
    console.log("Decoded User ID from Token:", req.user.id);
  
    if (String(req.user.id) !== String(id)) {
      return res.status(403).json({ message: "Not Authorized!" });
    }
  
    try {
      await User.findByIdAndDelete(id);
      res.status(200).json({ message: "User deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to delete user!" });
    }
  };
  
// Save a post
exports.savePost = async (req, res) => {
  const { postId } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found!" });

    if (user.savedPosts?.includes(postId)) {
      user.savedPosts = user.savedPosts.filter((id) => id !== postId);
      await user.save();
      res.status(200).json({ message: "Post removed from saved list" });
    } else {
      user.savedPosts = [...(user.savedPosts || []), postId];
      await user.save();
      res.status(200).json({ message: "Post saved" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save post!" });
  }
};

// Get user posts
exports.profilePosts = async (req, res) => {
  const userId = req.user.id;
  try {
    const userPosts = await Post.find({ userId });
    res.status(200).json({ userPosts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get profile posts!" });
  }
};

// Get notification count
exports.getNotificationNumber = async (req, res) => {
  const userId = req.user.id;
  try {
    const number = await Chat.countDocuments({
      userIDs: userId,
      seenBy: { $ne: userId },
    });
    res.status(200).json(number);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get notifications!" });
  }
};