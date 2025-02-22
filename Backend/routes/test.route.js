const express = require("express");
const router = express.Router();
const { shouldBeLoggedIn } = require("../Controllers/test.controller");
const { verifyToken } = require("../Middleware/auth.middleware");

router.get("/protected", verifyToken, shouldBeLoggedIn);

module.exports = router;
