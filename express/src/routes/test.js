const express = require("express");
const router = express.Router();
const { createUser } = require("../controllers/testController"); // ← make sure this path is correct

// POST /api/test
router.post("/", createUser); // ← must be a function!

module.exports = router;
