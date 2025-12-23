import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api";
import { useNavigate } from "react-router-dom";
import MessageButton from "../components/MessageButton";
import "./Lost.css";

function Lost() {
  const navigate = useNavigate();
  const [lostItems, setLostItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchLostItems();
  }, []);

  const fetchLostItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const authHeaders = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(`${API_BASE_URL}/api/items/all`, {
        headers: authHeaders,
      });

      if (response.data.success) {
        // Filter only lost items from all items
        const lostItems = response.data.items.filter(item => item.category === 'lost');
        setLostItems(lostItems);
      }
    } catch (error) {
      console.error("Error fetching lost items:", error);
      setError("Failed to load lost items");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="lost-container">
        <div className="loading">Loading lost items...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lost-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="lost-container">
      <h1>Lost Items</h1>
      <p>View all lost items reported on campus</p>
      
      {lostItems.length === 0 ? (
        <div className="no-items">
          <p>No lost items found</p>
        </div>
      ) : (
        <div className="lost-items-grid">
          {lostItems.map((item) => (
            <div
              key={item._id}
              className="lost-item-card"
              onClick={() => navigate(`/item/${item._id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") navigate(`/item/${item._id}`);
              }}
            >
              <div className="item-header">
                <h3>{item.title}</h3>
                <span className="status-badge lost">Lost</span>
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

              {item.userId && item.userId !== userId && (
                <MessageButton
                  itemId={item._id}
                  ownerId={item.userId}
                  className="card-message-button"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Lost;
