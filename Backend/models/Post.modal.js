const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  images: { type: [String], required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  bedroom: { type: Number, required: true },
  bathroom: { type: Number, required: true },
  latitude: { type: Number, required: true },  
  longitude: { type: Number, required: true }, 
  type: { type: String, enum: ["buy", "rent"], required: true }, 
  property: { type: String, enum: ["apartment", "house", "condo", "land"], required: true }, 
  createdAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  postDetail: { type: mongoose.Schema.Types.ObjectId, ref: "PostDetail" },
  savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" }, // ✅ Add this field
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
