import React, { useEffect, useState, useCallback } from "react";
import AdminLayout from "../layout/AdminLayout";
import { adminService } from "../services/adminService";
import { FaCheck, FaTimes, FaCalendarAlt, FaUser, FaInfoCircle } from "react-icons/fa";
import "../styles/Admin.css";

function PendingItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPendingItems = useCallback(async () => {
    try {
      setLoading(true);
      // We fetch items with status pending
      const response = await adminService.getAllItems({ status: "pending" });
      setItems(response.items || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch pending items");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingItems();
  }, [fetchPendingItems]);

  const handleApprove = async (id) => {
    try {
      console.log("Attempting to approve item:", id);
      const result = await adminService.updateItemStatus(id, "approved");
      console.log("Approve result:", result);

      // Remove from UI
      setItems(prev => prev.filter(item => item._id !== id));
      alert("Item approved successfully!");
    } catch (err) {
      console.error("Error approving item:", err);
      const msg = err.response?.data?.message || err.message || "Unknown error";
      alert("Failed to approve item: " + msg);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this item?")) return;

    try {
      console.log("Attempting to reject item:", id);
      const result = await adminService.updateItemStatus(id, "rejected");
      console.log("Reject result:", result);

      // Remove from UI
      setItems(prev => prev.filter(item => item._id !== id));
      alert("Item rejected successfully!");
    } catch (err) {
      console.error("Error rejecting item:", err);
      const msg = err.response?.data?.message || err.message || "Unknown error";
      alert("Failed to reject item: " + msg);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h2>Pending Items</h2>
        <p>List of all reports awaiting your approval.</p>
      </div>


      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Fetching pending reports...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <p>No reports awaiting approval at this time.</p>
        </div>
      ) : (
        <div className="pending-items-list">
          {items.map((item) => (
            <div key={item._id} className="pending-item-row-card">
              <div className="pending-item-header">
                <span className={`category-tag tag-${item.category}`}>
                  {item.category.toUpperCase()}
                </span>
                <span className="item-type-text">{item.itemType}</span>
              </div>

              <div className="pending-item-body">
                <div className="pending-item-main">
                  <h3>{item.title}</h3>
                  <div className="description-box">
                    <strong>Description:</strong>
                    <p>{item.description}</p>
                  </div>
                </div>

                <div className="pending-item-details">
                  <div className="detail-line">
                    <FaUser /> <span>Reported by: <strong>{item.userId?.name || item.userName || "Unknown"}</strong></span>
                  </div>
                  <div className="detail-line">
                    <FaCalendarAlt /> <span>Date: {new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-line">
                    <FaInfoCircle /> <span>Status: <em style={{ color: '#f39c12' }}>{item.status}</em></span>
                  </div>
                </div>

                <div className="pending-item-actions">
                  <button
                    className="btn btn-success approve-btn"
                    onClick={() => handleApprove(item._id)}
                  >
                    <FaCheck /> Approve
                  </button>
                  <button
                    className="btn btn-danger reject-btn"
                    onClick={() => handleReject(item._id)}
                  >
                    <FaTimes /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

export default PendingItems;
