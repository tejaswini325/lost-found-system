import express from "express";
import multer from "multer";
import path from "path";

import {
  reportItem,
  getUserItems,
  getAllItems,
  getItemById,
  claimItem,
  markAsReturned,
  getStats,
  debugAllItems,
  testUserItems,
} from "../controllers/itemController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Report item with image upload
router.post("/add", auth, upload.single("image"), reportItem);

// Get user's items
router.get("/my-items", auth, getUserItems);

// Get all items (public)
router.get("/all", getAllItems);

// Get item by ID
router.get("/:id", getItemById);

// Claim item
router.post("/claim", auth, claimItem);

// Mark as returned
router.post("/return", auth, markAsReturned);

// Get stats
router.get("/stats/my", auth, getStats);

// Debug routes
router.get("/debug/all", debugAllItems);
router.get("/test/my-items", auth, testUserItems);

export default router;
