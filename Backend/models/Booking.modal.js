const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: "Worker", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  problemDescription: { type: String, required: true }, // ✅ Added problem description
  status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" },
  createdAt: { type: Date, default: Date.now, expires: 1800 }, // Auto-delete after 30 min
});

module.exports = mongoose.model("Booking", bookingSchema);
