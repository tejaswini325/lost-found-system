import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./Notifications.css";
import { API_BASE_URL } from "../api";

const iconMap = {
  match: "🔍",
  claim: "✅",
  message: "💬",
  status: "📣",
  system: "ℹ️",
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = useMemo(() => localStorage.getItem("token"), []);

  const authHeaders = token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : null;

  const fetchNotifications = async () => {
    if (!authHeaders) {
      setError("Please log in to view notifications.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`${API_BASE_URL}/api/notification`, {
        headers: authHeaders,
      });

      if (res.data?.success) {
        setNotifications(res.data.notifications || []);
      } else {
        setError("Unable to load notifications right now.");
      }
    } catch (err) {
      console.error("Failed to load notifications:", err);
      setError("Unable to load notifications right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markAsRead = async (notificationId) => {
    if (!authHeaders) return;
    try {
      await axios.post(
        `${API_BASE_URL}/api/notification/read`,
        { notificationId },
        { headers: authHeaders }
      );
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId
            ? { ...notif, isRead: true, read: true }
            : notif
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    if (!authHeaders) return;
    try {
      await axios.post(
        `${API_BASE_URL}/api/notification/read-all`,
        {},
        { headers: authHeaders }
      );
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true, read: true }))
      );
    } catch (err) {
      console.error("Failed to mark all notifications read:", err);
    }
  };

  const deleteNotification = async (notificationId) => {
    if (!authHeaders) return;
    try {
      await axios.delete(
        `${API_BASE_URL}/api/notification/${notificationId}`,
        { headers: authHeaders }
      );
      setNotifications((prev) =>
        prev.filter((notif) => notif._id !== notificationId)
      );
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const unreadCount = notifications.filter((n) => !(n.isRead ?? n.read)).length;

  return (
    <div className="notifications-page">
      <header className="notifications-header">
        <div>
          <p className="eyebrow">Alerts & Matches</p>
          <h1>Notifications</h1>
          <p className="subtitle">
            Stay up to date when your reported items find a match or change
            status.
          </p>
        </div>
        <div className="header-actions">
          <span className="pill">
            {unreadCount} unread {unreadCount === 1 ? "alert" : "alerts"}
          </span>
          <button
            className="ghost-btn"
            onClick={markAllAsRead}
            disabled={!notifications.length || unreadCount === 0}
          >
            Mark all as read
          </button>
          <button className="ghost-btn" onClick={fetchNotifications}>
            Refresh
          </button>
        </div>
      </header>

      <section className="notifications-card">
        {loading && <p className="info-text">Loading notifications…</p>}
        {!loading && error && <p className="error-text">{error}</p>}
        {!loading && !error && notifications.length === 0 && (
          <div className="empty-state">
            <p>No notifications yet. We’ll notify you when we find a match!</p>
          </div>
        )}

        {!loading && !error && notifications.length > 0 && (
          <ul className="notifications-list">
            {notifications.map((notif) => {
              const isUnread = !(notif.isRead ?? notif.read);
              return (
                <li
                  key={notif._id}
                  className={`notifications-item ${isUnread ? "unread" : ""}`}
                >
                  <div className="icon-chip">
                    {iconMap[notif.type] || "🔔"}
                  </div>
                  <div className="item-body">
                    <div className="item-header">
                      <h3>{notif.title}</h3>
                      <span className="timestamp">
                        {new Date(notif.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="item-message">{notif.message}</p>
                    <div className="item-actions">
                      {isUnread && (
                        <button
                          className="text-btn"
                          onClick={() => markAsRead(notif._id)}
                        >
                          Mark read
                        </button>
                      )}
                      <button
                        className="text-btn destructive"
                        onClick={() => deleteNotification(notif._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Notifications;
