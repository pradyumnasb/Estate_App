const express = require("express");
const { registerWorker, getAllWorkers, getWorkerByUserId } = require("../Controllers/worker.controller");
const { verifyToken } = require("../Middleware/auth.middleware");  // ✅ Fix import
const multer = require("multer");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/register", verifyToken, upload.single("profileImage"), registerWorker);

// Get All Workers
router.get("/", getAllWorkers);

// Get a Worker by User ID
router.get("/:userId", getWorkerByUserId);

module.exports = router;
