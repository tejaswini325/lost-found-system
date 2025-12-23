import axios from 'axios';
import { API_BASE_URL } from './config';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

export const fetchConversations = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/messages/conversations`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};

export const fetchMessages = async (conversationId, itemId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/messages/conversation`, {
      ...getAuthHeaders(),
      params: itemId ? { otherUserId: conversationId, itemId } : { otherUserId: conversationId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const sendMessage = async (conversationId, message, itemId) => {
  try {
    // In this backend, "conversationId" is actually the other user's id
    const receiverId = conversationId;
    const response = await axios.post(
      `${API_BASE_URL}/api/messages/send`,
      itemId ? { receiverId, message, itemId } : { receiverId, message },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const startNewConversation = async (receiverId, itemId, message) => {
  try {
    // No dedicated endpoint in current backend.
    // Sending first message implicitly starts the conversation.
    const response = await axios.post(
      `${API_BASE_URL}/api/messages/send`,
      { receiverId, itemId, message },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error starting new conversation:', error);
    throw error;
  }
};

export const markAsRead = async (conversationId) => {
  try {
    // No explicit mark-read endpoint in current backend.
    // Messages are marked read when fetching the conversation.
    // This function is a placeholder for future implementation.
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
};

export const getUnreadCount = async () => {
  try {
    // No dedicated endpoint in current backend. We approximate by summing unreadCount from conversations.
    const response = await axios.get(
      `${API_BASE_URL}/api/messages/conversations`,
      getAuthHeaders()
    );
    const conversations = response.data?.conversations || [];
    return conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
};
