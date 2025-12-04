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
  return (
    <div className="dashboard-container">
      {/* <Navbar /> // Include your Navbar component here */}
      
      <div className="dashboard-main-content">
        {/* --- Left Side: Hero Text & CTA --- */}
        <div className="hero-section">
          <h1 className="hero-title">
            Find & Recover <br /> <span className="highlight-text">With Ease</span>
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
            <Link to="/found-items" className="btn btn-secondary">
              Browse Found Items
            </Link>
          </div>
        </div>

        {/* --- Right Side: Image/Visual (Replaced original card section) --- */}
        <div className="hero-image-container">
            {/* The watch image is used as the primary visual element on the side */}
            <img src={WatchImage} alt="Lost Watch - Found & Recovered" className="hero-image"/>
        </div>

        {/* --- Feature Cards Section (Optional, below the main hero) --- */}
        {/* You can uncomment this section and add data for a more comprehensive page */}
        {/*
        <div className="feature-cards-section">
          <div className="feature-card">
            <div className="card-icon icon-search"></div>
            <h3 className="card-title">Quick Search</h3>
            <p className="card-text">Search through thousands of reported items instantly.</p>
          </div>
          <div className="feature-card">
            <div className="card-icon icon-secure"></div>
            <h3 className="card-title">Secure Handoff</h3>
            <p className="card-text">Trusted process for secure item verification and exchange.</p>
          </div>
        </div>
        */}
      </div>
      
      <Footer /> 
    </div>
  );
};

export default Dashboard;