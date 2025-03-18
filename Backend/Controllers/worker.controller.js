const Worker = require("../models/worker.model");
const User = require("../models/user.modal");
const cloudinary = require("cloudinary").v2;

// ✅ Cloudinary Configuration (Ensure environment variables are set)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔹 Upload helper function for Cloudinary
const uploadToCloudinary = async (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "image", folder: "workers" },
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
};

// 🔹 Register Worker
const registerWorker = async (req, res) => {
  try {
    console.log("Received Data:", req.body);

    const { category, specialties } = req.body;

    // ✅ Ensure hourly_rate and experience are parsed correctly
    const hourly_rate = parseFloat(req.body.hourly_rate);
    const experience = parseInt(req.body.experience, 10);

    console.log("Parsed hourly_rate:", hourly_rate);
    console.log("Parsed experience:", experience);

    if (isNaN(hourly_rate) || hourly_rate <= 0) {
      return res.status(400).json({ message: "Hourly rate must be a valid number greater than 0" });
    }
    if (isNaN(experience) || experience < 0) {
      return res.status(400).json({ message: "Experience must be a valid non-negative number" });
    }

    const userId = req.user.id;
    const existingWorker = await Worker.findOne({ userId });

    if (existingWorker) {
      return res.status(400).json({ message: "You are already registered as a worker" });
    }

    // 🔹 Upload profile image if provided
    let profileImageUrl = "";
    if (req.file) {
      profileImageUrl = await uploadToCloudinary(req.file.buffer);
    }

    // 🔹 Create Worker Profile
    const newWorker = new Worker({
      userId,
      category,
      hourly_rate,
      experience,
      specialties: Array.isArray(specialties) ? specialties : [specialties], // Ensure it's an array
      profileImage: profileImageUrl,
    });

    await newWorker.save();
    await User.findByIdAndUpdate(userId, { role: "worker" });

    res.status(201).json({ message: "Worker profile created successfully", worker: newWorker });
  } catch (error) {
    console.error("Worker registration error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Get all Workers
const getAllWorkers = async (req, res) => {
  try {
    const workers = await Worker.find().populate("userId", "username email");
    res.status(200).json(workers);
  } catch (error) {
    console.error("Error fetching workers:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Get a Worker by User ID
const getWorkerByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const worker = await Worker.findOne({ userId }).populate("userId", "username email");

    if (!worker) {
      return res.status(404).json({ message: "Worker profile not found" });
    }

    res.status(200).json(worker);
  } catch (error) {
    console.error("Error fetching worker:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerWorker, getAllWorkers, getWorkerByUserId };
