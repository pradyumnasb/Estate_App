const express = require("express");
const router = express.Router();
const bookingController = require("../Controllers/booking.controller");
const { verifyToken } = require("../Middleware/auth.middleware"); // Import middleware

// ✅ Ensure createBooking is protected by verifyToken
router.post("/create", verifyToken, bookingController.createBooking);

router.get("/status/:workerId/:userId", verifyToken, bookingController.getBookingStatus);


module.exports = router;
