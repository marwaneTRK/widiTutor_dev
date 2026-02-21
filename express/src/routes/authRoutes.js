const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const CLIENT_URL = process.env.CLIENT_URL || process.env.FRONTEND_URL || "http://localhost:5173";

// REGISTER
router.post("/register", authController.register);

// LOGIN
router.post("/login", authController.login);

// FORGOT PASSWORD
router.post("/forgot-password", authController.forgotPassword);

// RESET PASSWORD
router.post("/reset-password", authController.resetPassword);

// GOOGLE LOGIN START
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// GOOGLE CALLBACK
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${CLIENT_URL}/?error=oauth_failed`,
  }),
  authController.googleCallback
);

// VERIFY EMAIL
router.get("/verify/:token", authController.verifyEmail);

// GET CURRENT USER
router.get("/me", authMiddleware, authController.me);

module.exports = router;
