const User = require("../models/user");

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { name, pseudo } = req.body;

    if (!name || !pseudo) {
      return res.status(400).json({ message: "Name and pseudo are required." });
    }

    const existingUser = await User.findOne({ pseudo });
    if (existingUser) {
      return res.status(400).json({ message: "Pseudo already exists." });
    }

    const newUser = await User.create({ name, pseudo });
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
