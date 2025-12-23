import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../api';
import MessageButton from '../components/MessageButton';
import './ItemDetail.css';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/items/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setItem(response.data.item);
        } else {
          setError('Item not found');
        }
      } catch (err) {
        console.error('Error fetching item:', err);
        setError('Failed to load item details');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <div className="item-detail-container">
        <div className="loading">Loading item details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="item-detail-container">
        <div className="error">{error}</div>
        <button onClick={() => navigate(-1)} className="back-button">
          Go Back
        </button>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="item-detail-container">
        <div className="not-found">Item not found</div>
        <button onClick={() => navigate(-1)} className="back-button">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="item-detail-container">
      <button onClick={() => navigate(-1)} className="back-button">
        &larr; Back to {item.category === 'lost' ? 'Lost Items' : 'Found Items'}
      </button>

      <div className="item-detail-card">
        <div className="item-detail-header">
          <h1>{item.title}</h1>
          <span className={`status-badge ${item.category}`}>
            {item.category === 'lost' ? 'Lost' : 'Found'}
          </span>
        </div>

        <div className="item-detail-content">
          <div className="item-image-container">
            {item.image ? (
              <img 
                src={`${API_BASE_URL}${item.image}`} 
                alt={item.title} 
                className="item-detail-image"
              />
            ) : (
              <div className="no-image">No Image Available</div>
            )}
          </div>

          <div className="item-details">
            <div className="detail-section">
              <h3>Description</h3>
              <p>{item.description || 'No description provided.'}</p>
            </div>

            <div className="detail-section">
              <h3>Details</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Location:</span>
                  <span className="detail-value">{item.location || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Category:</span>
                  <span className="detail-value">{item.itemType || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status:</span>
                  <span className="detail-value">
                    {item.status === 'claimed' ? 'Claimed' : 'Not Claimed'}
                  </span>
                </div>
              </div>
            </div>

            {item.additionalDetails && (
              <div className="detail-section">
                <h3>Additional Information</h3>
                <p>{item.additionalDetails}</p>
              </div>
            )}

            <div className="item-actions">
              {item.userId !== userId && (
                <MessageButton 
                  itemId={item._id} 
                  ownerId={item.userId} 
                  className="primary-button"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
