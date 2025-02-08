const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; 

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next(); 
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};


const checkIfLoggedIn = (req, res, next) => {
  const token = req.cookies.token; 
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return res.status(400).json({ message: "Already logged in", userId: decoded.userId });
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  }

  next(); 
};

module.exports = { verifyToken, checkIfLoggedIn };
