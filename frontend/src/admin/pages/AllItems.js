import React, { useEffect, useState, useCallback } from "react";
import AdminLayout from "../layout/AdminLayout";
import { adminService } from "../services/adminService";
import { FaBoxOpen, FaSearch, FaCalendarAlt, FaUser, FaMapMarkerAlt, FaFileAlt } from "react-icons/fa";
import "../styles/Admin.css";

function AllItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllItems();
      setItems(data.items || []);
    } catch (err) {
      console.error("Fetch items error", err);
      setError("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <div className="title-section">
          <h2>Campus Inventory</h2>
          <p>Full list of all reported items. Showing descriptions instead of images.</p>
        </div>

        <div className="header-actions">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-secondary" onClick={fetchItems}>
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading inventory...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : filteredItems.length === 0 ? (
        <div className="empty-state">
          <FaBoxOpen size={50} />
          <p>No items found matching your criteria.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title & Type</th>
                <th>Description</th>
                <th>Category</th>
                <th>Status</th>
                <th>Reported By</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item._id}>
                  <td>
                    <div className="item-title-cell">
                      <strong>{item.title}</strong>
                      <span className="small-type">{item.itemType}</span>
                    </div>
                  </td>
                  <td>
                    <div className="item-description-cell" title={item.description}>
                      {item.description.length > 100
                        ? item.description.substring(0, 100) + "..."
                        : item.description}
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${item.category}`}>{item.category}</span>
                  </td>
                  <td>
                    <span className={`status-pill status-${item.status}`}>{item.status}</span>
                  </td>
                  <td>
                    <div className="reporter-cell">
                      <FaUser size={12} /> {item.userId?.name || item.userName || "Unknown"}
                    </div>
                  </td>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

export default AllItems;
