const User = require("../models/user.modal");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    console.log(newUser);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User does not exist" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id },  // Use `id` instead of `userId`
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    

    const userInfo = user.toObject();
    delete userInfo.password;

    res.status(200).json({ message: "Login successful", token, user: userInfo });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Login failed due to server error" });
  }
};

const logout = async (req, res) => {
  return res.status(200).json({ message: "Logged out successfully" });
};

module.exports = { register, login, logout };