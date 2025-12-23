import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api";
import "./Found.css";

function Found() {
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFoundItems();
  }, []);

  const fetchFoundItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const authHeaders = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(`${API_BASE_URL}/api/items/all`, {
        headers: authHeaders,
      });

      if (response.data.success) {
        // Filter only found items from all items
        const foundItems = response.data.items.filter(item => item.category === 'found');
        setFoundItems(foundItems);
      }
    } catch (error) {
      console.error("Error fetching found items:", error);
      setError("Failed to load found items");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="found-container">
        <div className="loading">Loading found items...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="found-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="found-container">
      <h1>Found Items</h1>
      <p>View all found items on campus</p>
      
      {foundItems.length === 0 ? (
        <div className="no-items">
          <p>No found items available</p>
        </div>
      ) : (
        <div className="found-items-grid">
          {foundItems.map((item) => (
            <div key={item._id} className="found-item-card">
              <div className="item-header">
                <h3>{item.title}</h3>
                <span className="status-badge found">Found</span>
              </div>
              
              <div className="item-image">
                {item.image ? (
                  <img src={`${API_BASE_URL}${item.image}`} alt={item.title} />
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </div>

              <div className="item-details">
                <p className="description">{item.description}</p>
                <div className="meta-info">
                  <div className="meta-item">
                    <strong>Location:</strong> {item.location}
                  </div>
                  <div className="meta-item">
                    <strong>Date:</strong> {new Date(item.date).toLocaleDateString()}
                  </div>
                  <div className="meta-item">
                    <strong>Type:</strong> {item.itemType || 'Unknown'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Found;