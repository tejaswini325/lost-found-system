// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; // Create a new CSS file for the Navbar styles
import collegeLogo from '../assets/logo.png'; // Your college logo

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear authentication token and redirect to login
        localStorage.removeItem('token');
        navigate('/'); 
    };

    return (
        // Renamed from top-navbar to navbar-container for generic use
        <nav className="navbar-container">
            <div className="navbar-brand">
                {/* 💡 CHANGE 1: Replaced "Lost & Found" text with the College Logo */}
                <img src={collegeLogo} alt="College Logo" className="college-logo" />
            </div>
            
            <div className="navbar-links">
                <Link to="/dashboard" className="nav-link">HOME</Link>
                <Link to="/lost-items" className="nav-link">LOST ITEMS</Link>
                <Link to="/found-items" className="nav-link">FOUND ITEMS</Link>
                <button onClick={handleLogout} className="nav-link logout-btn">LOGOUT</button>
            </div>
        </nav>
    );
};

export default Navbar;