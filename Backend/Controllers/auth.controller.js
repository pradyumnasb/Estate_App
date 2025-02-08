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

    const age = 1000 * 60 * 60 * 24 * 7;  // Token expiration: 7 days
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: age,
    });

    const userInfo = user.toObject();
    delete userInfo.password;

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: age,
    });

    
    res.status(200).json({ message: "Login successful", token, user: userInfo });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Login failed due to server error" });
  }
};


const logout = async (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logged out" });
};

module.exports = { register, login, logout };
