const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// REGISTER (already exists)
router.post("/register", authController.register);

// LOGIN
router.post("/login", authController.login);

module.exports = router;
