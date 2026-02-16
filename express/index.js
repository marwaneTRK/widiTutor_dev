require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const app = express();

// ====== ROUTES IMPORT ======
const authRoutes = require("./src/routes/authRoutes"); // ✅ auth routes only

// ====== SECURITY MIDDLEWARE ======

// Secure HTTP headers
app.use(helmet());

// Logging
app.use(morgan("tiny"));

// Parse JSON
app.use(express.json());

// ====== RATE LIMITING ======

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Stronger limiter for auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use("/api/auth", authLimiter);

// ====== CORS ======

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://monapp.com",
  "https://admin.monapp.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked. Unauthorized origin: " + origin));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ====== API ROUTES ======

app.use("/api/auth", authRoutes); // ✅ only auth

// ====== ROOT ROUTES ======

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Express + MongoDB Atlas is running",
  });
});

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Express + MongoDB Atlas!" });
});

// ====== MONGODB CONNECTION ======

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

// ====== START SERVER ======

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
