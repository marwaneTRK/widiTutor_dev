const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    domain: {
      type: String,
      trim: true,
      default: "",
    },
    studies: {
      type: String,
      trim: true,
      default: "",
    },
    progressGoals: {
      type: String,
      trim: true,
      default: "",
    },
    profilePicture: {
      type: String,
      trim: true,
      default: null,
    },
    profilePicturePublicId: {
      type: String,
      trim: true,
      default: null,
    },
    password: {
      type: String,
      minlength: 8,
      default: null,
      select: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpires: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
    passwordChangedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });

userSchema.virtual("isLocked").get(function isLocked() {
  return Boolean(this.lockUntil && this.lockUntil > Date.now());
});

userSchema.methods.incLoginAttempts = async function incLoginAttempts() {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { failedLoginAttempts: 1 },
      $unset: { lockUntil: 1 },
    });
  }

  const updates = { $inc: { failedLoginAttempts: 1 } };
  if (this.failedLoginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 60 * 60 * 1000 };
  }

  return this.updateOne(updates);
};

userSchema.methods.resetLoginAttempts = async function resetLoginAttempts() {
  return this.updateOne({
    $set: { failedLoginAttempts: 0 },
    $unset: { lockUntil: 1 },
  });
};

module.exports = mongoose.model("User", userSchema);
