const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
    },
    hourly_rate: {
      type: Number,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    specialties: {
      type: [String],
      required: true,
    },
    profileImage: {
      type: String,
      required: false,
    },
    rating: {
      type: [Number], // Stores multiple user ratings
      default: [],
    },
    completedJobs: {
      type: Number,
      default: 0,
    },
    pendingBookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      }
    ],
    completedBookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      }
    ],
    location: {
      type: String,
      required: false,
    }
  },
  { timestamps: true }
);

const Worker = mongoose.model("Worker", workerSchema);
module.exports = Worker;
