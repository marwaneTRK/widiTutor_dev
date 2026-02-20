const crypto = require("crypto");

const generateInternalAuth = () => {
  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret) {
    return null;
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = crypto.createHmac("sha256", secret).update(timestamp).digest("hex");
  return `${timestamp}:${signature}`;
};

module.exports = { generateInternalAuth };
