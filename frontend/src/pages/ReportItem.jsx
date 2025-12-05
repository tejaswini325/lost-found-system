import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ReportItem.css";

const ReportItem = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        itemName: "",
        category: "",
        location: "",
        dateLost: "",
        description: "",
        image: null,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    // Get user token from localStorage
    const token = localStorage.getItem("token");

    const categories = [
        "Electronics",
        "Books & Stationery",
        "Clothing & Accessories",
        "ID Cards & Documents",
        "Bags & Wallets",
        "Keys",
        "Water Bottles",
        "Other",
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            image: e.target.files[0],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            setMessage("Please login first!");
            setTimeout(() => navigate("/login"), 2000);
            return;
        }

        // Validation
        if (!formData.itemName.trim()) {
            setMessage("Please enter item name");
            return;
        }
        if (!formData.category) {
            setMessage("Please select a category");
            return;
        }
        if (!formData.location.trim()) {
            setMessage("Please enter location");
            return;
        }
        if (!formData.dateLost) {
            setMessage("Please select date");
            return;
        }

        setIsSubmitting(true);
        setMessage("");

        try {
            const data = new FormData();
            data.append("itemName", formData.itemName);
            data.append("category", formData.category);
            data.append("location", formData.location);
            data.append("dateLost", formData.dateLost);
            data.append("description", formData.description);
            if (formData.image) {
                data.append("image", formData.image);
            }

            // Use the correct endpoint - /api/items/report
            const response = await axios.post(
                "http://localhost:5000/api/items/report",
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 201) {
                setMessage("Item reported successfully!");
                // Reset form
                setFormData({
                    itemName: "",
                    category: "",
                    location: "",
                    dateLost: "",
                    description: "",
                    image: null,
                });
                // Clear file input
                document.getElementById("imageInput").value = "";

                // Redirect to dashboard after 2 seconds
                setTimeout(() => navigate("/dashboard"), 2000);
            }
        } catch (error) {
            console.error("Error reporting item:", error);
            setMessage(error.response?.data?.message || "Failed to report item. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // If no token, redirect to login
    if (!token) {
        navigate("/login");
        return null;
    }

    return (
        <div className="report-item-container">
            <div className="report-item-card">
                <h2>Report Lost Item</h2>
                <p className="subtitle">Help others find your lost belongings</p>

                {message && (
                    <div className={`message ${message.includes("successfully") ? "success" : "error"}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="itemName">Item Name *</label>
                        <input
                            type="text"
                            id="itemName"
                            name="itemName"
                            value={formData.itemName}
                            onChange={handleChange}
                            placeholder="e.g., Blue Water Bottle, MacBook Pro"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Category *</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="location">Location Lost *</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="e.g., Library 2nd Floor, Canteen, Block A"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="dateLost">Date Lost *</label>
                        <input
                            type="date"
                            id="dateLost"
                            name="dateLost"
                            value={formData.dateLost}
                            onChange={handleChange}
                            max={new Date().toISOString().split("T")[0]}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Provide more details like brand, color, distinguishing marks..."
                            rows="4"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="imageInput">Upload Image (Optional)</label>
                        <input
                            type="file"
                            id="imageInput"
                            name="image"
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                        <small>Max file size: 5MB. Supported: JPG, PNG, JPEG</small>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => navigate("/dashboard")}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Reporting..." : "Report Item"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportItem;