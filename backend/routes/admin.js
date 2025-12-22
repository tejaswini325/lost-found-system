import express from "express";
import adminMiddleware from "../middleware/admin.js";
import {
  loginAdmin,
  getDashboardStats,
  getRecentActivities,
  getAllUsers,
  getAllItems,
  updateItemStatus,
  verifyReturn
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/login", loginAdmin);

router.get("/dashboard/stats", adminMiddleware, getDashboardStats);
router.get("/dashboard/activities", adminMiddleware, getRecentActivities);

router.get("/users", adminMiddleware, getAllUsers);

router.get("/items", adminMiddleware, getAllItems);
router.put("/items/:id/status", adminMiddleware, updateItemStatus);
router.post("/items/:id/verify-return", adminMiddleware, verifyReturn);

export default router;
