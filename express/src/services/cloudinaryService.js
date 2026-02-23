const { ensureCloudinaryConfigured } = require("../config/cloudinary");

const PROFILE_PICTURE_FOLDER =
  process.env.CLOUDINARY_PROFILE_PICTURE_FOLDER || "widitutor/profile-pictures";

const uploadProfilePicture = async ({ buffer, mimetype, userId }) => {
  const cloudinary = ensureCloudinaryConfigured();

  const dataUri = `data:${mimetype};base64,${buffer.toString("base64")}`;
  const uploadResult = await cloudinary.uploader.upload(dataUri, {
    folder: PROFILE_PICTURE_FOLDER,
    resource_type: "image",
    public_id: `user_${userId}_${Date.now()}`,
    overwrite: true,
    transformation: [{ width: 512, height: 512, crop: "fill", gravity: "face" }],
  });

  return {
    url: uploadResult.secure_url,
    publicId: uploadResult.public_id,
  };
};

const deleteImageByPublicId = async (publicId) => {
  if (!publicId) {
    return false;
  }

  const cloudinary = ensureCloudinaryConfigured();
  const deleteResult = await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true,
  });

  return deleteResult.result === "ok" || deleteResult.result === "not found";
};

module.exports = {
  uploadProfilePicture,
  deleteImageByPublicId,
};
