require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");

const app = express();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required");
}
if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is required");
}
if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is required");
}

const authRoutes = require("./src/routes/authRoutes");
require("./src/config/passport");

app.use(helmet());
app.use(morgan("tiny"));
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "../frontend/src/assets")));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/auth", authLimiter);

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

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Express + MongoDB Atlas is running",
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
});
