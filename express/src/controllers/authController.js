const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const { sendVerificationEmail, sendResetPasswordEmail } = require("../utils/sendEmail");
const {
  uploadProfilePicture: uploadProfilePictureToCloudinary,
  deleteImageByPublicId,
} = require("../services/cloudinaryService");
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  changePasswordSchema,
} = require("../validation/authValidation");

const CLIENT_URL = process.env.CLIENT_URL || process.env.FRONTEND_URL || "http://localhost:5173";
const BACKEND_URL =
  process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const VERIFICATION_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour
const RESET_PASSWORD_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

const normalizeEmail = (email = "") => email.trim().toLowerCase();
const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");
const randomDelay = () =>
  new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 100) + 50));

const signAuthToken = (user) =>
  jwt.sign({ id: user._id.toString(), email: user.email }, process.env.JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

const createVerificationPayload = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  return {
    rawToken,
    hashedToken: hashToken(rawToken),
    expiresAt: new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS),
  };
};

const createResetPasswordPayload = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  return {
    rawToken,
    hashedToken: hashToken(rawToken),
    expiresAt: new Date(Date.now() + RESET_PASSWORD_TOKEN_TTL_MS),
  };
};

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  lastName: user.lastName,
  email: user.email,
  domain: user.domain || "",
  studies: user.studies || "",
  progressGoals: user.progressGoals || "",
  profilePicture: user.profilePicture || null,
  isVerified: user.isVerified,
});

const FORGOT_PASSWORD_SUCCESS_MESSAGE = "A reset link has been sent to your email.";
const FORGOT_PASSWORD_NOT_FOUND_MESSAGE = "No account exists with this email.";

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
    const { rawToken, hashedToken, expiresAt } = createVerificationPayload();

    let user = existingUser;
    if (!user) {
      user = await User.create({
        name,
        lastName,
        email,
        password: hashedPassword,
        isVerified: false,
        verificationToken: hashedToken,
        verificationTokenExpires: expiresAt,
      });
    } else {
      user.name = name;
      user.lastName = lastName;
      user.password = hashedPassword;
      user.isVerified = false;
      user.verificationToken = hashedToken;
      user.verificationTokenExpires = expiresAt;
      await user.save();
    }

    const verificationUrl = `${BACKEND_URL}/api/auth/verify/${rawToken}`;
    await sendVerificationEmail({
      to: user.email,
      verificationUrl,
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

    if (user?.isLocked) {
      return res.status(423).json({
        message: "Account temporarily locked due to too many failed login attempts.",
        lockUntil: user.lockUntil,
      });
    }

    if (!user || !user.password) {
      if (user) {
        await user.incLoginAttempts();
      }
      await randomDelay();
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await user.incLoginAttempts();
      await randomDelay();
      return res.status(401).json({ message: "Invalid email or password" });
    }

    await user.resetLoginAttempts();
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

const forgotPassword = async (req, res) => {
  try {
    const { error, value } = forgotPasswordSchema.validate(req.body, {
      abortEarly: true,
      stripUnknown: true,
    });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const email = normalizeEmail(value.email);
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: FORGOT_PASSWORD_NOT_FOUND_MESSAGE });
    }

    const { rawToken, hashedToken, expiresAt } = createResetPasswordPayload();
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = expiresAt;
    await user.save();

    const resetUrl = `${CLIENT_URL}/reset-password?token=${encodeURIComponent(rawToken)}`;
    await sendResetPasswordEmail({
      to: user.email,
      resetUrl,
    });

    return res.status(200).json({ message: FORGOT_PASSWORD_SUCCESS_MESSAGE });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { error, value } = resetPasswordSchema.validate(req.body, {
      abortEarly: true,
      stripUnknown: true,
    });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { token, newPassword } = value;
    const hashedToken = hashToken(token);
    const user = await User.findOne({
      resetPasswordExpires: { $gt: new Date() },
      $or: [{ resetPasswordToken: hashedToken }, { resetPasswordToken: token }],
    }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordChangedAt = new Date();
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const hashedToken = hashToken(token);
    const user = await User.findOne({
      $or: [{ verificationToken: hashedToken }, { verificationToken: token }],
    });

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

    const jwtToken = signAuthToken(user);
    return res.redirect(`${CLIENT_URL}/welcome?token=${encodeURIComponent(jwtToken)}`);
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
    return res.redirect(`${CLIENT_URL}/welcome?token=${encodeURIComponent(token)}`);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Google authentication failed" });
  }
};

const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "name lastName email domain studies progressGoals profilePicture isVerified googleId createdAt updatedAt"
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

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "name lastName email domain studies progressGoals profilePicture profilePicturePublicId isVerified"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hasBodyFields =
      Object.prototype.hasOwnProperty.call(req.body, "name") ||
      Object.prototype.hasOwnProperty.call(req.body, "lastName") ||
      Object.prototype.hasOwnProperty.call(req.body, "email") ||
      Object.prototype.hasOwnProperty.call(req.body, "domain") ||
      Object.prototype.hasOwnProperty.call(req.body, "studies") ||
      Object.prototype.hasOwnProperty.call(req.body, "progressGoals");

    let nextEmail = null;
    if (hasBodyFields) {
      const { error, value } = updateProfileSchema.validate(req.body, {
        abortEarly: true,
        stripUnknown: true,
      });
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      if (Object.prototype.hasOwnProperty.call(value, "name")) {
        user.name = value.name;
      }
      if (Object.prototype.hasOwnProperty.call(value, "lastName")) {
        user.lastName = value.lastName;
      }
      if (Object.prototype.hasOwnProperty.call(value, "email")) {
        nextEmail = normalizeEmail(value.email);
      }
      if (Object.prototype.hasOwnProperty.call(value, "domain")) {
        user.domain = value.domain;
      }
      if (Object.prototype.hasOwnProperty.call(value, "studies")) {
        user.studies = value.studies;
      }
      if (Object.prototype.hasOwnProperty.call(value, "progressGoals")) {
        user.progressGoals = value.progressGoals;
      }
    }

    if (nextEmail && nextEmail !== user.email) {
      const existingUser = await User.findOne({ email: nextEmail, _id: { $ne: user._id } });
      if (existingUser) {
        return res.status(409).json({ message: "Email already in use" });
      }
      user.email = nextEmail;
    }

    let previousPublicId = null;
    let newPicturePublicId = null;
    if (req.file) {
      const uploadResult = await uploadProfilePictureToCloudinary({
        buffer: req.file.buffer,
        mimetype: req.file.mimetype,
        userId: user._id.toString(),
      });

      previousPublicId = user.profilePicturePublicId || null;
      newPicturePublicId = uploadResult.publicId;
      user.profilePicture = uploadResult.url;
      user.profilePicturePublicId = uploadResult.publicId;
    }

    await user.save();

    if (previousPublicId && previousPublicId !== newPicturePublicId) {
      try {
        await deleteImageByPublicId(previousPublicId);
      } catch (error) {
        console.error("Failed to delete previous Cloudinary profile picture:", error);
      }
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update profile" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { error, value } = changePasswordSchema.validate(req.body, {
      abortEarly: true,
      stripUnknown: true,
    });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { currentPassword, newPassword } = value;
    if (currentPassword === newPassword) {
      return res.status(400).json({ message: "New password must be different from current password." });
    }

    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.password) {
      return res.status(400).json({
        message: "Password change is unavailable for this account. Use reset password flow first.",
      });
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordChangedAt = new Date();
    await user.save();

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update password" });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("profilePicturePublicId");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.profilePicturePublicId) {
      const deleted = await deleteImageByPublicId(user.profilePicturePublicId);
      if (!deleted) {
        return res.status(502).json({ message: "Failed to delete profile image from Cloudinary" });
      }
    }

    await User.deleteOne({ _id: user._id });
    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to delete account" });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
  googleCallback,
  me,
  updateProfile,
  changePassword,
  deleteAccount,
};
