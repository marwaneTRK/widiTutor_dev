const { v2: cloudinary } = require("cloudinary");

const readEnv = (name) => (process.env[name] || "").trim();

const cloudName = readEnv("CLOUDINARY_CLOUD_NAME");
const apiKey = readEnv("CLOUDINARY_API_KEY");
const apiSecret = readEnv("CLOUDINARY_API_SECRET");

const isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

const ensureCloudinaryConfigured = () => {
  if (!isCloudinaryConfigured) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET."
    );
  }
  return cloudinary;
};

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
  ensureCloudinaryConfigured,
};
