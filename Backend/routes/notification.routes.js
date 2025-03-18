const express = require("express");
const Notification = require("../models/notification.modal");
const router = express.Router();

// ✅ Get notifications for a worker
router.get("/:workerId", async (req, res) => {
  try {
    const { workerId } = req.params;

    if (!workerId) {
      return res.status(400).json({ message: "Worker ID is required" });
    }

    console.log(`🔍 Fetching notifications for worker: ${workerId}`);

    const notifications = await Notification.find({ workerId }).sort({ timestamp: -1 });

    res.json(notifications || []); // Ensure response is always an array
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications", error: error.message });
  }
});

// ✅ Mark notification as read
router.put("/:notificationId", async (req, res) => {
  try {
    const { notificationId } = req.params;

    if (!notificationId) {
      return res.status(400).json({ message: "Notification ID is required" });
    }

    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      { status: "read" },
      { new: true } // Return updated notification
    );

    if (!updatedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "✅ Notification marked as read", notification: updatedNotification });
  } catch (error) {
    console.error("❌ Error updating notification:", error);
    res.status(500).json({ message: "Error updating notification", error: error.message });
  }
});

module.exports = router;
