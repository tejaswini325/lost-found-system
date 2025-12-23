import express from "express";
import auth from "../middleware/auth.js";
import {
  sendMessage,
  getConversation,
  getAllConversations,
} from "../controllers/messageController.js";

const router = express.Router();

// Send message
router.post("/send", auth, sendMessage);

// Get conversation (expects query params: otherUserId, optional itemId)
router.get("/conversation", auth, getConversation);

// Get all conversations
router.get("/conversations", auth, getAllConversations);

export default router;