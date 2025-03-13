const express = require("express");
const mongoose = require("mongoose");
const Post = require("../models/Post.modal");
const PostDetail = require("../models/PostDetail.modal");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { verifyToken } = require("../Middleware/auth.middleware");
const User = require("../models/user.modal");
const SavedPost = require("../models/SavedPost.modal");

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Storage Config
const storage = multer({ storage: multer.memoryStorage() });
const upload = storage.array("images", 5);

// Create Post
const createPost = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    // Upload images to Cloudinary
    const imageUrls = await Promise.all(
      req.files.map(async (file) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "image" },
            (error, result) => {
              if (error) {
                console.error("Cloudinary Upload Error:", error);
                reject(error);
              } else {
                resolve(result.secure_url);
              }
            }
          );
          uploadStream.end(file.buffer);
        });
      })
    );

    // Create the Post
    const post = new Post({
      title: req.body.title,
      price: req.body.price,
      images: imageUrls,
      address: req.body.address,
      city: req.body.city,
      bedroom: req.body.bedroom,
      bathroom: req.body.bathroom,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      type: req.body.type.toLowerCase(),
      property: req.body.property.toLowerCase(),
      user: req.user.id,
    });

    await post.save();
    console.log("Post created:", post);

    if (req.body.desc) {
      const postDetail = new PostDetail({
        desc: Array.isArray(req.body.desc) ? req.body.desc.join(" ") : req.body.desc || "",
        utilities: req.body.utilities || "",
        pet: typeof req.body.pet === "string" ? req.body.pet.trim() : "not-allowed",
        income: req.body.income || "",
        size: req.body.size || "",
        school: req.body.school || "",
        bus: req.body.bus || "",
        restaurant: req.body.restaurant || "",
        post: post._id,
      });

      await postDetail.save();
      console.log("PostDetail created:", postDetail);

      post.postDetail = postDetail._id;
      await post.save();
    }

    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Posts by User
const getPostsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ user: userId })
      .populate("user", "username")
      .select("-postDetail");

    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts by user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Save/Unsave Post
const savePost = async (req, res) => {
  try {
    let { postId } = req.params;
    
    // Debug: Log postId before processing
    console.log("Received postId:", postId);

    // Trim and validate ObjectId format
    postId = postId.trim();

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      console.log("Invalid ObjectId format:", postId);
      return res.status(400).json({ message: "Invalid postId format" });
    }

    const userId = req.user.id;
    const existingSavedPost = await SavedPost.findOne({ user: userId, post: postId });

    if (existingSavedPost) {
      await SavedPost.deleteOne({ _id: existingSavedPost._id });
      return res.json({ message: "Post unsaved successfully", saved: false });
    }

    const newSavedPost = new SavedPost({ user: userId, post: postId });
    await newSavedPost.save();
    res.json({ message: "Post saved successfully", saved: true });

  } catch (error) {
    console.error("Error saving post:", error);
    res.status(500).json({ message: "Error saving post", error: error.message });
  }
};

// Get Saved Posts
const getSavedPosts = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    const userId = req.user.id;
    const savedPosts = await SavedPost.find({ user: userId }).populate("post");

    const validSavedPosts = savedPosts.filter(savedPost => savedPost.post);
    res.json(validSavedPosts);
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get All Posts
const getAllPosts = async (req, res) => {
  try {
    let query = {};

    if (req.query.city) {
      query.city = { $regex: new RegExp(req.query.city, "i") };
    }
    if (req.query.type) {
      query.type = req.query.type.toLowerCase();
    }
    if (req.query.property) {
      query.property = req.query.property.toLowerCase();
    }
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }
    if (req.query.bedroom) {
      query.bedroom = Number(req.query.bedroom);
    }

    const posts = await Post.find(query)
      .populate("user", "username")
      .select("-postDetail");

    res.json(posts);
  } catch (error) {
    console.error("Error fetching filtered posts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Single Post by ID
const getPostById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid post ID" });
  }

  try {
    const post = await Post.findById(id)
      .populate("postDetail")
      .populate("user", "username email");

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update Post
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    Object.assign(post, req.body);
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.postDetail) {
      await PostDetail.findByIdAndDelete(post.postDetail);
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createPost, getAllPosts, getPostById, updatePost, deletePost, getPostsByUser, savePost, getSavedPosts };
