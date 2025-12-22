import express from "express";
const router = express.Router();
import { registerUser, loginUser, verifyEmail, resetPassword, getCurrentUser, updateProfile } from "../controllers/authController.js";
import auth from "../middleware/auth.js";
import User from "../models/User.js";

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser); // Changed from "login" to "loginUser"
router.post("/verify-email", verifyEmail);
router.post("/reset-password", resetPassword);

// Protected routes (need token)
router.get("/me", auth, getCurrentUser);
router.put("/update", auth, updateProfile);

// Get All Users (for testing - optional)
router.get("/all", async (req, res) => {
  try {
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

export default router;