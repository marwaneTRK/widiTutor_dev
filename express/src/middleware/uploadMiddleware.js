const multer = require("multer");

const MAX_PROFILE_PICTURE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    return callback(new Error("Only JPG, PNG or WEBP images are allowed."));
  }
  return callback(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_PROFILE_PICTURE_SIZE },
  fileFilter,
});

const uploadProfilePicture = (req, res, next) => {
  upload.single("profilePicture")(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "Profile picture must be 5MB or smaller." });
      }
      return res.status(400).json({ message: error.message });
    }

    return res.status(400).json({ message: error.message || "Invalid profile picture upload." });
  });
};

module.exports = {
  uploadProfilePicture,
};
