const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    

    if (!decoded.id) {
      return res.status(401).json({ message: "Invalid token payload (Missing ID)" });
    }

    req.user = { id: decoded.id }; // Attach only user ID to request for security
    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

const checkIfLoggedIn = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return res.status(400).json({ message: "Already logged in", userId: decoded.id });
    } catch (err) {
      console.error("Invalid login check token:", err.message);
      return res.status(401).json({ message: "Invalid token" });
    }
  }

  next();
};

module.exports = { verifyToken, checkIfLoggedIn };
