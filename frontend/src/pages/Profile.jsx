import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        phone: "",
        enrollmentNo: "",
        branch: "",
        year: "",
    });
    const [reportedItems, setReportedItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        fetchUserData(token);
        fetchReportedItems(token);
    }, [navigate]);

    const fetchUserData = async (token) => {
        try {
            const response = await axios.get("http://localhost:5000/api/auth/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUserData(response.data.user);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const fetchReportedItems = async (token) => {
        try {
            const response = await axios.get("http://localhost:5000/api/items/my-items", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setReportedItems(response.data.items);
        } catch (error) {
            console.error("Error fetching items:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-sidebar">
                <div className="profile-avatar">
                    <div className="avatar-circle">
                        {userData.name ? userData.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <h3>{userData.name}</h3>
                    <p>{userData.email}</p>
                </div>

                <div className="profile-stats">
                    <div className="stat-item">
                        <span className="stat-number">{reportedItems.length}</span>
                        <span className="stat-label">Items Reported</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">
                            {reportedItems.filter(item => item.status === "found").length}
                        </span>
                        <span className="stat-label">Items Found</span>
                    </div>
                </div>

                <button className="logout-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>

            <div className="profile-content">
                <div className="profile-section">
                    <h2>Personal Information</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <label>Full Name</label>
                            <p>{userData.name}</p>
                        </div>
                        <div className="info-item">
                            <label>Email</label>
                            <p>{userData.email}</p>
                        </div>
                        <div className="info-item">
                            <label>Phone</label>
                            <p>{userData.phone || "Not provided"}</p>
                        </div>
                        <div className="info-item">
                            <label>Enrollment No</label>
                            <p>{userData.enrollmentNo || "Not provided"}</p>
                        </div>
                        <div className="info-item">
                            <label>Branch</label>
                            <p>{userData.branch || "Not provided"}</p>
                        </div>
                        <div className="info-item">
                            <label>Year</label>
                            <p>{userData.year || "Not provided"}</p>
                        </div>
                    </div>
                </div>

                <div className="profile-section">
                    <h2>Your Reported Items</h2>
                    {reportedItems.length === 0 ? (
                        <p className="no-items">You haven't reported any items yet.</p>
                    ) : (
                        <div className="items-grid">
                            {reportedItems.map((item) => (
                                <div key={item._id} className="item-card">
                                    {item.image && (
                                        <img src={item.image} alt={item.itemName} className="item-image" />
                                    )}
                                    <div className="item-details">
                                        <h4>{item.itemName}</h4>
                                        <p className="item-category">{item.category}</p>
                                        <p className="item-location">📍 {item.location}</p>
                                        <p className="item-date">📅 {new Date(item.dateLost).toLocaleDateString()}</p>
                                        <span className={`status-badge ${item.status}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;