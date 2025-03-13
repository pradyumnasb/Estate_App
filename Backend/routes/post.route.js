const express = require("express");
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getPostsByUser,
  savePost,
  getSavedPosts,
} = require("../Controllers/post.controller");
const { verifyToken } = require("../Middleware/auth.middleware");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// 🔹 Upload helper function for Cloudinary
const uploadToCloudinary = async (buffer) => {
  try {
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
      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error("Unexpected Cloudinary Upload Error:", error);
    throw error;
  }
};

// 🔹 Post Routes
router.post("/", verifyToken, upload.array("images", 5), createPost);
router.get("/", getAllPosts);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);

// 🔹 User-specific Post Routes
router.get("/user/:userId", verifyToken, getPostsByUser);
router.get("/saved", verifyToken, getSavedPosts); // ✅ FIXED: Ensure fetching saved posts works
router.post("/save/:postId", verifyToken, savePost); // Save/Unsave post
router.get("/:id", getPostById);

// 🔹 Test Image Upload Route
router.post("/test-upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const imageUrl = await uploadToCloudinary(req.file.buffer);
    res.json({ imageUrl });
  } catch (err) {
    console.error("Image Upload Error:", err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

module.exports = router;
