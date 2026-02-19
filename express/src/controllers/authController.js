const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const { sendVerificationEmail } = require("../utils/sendEmail");
const { registerSchema, loginSchema } = require("../validation/authValidation");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const BACKEND_URL =
  process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
const EMAIL_LOGO_URL = process.env.EMAIL_LOGO_URL || `${BACKEND_URL}/public/logo.svg`;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const VERIFICATION_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

const normalizeEmail = (email = "") => email.trim().toLowerCase();

const signAuthToken = (user) =>
  jwt.sign({ id: user._id.toString(), email: user.email }, process.env.JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

const createVerificationPayload = () => ({
  token: crypto.randomBytes(32).toString("hex"),
  expiresAt: new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS),
});

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  lastName: user.lastName,
  email: user.email,
});

// Register user and send expiring verification email.
const register = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body, {
      abortEarly: true,
      stripUnknown: true,
    });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, lastName, password } = value;
    const email = normalizeEmail(value.email);

    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { token, expiresAt } = createVerificationPayload();

    let user = existingUser;
    if (!user) {
      user = await User.create({
        name,
        lastName,
        email,
        password: hashedPassword,
        isVerified: false,
        verificationToken: token,
        verificationTokenExpires: expiresAt,
      });
    } else {
      user.name = name;
      user.lastName = lastName;
      user.password = hashedPassword;
      user.isVerified = false;
      user.verificationToken = token;
      user.verificationTokenExpires = expiresAt;
      await user.save();
    }

    const verificationUrl = `${BACKEND_URL}/api/auth/verify/${token}`;
    await sendVerificationEmail({
      to: user.email,
      verificationUrl,
      logoUrl: EMAIL_LOGO_URL,
    });

    return res.status(201).json({
      message: "Check your email to verify your account",
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already registered" });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body, {
      abortEarly: true,
      stripUnknown: true,
    });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const email = normalizeEmail(value.email);
    const { password } = value;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res
        .status(401)
        .json({ message: "Please verify your email before logging in." });
    }

    const token = signAuthToken(user);
    return res.status(200).json({
      message: "Login successful",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: "Invalid verification token." });
    }

    if (!user.verificationTokenExpires || user.verificationTokenExpires < new Date()) {
      return res.status(400).json({ message: "Verification token has expired." });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return res.redirect(`${FRONTEND_URL}/?verified=1`);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Verification failed." });
  }
};

const googleCallback = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Google authentication failed" });
    }

    if (!user.isVerified) {
      user.isVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpires = undefined;
      await user.save();
    }

    const token = signAuthToken(user);
    return res.redirect(`${FRONTEND_URL}/welcome?token=${encodeURIComponent(token)}`);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Google authentication failed" });
  }
};

const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "name lastName email isVerified googleId createdAt updatedAt"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch user profile" });
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  googleCallback,
  me,
};
