const path = require("path");

const normalizeUrl = (url) => (url || "").trim().replace(/\/+$/, "");

const FASTAPI_INTERNAL_URL = normalizeUrl(
  process.env.FASTAPI_INTERNAL_URL || "http://localhost:8000"
);
const FASTAPI_HEALTH_PATH = process.env.FASTAPI_HEALTH_PATH || "/health";
const FASTAPI_FOLDER_PATH =
  process.env.FASTAPI_FOLDER_PATH || path.resolve(__dirname, "../../../fastapi");

module.exports = {
  FASTAPI_INTERNAL_URL,
  FASTAPI_HEALTH_PATH,
  FASTAPI_FOLDER_PATH,
};
