const jwt = require("jsonwebtoken");

exports.shouldBeLoggedIn = async (req, res) => {
  console.log(req.userId);
  res.status(200).json({ message: "You are Authenticated" });
};
