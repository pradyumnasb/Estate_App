
const express = require('express');
const router = express.Router();
const { shouldBeLoggedIn} = require('../Controllers/test.controller'); 

router.get("/should-be-logged-in", shouldBeLoggedIn, (req, res) => {
    res.status(200).json({ message: "User is logged in" });
});

module.exports = router;
