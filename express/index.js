require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const app = express();
const testRoute = require("./src/routes/test");

// ====== SECURITY MIDDLEWARE ======

// Set secure HTTP headers
app.use(helmet());

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:3000", // Dockerized frontend
  "http://localhost:5173", // Vite dev
  "https://monapp.com",
  "https://admin.monapp.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without origin (Postman, mobile apps, server-to-server)
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

// Limit repeated requests to public APIs
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 6,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Logging
app.use(morgan("tiny"));

// ====== MIDDLEWARE ======
app.use(express.json());
app.use("/api/test", testRoute);

// ====== MONGODB CONNECTION ======
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

// ====== ROUTES ======
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Express + MongoDB Atlas is running",
  });
});

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Express + MongoDB Atlas!" });
});

// ====== START SERVER ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});