const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); // Debugging

    if (!decoded.id) {
      return res.status(401).json({ message: "Invalid token payload (Missing ID)" });
    }

    req.user = decoded;  // Attach decoded token to request
    console.log("User ID from Token:", req.user.id); // Debugging
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Remove the cookie check and directly use the Authorization header
const checkIfLoggedIn = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];  // Check the Authorization header for token
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify the token
      return res.status(400).json({ message: "Already logged in", userId: decoded.userId });
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  }

  next(); // No token found, proceed to the next route handler
};

module.exports = { verifyToken, checkIfLoggedIn };
