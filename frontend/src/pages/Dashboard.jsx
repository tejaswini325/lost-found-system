import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
// Assuming you have a component for the global Navigation Bar
// import Navbar from "../components/Navbar"; 
import Footer from "../components/Footbar";
// Assuming 'Watch' is the large, professional image you want to use
import WatchImage from "../assets/lost-found.jpg";
// Assuming you have icons or need a section for features, 
// but for the immediate fix, the main hero section is the priority.


const Dashboard = () => {
  // Get user name from localStorage if available
  const userName = localStorage.getItem("userName") || "there!";

  return (
    <div className="dashboard-container">
      {/* <Navbar /> // Include your Navbar component here */}

      <div className="dashboard-main-content">
        {/* --- Left Side: Hero Text & CTA --- */}
        <div className="hero-section">
          <h1 className="hero-title">
            Welcome <span className="highlight-text">{userName}</span> <br />
            <span className="highlight-text">Find & Recover</span> With Ease
          </h1>

          <p className="hero-subtitle">
            Experience effortless searching & reporting for lost and found items.
            Our platform provides a secure and accountable process for reuniting
            people with their misplaced possessions.
          </p>

          <div className="hero-actions">
            <Link to="/report-item" className="btn btn-primary">
              Report Lost/Found Item
            </Link>
            {/* Added a secondary CTA for immediate use */}
            <Link to="/profile" className="btn btn-secondary">
              My Profile
            </Link>
          </div>
        </div>

        {/* --- Right Side: Image/Visual (Replaced original card section) --- */}
        <div className="hero-image-container">
          {/* The watch image is used as the primary visual element on the side */}
          <img src={WatchImage} alt="Lost Watch - Found & Recovered" className="hero-image" />
        </div>

        {/* --- Feature Cards Section (Optional, below the main hero) --- */}
        {/* You can uncomment this section and add data for a more comprehensive page */}

        <div className="feature-cards-section">
          <div className="feature-card">
            <div className="card-icon">🔍</div>
            <h3 className="card-title">Quick Search</h3>
            <p className="card-text">Search through thousands of reported items instantly.</p>
            <Link to="/lost" className="card-link">Browse Lost Items</Link>
          </div>
          <div className="feature-card">
            <div className="card-icon">🔒</div>
            <h3 className="card-title">Secure Handoff</h3>
            <p className="card-text">Trusted process for secure item verification and exchange.</p>
            <Link to="/found" className="card-link">Browse Found Items</Link>
          </div>
          <div className="feature-card">
            <div className="card-icon">📋</div>
            <h3 className="card-title">All Items</h3>
            <p className="card-text">View all lost and found items in one place.</p>
            <Link to="/items" className="card-link">View All Items</Link>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;