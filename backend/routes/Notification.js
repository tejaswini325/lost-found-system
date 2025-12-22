import express from "express";
const router = express.Router();
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from "../controllers/notificationController.js";
import auth from "../middleware/auth.js";

// Get notifications
router.get("/", auth, getNotifications);

// Mark as read
router.post("/read", auth, markAsRead);

// Mark all as read
router.post("/read-all", auth, markAllAsRead);

// Delete notification
router.delete("/:notificationId", auth, deleteNotification);

export default router;