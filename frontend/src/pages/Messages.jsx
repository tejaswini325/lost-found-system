import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { Send, ArrowLeft } from "lucide-react";
import { fetchConversations, fetchMessages, sendMessage } from "../api/messageApi";
import "./Messages.css";

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const { otherUserId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const userId = localStorage.getItem("userId");

  const itemId = new URLSearchParams(location.search).get("itemId") || undefined;

  const loadConversations = async () => {
    try {
      const data = await fetchConversations();
      setConversations(data.conversations || []);
    } catch (e) {
      console.error("Error fetching conversations:", e);
      setError("Failed to load conversations");
    }
  };

  const loadMessages = async (id) => {
    try {
      setLoading(true);
      const data = await fetchMessages(id, itemId);
      setMessages(data.messages || []);
    } catch (e) {
      console.error("Error fetching messages:", e);
      setError("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !otherUserId) return;

    try {
      await sendMessage(otherUserId, newMessage, itemId);
      setNewMessage("");
      await loadMessages(otherUserId);
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message");
    }
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (otherUserId) {
      loadMessages(otherUserId);
    }
  }, [otherUserId, location.search, loadMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!otherUserId) {
    return (
      <div className="messages-container">
        <div className="conversation-list">
          <h2>Messages</h2>
          {conversations.map((conv) => (
            <div
              key={conv.userId}
              className="conversation-item"
              onClick={() => navigate(`/messages/${conv.userId}`)}
            >
              <div className="conversation-avatar">
                {conv.userName?.charAt(0)?.toUpperCase()}
              </div>
              <div className="conversation-details">
                <h4>{conv.userName}</h4>
                <p>{conv.lastMessage?.substring(0, 30)}...</p>
              </div>
              {conv.unreadCount > 0 && (
                <span className="unread-badge">{conv.unreadCount}</span>
              )}
            </div>
          ))}
          {conversations.length === 0 && (
            <p className="no-conversations">No conversations yet</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="messages-container">
      {otherUserId ? (
        <div className="chat-area">
          <div className="chat-header">
            <Link to="/messages" className="back-button">
              <ArrowLeft size={20} />
            </Link>
            <h2>Messages</h2>
          </div>
          <div className="chat-messages">
            {loading ? (
              <div className="loading">Loading messages...</div>
            ) : messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`message ${(msg.senderId?._id || msg.senderId) === userId ? "sent" : "received"}`}
                >
                  <div className="message-content">{msg.message}</div>
                  <div className="message-time">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-messages">No messages yet. Start the conversation!</div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {error && <div className="error">{error}</div>}
          <form onSubmit={handleSendMessage} className="message-input">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button type="submit" disabled={!newMessage.trim()}>
              <Send size={20} />
            </button>
          </form>
        </div>
      ) : (
        <div className="no-chat-selected">
          <h3>Select a conversation to start chatting</h3>
          <p>Or start a new conversation from an item page</p>
        </div>
      )}
    </div>
  );
};

export default Messages;
