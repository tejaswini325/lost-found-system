// src/components/Navbar.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import './Navbar.css'; // Importing the final CSS styles
import collegeLogo from '../assets/idVTKeb2gc_logos.jpeg'; // Assuming your college logo path
import { getUnreadCount } from '../api/messageApi';

const Navbar = () => {
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        let mounted = true;

        const refresh = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const count = await getUnreadCount();
                if (mounted) setUnreadCount(count);
            } catch {
                // ignore
            }
        };

        refresh();
        const interval = setInterval(refresh, 30000);
        return () => {
            mounted = false;
            clearInterval(interval);
        };
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
            
            {/* Right side: Messages + Logout */}
            <div className="navbar-actions">
                <Link to="/messages" className="nav-icon" aria-label="Messages">
                    <MessageSquare size={20} />
                    {unreadCount > 0 && (
                        <span className="nav-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                    )}
                </Link>
                <button onClick={handleLogout} className="nav-link logout-btn">LOGOUT</button>
            </div>
        </nav>
    );
};

export default Navbar;
