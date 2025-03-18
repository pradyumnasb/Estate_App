const Booking = require("../models/Booking.modal");
const Worker = require("../models/worker.model");
const User = require("../models/user.modal");
const Notification = require("../models/notification.modal"); 
const io = require("../socket"); // Importing socket instance

// ✅ Create a new booking function
const createBooking = async (req, res) => {
  try {
    const { workerId, userId, date, time, address, phoneNumber, problemDescription } = req.body;

    if (!workerId || !userId || !date || !time || !address || !phoneNumber || !problemDescription) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if worker exists
    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    // Prevent duplicate active bookings
    const existingBooking = await Booking.findOne({
      workerId,
      userId,
      status: { $in: ["pending", "accepted"] },
    });
    if (existingBooking) {
      return res.status(400).json({ message: "You already have an active booking with this worker." });
    }

    // Create new booking entry
    const newBooking = new Booking({
      workerId,
      userId,
      date,
      time,
      address,
      phoneNumber,
      problemDescription,
      status: "pending",
    });

    await newBooking.save();

    // Add booking reference to worker's pending bookings
    worker.pendingBookings.push(newBooking._id);
    await worker.save();

    // ✅ STORE NOTIFICATION IN DATABASE
    const notification = {
      workerId,
      message: `New booking request from user ${userId}`,
      bookingId: newBooking._id,
      status: "unread",
      timestamp: new Date(),
    };

    // Assuming you have a Notification model
    await Notification.create(notification); 

    // ✅ EMIT REAL-TIME NOTIFICATION TO WORKER
    io.getIO().to(workerId.toString()).emit("newBooking", {
      message: "New booking request received",
      booking: newBooking,
    });

    // Auto-decline if no response in 30 mins
    setTimeout(async () => {
      const booking = await Booking.findById(newBooking._id);
      if (booking && booking.status === "pending") {
        booking.status = "declined";
        await booking.save();
        io.getIO().to(workerId.toString()).emit("bookingDeclined", { message: "Booking auto-declined" });
      }
    }, 30 * 60 * 1000); // 30 minutes

    res.status(201).json({ message: "Booking request sent!", booking: newBooking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


const getBookingStatus = async (req, res) => {
  try {
    const { workerId, userId } = req.params;
    console.log("Checking booking for:", { workerId, userId }); // ✅ Debug log

    const booking = await Booking.findOne({
      workerId,
      userId,
      status: { $in: ["pending", "accepted"] },
    });

    console.log("Booking found:", booking); // ✅ Check if booking is found

    if (!booking) {
      return res.json({ status: "none" });
    }

    res.json({ status: booking.status });
  } catch (error) {
    console.error("Error fetching booking status:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


// ✅ Export the function properly
module.exports = {
  createBooking,
  getBookingStatus, // ✅ Make sure this is correctly exported
};