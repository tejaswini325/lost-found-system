const express = require("express");
const { registerUser, loginUser, getCurrentUser, updateProfile } = require("../controllers/authController");
const auth = require("../middleware/auth");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes (need token)
router.get("/me", auth, getCurrentUser);
router.put("/update", auth, updateProfile);

// Get All Users (for testing - optional)
router.get("/all", async (req, res) => {
  try {
    const User = require("../models/User");
    const users = await User.find().select('-password');
    res.json({
      success: true,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;