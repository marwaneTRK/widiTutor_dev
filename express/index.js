require("dotenv").config();
const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const { FASTAPI_INTERNAL_URL, FASTAPI_FOLDER_PATH } = require("./src/config/fastapi");

const app = express();

const sanitizeMongoInput = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeMongoInput(item));
  }
  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.entries(value).reduce((accumulator, [key, nestedValue]) => {
    const sanitizedKey = key.replace(/\$/g, "_").replace(/\./g, "_");
    accumulator[sanitizedKey] = sanitizeMongoInput(nestedValue);
    return accumulator;
  }, {});
};

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required");
}
if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is required");
}
if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is required");
}
if (process.env.NODE_ENV === "production" || process.env.TRUST_PROXY === "true") {
  app.set("trust proxy", 1);
}

const authRoutes = require("./src/routes/authRoutes");
const aiRoutes = require("./src/routes/aiRoutes");
require("./src/config/passport");

app.use(helmet());
app.use(morgan("tiny"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use((req, res, next) => {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeMongoInput(req.body);
  }
  if (req.query && typeof req.query === "object") {
    req.query = sanitizeMongoInput(req.query);
  }
  if (req.params && typeof req.params === "object") {
    req.params = sanitizeMongoInput(req.params);
  }
  next();
});
app.use("/public", express.static(path.join(__dirname, "../frontend/src/assets")));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === "OPTIONS",
});
app.use(limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === "OPTIONS",
  message: { message: "Too many authentication attempts, please try again later." },
});

const passwordFlowLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === "OPTIONS",
  message: { message: "Too many password reset requests, please try again later." },
});

const oauthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === "OPTIONS",
});

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth/forgot-password", passwordFlowLimiter);
app.use("/api/auth/reset-password", passwordFlowLimiter);
app.use("/api/auth/google", oauthLimiter);
app.use("/api/auth/google/callback", oauthLimiter);
app.use("/api/auth/verify", oauthLimiter);

const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000,http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked. Unauthorized origin: ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api", aiRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Express + MongoDB Atlas is running",
  });
});

app.get("/health", (req, res) => {
  const isMongoUp = mongoose.connection.readyState === 1;
  res.status(isMongoUp ? 200 : 503).json({
    status: isMongoUp ? "healthy" : "degraded",
    mongodb: isMongoUp,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Express + MongoDB Atlas!" });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  if (fs.existsSync(FASTAPI_FOLDER_PATH)) {
    console.log(`FastAPI folder detected at: ${FASTAPI_FOLDER_PATH}`);
  } else {
    console.log(`FastAPI folder not found yet (expected at: ${FASTAPI_FOLDER_PATH})`);
  }
  console.log(`FastAPI link target: ${FASTAPI_INTERNAL_URL}`);
});
