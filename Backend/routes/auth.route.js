const express = require('express');
const router = express.Router();
const { register, login, logout } = require("../Controllers/auth.controller");
const { checkIfLoggedIn, verifyToken } = require("../Middleware/auth.middleware");

// Register route
router.post("/register", register);

// Login route with check for existing token
router.post("/login", checkIfLoggedIn, login);

// Logout route
router.post("/logout", verifyToken, logout);

module.exports = router;
