import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import logoImage from '../assets/logo.png';

const Home = () => {
    const navigate = useNavigate();
    // NEW STATE: Controls the visibility of the settings menu dropdown
    const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);

    // NEW HANDLER: Toggles the settings menu visibility
    const toggleSettingsMenu = () => {
        setIsSettingsMenuOpen(prev => !prev);
    };


    // Handler for selecting a settings option
    const handleSettingsClick = (option) => {
        // Use useNavigate for routing
        if (option === 'Help') {
            // Assuming you create a /contact route for Help & Support
            navigate('/contact');
        } else {
            console.log(`Settings option selected: ${option}`);
        }
        setIsSettingsMenuOpen(false); // Close the menu after selection
    };

    return (
        <div className="home-container theme-dark">

            {/* Background Overlay */}
            <div className="background-overlay"></div>

            {/* Top Bar with Logo, Theme, and Settings */}
            <div className="top-bar">
                {/* Left Top: Logo Placeholder */}
                <div className="clg-logo-placeholder">
                    <img
                        src={logoImage}
                        alt="KLE Tech Logo"
                        className="logo-image"
                    />
                </div>

                {/* Right Top: Utility Icons */}
                <div className="utility-icons">



                    {/* SETTINGS ICON WITH DROPDOWN */}
                    <div
                        className="settings-placeholder"
                        title="Settings"
                        onClick={toggleSettingsMenu}
                    >
                        {/* Gear Icon (Placeholder for the actual icon) */}
                        <span className="settings-icon"></span>

                        {/* Settings Dropdown Menu */}
                        {isSettingsMenuOpen && (
                            <div className="settings-dropdown-menu">

                                {/* 🌟 HELP & SUPPORT OPTION */}
                                <div
                                    className="settings-option"
                                    onClick={(e) => { e.stopPropagation(); handleSettingsClick('Help'); }}
                                >
                                    Help & Support
                                </div>
                            </div>
                        )}
                    </div>
                    {/* END SETTINGS ICON */}
                </div>
            </div>

            {/* Main Content Area (Single column and centered) */}
            <main className="main-content-single-column">

                {/* Main Content Block (Centered) */}
                <div className="center-content-block">
                    {/* Title */}
                    <h1 className="main-title">Lost and Found System</h1>

                    {/* Sub-Description */}
                    <p className="sub-description">
                        An advanced platform for efficiently managing and recovering lost and found items
                        within KLE Technological University, ensuring a secure and streamlined process.
                    </p>

                    {/* Get Started Card */}
                    <div className="get-started-card center-card">
                        <h2>Account Access</h2> {/* Updated Card Title */}
                        <p className="card-description">
                            Please log in or create an account to manage your lost/found reports and track
                            the status of items within the system.
                        </p>

                        {/* Action Buttons: NOW USING LOGIN/CREATE ACCOUNT */}

                        {/* 1. Login Button -> /login */}
                        <Link to="/login1" className="link-button-wrapper">
                            <button className="login-button">Log In</button>
                        </Link>

                        {/* 2. Create Account Button -> /login (Assuming /login handles both) */}
                        <Link to="/login" className="link-button-wrapper">
                            <button className="create-account-button">Create Account</button>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
