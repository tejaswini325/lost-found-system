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
        enrollment: "",
        branch: "",
        year: "",
    });
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...userData });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        fetchUserProfile(token);
        fetchUserItems(token);
    }, [navigate]);

    const fetchUserProfile = async (token) => {
        try {
            // First try to get from backend API
            const response = await axios.get("http://localhost:5000/api/users/me", {
                headers: { "x-auth-token": token },
            });

            if (response.data.success) {
                const user = response.data.user;
                setUserData({
                    name: user.name || "User",
                    email: user.email || "user@example.com",
                    phone: user.phone || "Not provided",
                    enrollment: user.enrollment || "Not provided",
                    branch: user.branch || "Not provided",
                    year: user.year || "Not provided",
                });
                setFormData({
                    name: user.name || "User",
                    email: user.email || "user@example.com",
                    phone: user.phone || "",
                    enrollment: user.enrollment || "",
                    branch: user.branch || "",
                    year: user.year || "",
                });

                // Update localStorage with fresh data
                localStorage.setItem("userName", user.name || "User");
                localStorage.setItem("userEmail", user.email || "user@example.com");
                localStorage.setItem("userPhone", user.phone || "");
                localStorage.setItem("userEnrollment", user.enrollment || "");
                localStorage.setItem("userBranch", user.branch || "");
                localStorage.setItem("userYear", user.year || "");
            }
        } catch (error) {
            console.error("Error fetching profile from backend:", error);
            // Fallback to localStorage if API fails
            const name = localStorage.getItem("userName") || "User";
            const email = localStorage.getItem("userEmail") || "user@example.com";
            const phone = localStorage.getItem("userPhone") || "Not provided";
            const enrollment = localStorage.getItem("userEnrollment") || "Not provided";
            const branch = localStorage.getItem("userBranch") || "Not provided";
            const year = localStorage.getItem("userYear") || "Not provided";

            setUserData({ name, email, phone, enrollment, branch, year });
            setFormData({ name, email, phone, enrollment, branch, year });
        }
    };

    const fetchUserItems = async (token) => {
        try {
            const response = await axios.get("http://localhost:5000/api/items/my-items", {
                headers: { "x-auth-token": token },
            });

            if (response.data.success) {
                setItems(response.data.items || []);
            }
        } catch (error) {
            console.error("Error fetching items:", error);
            // For demo, create dummy items
            setItems([
                {
                    _id: "1",
                    title: "Blue Water Bottle",
                    description: "Blue plastic water bottle with black cap",
                    category: "lost",
                    location: "Library",
                    date: "2024-12-05",
                    status: "pending",
                },
                {
                    _id: "2",
                    title: "MacBook Charger",
                    description: "USB-C MacBook charger with extension cord",
                    category: "found",
                    location: "Computer Lab",
                    date: "2024-12-04",
                    status: "resolved",
                },
                {
                    _id: "3",
                    title: "Student ID Card",
                    description: "John Doe's student ID card",
                    category: "found",
                    location: "Cafeteria",
                    date: "2024-12-03",
                    status: "returned",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setFormData({ ...userData });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({ ...userData });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                "http://localhost:5000/api/users/update-profile",
                formData,
                {
                    headers: { "x-auth-token": token },
                }
            );

            if (response.data.success) {
                setUserData({ ...formData });
                setIsEditing(false);

                // Update localStorage
                Object.keys(formData).forEach(key => {
                    localStorage.setItem(`user${key.charAt(0).toUpperCase() + key.slice(1)}`, formData[key]);
                });

                alert("Profile updated successfully!");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'pending';
            case 'resolved': return 'resolved';
            case 'returned': return 'returned';
            default: return 'pending';
        }
    };

    if (loading) {
        return (
            <div className="profile-loading">
                <div className="spinner"></div>
                <p>Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                {/* Header with logout */}
                <div className="profile-header">
                    <h1>My Profile</h1>
                    <div className="header-actions">
                        <button className="edit-profile-btn" onClick={handleEdit}>
                            Edit Profile
                        </button>
                        <button className="logout-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>

                <div className="profile-content">
                    {/* User Info Card */}
                    <div className="user-info-card">
                        <div className="user-avatar-section">
                            <div className="avatar-container">
                                <div className="avatar-circle">
                                    {userData.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="user-verification">
                                    <span className="verified-badge">✓ Verified</span>
                                </div>
                            </div>
                            <div className="user-details">
                                <h2>{userData.name}</h2>
                                <p className="user-email">{userData.email}</p>
                                <p className="user-member">Member since Dec 2024</p>
                            </div>
                        </div>

                        <div className="user-stats">
                            <div className="stat-card">
                                <div className="stat-icon">📋</div>
                                <div className="stat-info">
                                    <span className="stat-number">{items.length}</span>
                                    <span className="stat-label">Total Reports</span>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">🔍</div>
                                <div className="stat-info">
                                    <span className="stat-number">
                                        {items.filter(item => item.category === "found").length}
                                    </span>
                                    <span className="stat-label">Found Items</span>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">✅</div>
                                <div className="stat-info">
                                    <span className="stat-number">
                                        {items.filter(item => item.status === "returned").length}
                                    </span>
                                    <span className="stat-label">Returned</span>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">🎯</div>
                                <div className="stat-info">
                                    <span className="stat-number">
                                        {((items.filter(item => item.status === "returned").length / items.length) * 100 || 0).toFixed(0)}%
                                    </span>
                                    <span className="stat-label">Success Rate</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Personal Information Section */}
                    <div className="info-section">
                        <div className="section-header">
                            <h3>Personal Information</h3>
                            {!isEditing && (
                                <button className="edit-btn" onClick={handleEdit}>
                                    ✏️ Edit
                                </button>
                            )}
                        </div>

                        {isEditing ? (
                            <div className="edit-form">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled
                                            className="disabled-input"
                                        />
                                        <small className="form-help">Email cannot be changed</small>
                                    </div>
                                    <div className="form-group">
                                        <label>Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Enter your phone number"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Enrollment No</label>
                                        <input
                                            type="text"
                                            name="enrollment"
                                            value={formData.enrollment}
                                            onChange={handleChange}
                                            placeholder="Enter enrollment number"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Branch</label>
                                        <select
                                            name="branch"
                                            value={formData.branch}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Branch</option>
                                            <option value="Computer Science">Computer Science</option>
                                            <option value="Electrical Engineering">Electrical Engineering</option>
                                            <option value="Mechanical Engineering">Mechanical Engineering</option>
                                            <option value="Civil Engineering">Civil Engineering</option>
                                            <option value="Business Administration">Business Administration</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Year</label>
                                        <select
                                            name="year"
                                            value={formData.year}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Year</option>
                                            <option value="First Year">First Year</option>
                                            <option value="Second Year">Second Year</option>
                                            <option value="Third Year">Third Year</option>
                                            <option value="Fourth Year">Fourth Year</option>
                                            <option value="Graduate">Graduate</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-actions">
                                    <button className="save-btn" onClick={handleSave}>
                                        💾 Save Changes
                                    </button>
                                    <button className="cancel-btn" onClick={handleCancel}>
                                        ❌ Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="info-grid">
                                <div className="info-card">
                                    <div className="info-icon">👤</div>
                                    <div className="info-content">
                                        <label>Full Name</label>
                                        <p>{userData.name}</p>
                                    </div>
                                </div>
                                <div className="info-card">
                                    <div className="info-icon">📧</div>
                                    <div className="info-content">
                                        <label>Email</label>
                                        <p>{userData.email}</p>
                                    </div>
                                </div>
                                <div className="info-card">
                                    <div className="info-icon">📱</div>
                                    <div className="info-content">
                                        <label>Phone</label>
                                        <p>{userData.phone || "Not provided"}</p>
                                    </div>
                                </div>
                                <div className="info-card">
                                    <div className="info-icon">🎓</div>
                                    <div className="info-content">
                                        <label>Enrollment No</label>
                                        <p>{userData.enrollment || "Not provided"}</p>
                                    </div>
                                </div>
                                <div className="info-card">
                                    <div className="info-icon">🏛️</div>
                                    <div className="info-content">
                                        <label>Branch</label>
                                        <p>{userData.branch || "Not provided"}</p>
                                    </div>
                                </div>
                                <div className="info-card">
                                    <div className="info-icon">📅</div>
                                    <div className="info-content">
                                        <label>Year</label>
                                        <p>{userData.year || "Not provided"}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Reported Items Section */}
                    <div className="items-section">
                        <div className="section-header">
                            <h3>My Reported Items</h3>
                            <div className="section-actions">
                                <button
                                    className="browse-btn"
                                    onClick={() => navigate("/items")}
                                >
                                    🔍 Browse All Items
                                </button>
                                <button
                                    className="report-btn"
                                    onClick={() => navigate("/report-item")}
                                >
                                    📝 Report New Item
                                </button>
                            </div>
                        </div>

                        {items.length === 0 ? (
                            <div className="no-items-card">
                                <div className="no-items-icon">📭</div>
                                <h4>No Items Reported Yet</h4>
                                <p>You haven't reported any lost or found items.</p>
                                <button
                                    className="primary-btn"
                                    onClick={() => navigate("/report-item")}
                                >
                                    Report Your First Item
                                </button>
                            </div>
                        ) : (
                            <div className="items-grid">
                                {items.map((item) => (
                                    <div key={item._id} className="item-card">
                                        <div className="item-header">
                                            <div className={`item-category ${item.category}`}>
                                                {item.category === "lost" ? "🚨 Lost Item" : "📦 Found Item"}
                                            </div>
                                            <div className={`item-status ${getStatusColor(item.status)}`}>
                                                {item.status}
                                            </div>
                                        </div>
                                        <div className="item-body">
                                            <h4>{item.title}</h4>
                                            <p className="item-description">{item.description}</p>
                                            <div className="item-meta">
                                                <div className="meta-item">
                                                    <span className="meta-icon">📍</span>
                                                    <span>{item.location}</span>
                                                </div>
                                                <div className="meta-item">
                                                    <span className="meta-icon">📅</span>
                                                    <span>{new Date(item.date).toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="item-actions">
                                            <button className="view-btn" onClick={() => navigate(`/item/${item._id}`)}>
                                                View Details
                                            </button>
                                            <button className="edit-item-btn" onClick={() => navigate(`/edit-item/${item._id}`)}>
                                                Edit
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;