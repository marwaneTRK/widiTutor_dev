const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/authController");

// REGISTER
router.post("/register", authController.register);

// LOGIN
router.post("/login", authController.login);

// GOOGLE LOGIN START
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// GOOGLE CALLBACK
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  authController.googleCallback
);

module.exports = router;
