// src/components/Navbar.js
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import './Navbar.css'; // Importing the final CSS styles
import collegeLogo from '../assets/logo.png'; // Assuming your college logo path

const Navbar = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const notifRef = useRef(null);

    const token = localStorage.getItem('token');
    const API_BASE = 'http://localhost:5000/api';

    const fetchNotifications = async () => {
        if (!token) return;
        try {
            const res = await axios.get(`${API_BASE}/notification`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.data && res.data.success) {
                setNotifications(Array.isArray(res.data.notifications) ? res.data.notifications : []);
                setUnreadCount(typeof res.data.unreadCount === 'number' ? res.data.unreadCount : 0);
            }
        } catch (e) {
        }
    };

    const markAsRead = async (notificationId) => {
        if (!token) return;
        try {
            const res = await axios.post(
                `${API_BASE}/notification/read`,
                { notificationId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setNotifications((prev) =>
                prev.map((n) => (n._id === notificationId ? { ...n, isRead: true, read: true } : n))
            );

            if (res.data && res.data.success && typeof res.data.unreadCount === 'number') {
                setUnreadCount(res.data.unreadCount);
            } else {
                setUnreadCount((c) => Math.max(0, c - 1));
            }
        } catch (e) {
        }
    };

    const handleNotificationClick = async (n) => {
        if (!(n.isRead ?? n.read)) {
            await markAsRead(n._id);
        }

        setIsNotifOpen(false);
        if (n.type === 'match') {
            navigate('/items');
        }
    };

    useEffect(() => {
        fetchNotifications();
        if (!token) return;
        const intervalId = setInterval(() => {
            fetchNotifications();
        }, 15000);
        return () => clearInterval(intervalId);
    }, [token]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setIsNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        // Clear authentication token and redirect to login
        localStorage.removeItem('token');
        navigate('/'); 
    };

    return (
        <nav className="navbar-container">
            {/* Left side: College Logo */}
            <div className="navbar-brand">
                <img src={collegeLogo} alt="College Logo" className="college-logo" />
            </div>
            
            {/* Center: Navigation Links */}
            <div className="navbar-links">
                <Link to="/dashboard" className="nav-link">HOME</Link>
                <Link to="/lost-items" className="nav-link">LOST ITEMS</Link>
                <Link to="/found-items" className="nav-link">FOUND ITEMS</Link>
            </div>
            
            {/* Right side: Logout Button */}
            <div className="navbar-actions">
                <div className="navbar-notifications" ref={notifRef}>
                    <button
                        type="button"
                        className="nav-link notif-btn"
                        onClick={() => setIsNotifOpen((v) => !v)}
                        aria-label="Notifications"
                    >
                        <span className="notif-icon-wrap">
                            <NotificationsNoneIcon fontSize="small" />
                            {unreadCount > 0 && (
                                <span className="notif-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
                            )}
                        </span>
                    </button>
                    {isNotifOpen && (
                        <div className="notif-dropdown">
                            <div className="notif-header">Notifications</div>
                            <div className="notif-list">
                                {notifications.length === 0 ? (
                                    <div className="notif-empty">No notifications</div>
                                ) : (
                                    notifications.slice(0, 10).map((n) => (
                                        <button
                                            key={n._id}
                                            type="button"
                                            className={`notif-item ${(n.isRead ?? n.read) ? 'read' : 'unread'}`}
                                            onClick={() => handleNotificationClick(n)}
                                        >
                                            <div className="notif-title">{n.title}</div>
                                            <div className="notif-message">{n.message}</div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <button onClick={handleLogout} className="nav-link logout-btn">LOGOUT</button>
            </div>
        </nav>
    );
};

export default Navbar;