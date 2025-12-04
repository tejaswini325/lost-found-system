import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Footbar from '../components/Footbar';
import './Help.css';

const HelpForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    query: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      // Send to backend API
      const response = await fetch('http://localhost:5000/api/send-help-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage('✅ Message sent successfully! We will contact you soon.');
        setFormData({ name: '', email: '', query: '' });
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setMessage('');
        }, 5000);
      } else {
        // Fallback to mailto if backend fails
        const subject = `Help Request from ${formData.name}`;
        const body = `
Name: ${formData.name}
Email: ${formData.email}
Query: ${formData.query}
        `.trim();
        const mailtoLink = `mailto:01fe23bci044@kletech.ac.in,01fe23bci041@kletech.ac.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailtoLink, '_blank');
        setMessage('⚠️ Using alternative method... Please send the email that opened.');
      }
    } catch (error) {
      console.error('Error:', error);
      // Fallback to mailto on connection error
      const subject = `Help Request from ${formData.name}`;
      const body = `
Name: ${formData.name}
Email: ${formData.email}
Query: ${formData.query}
      `.trim();
      const mailtoLink = `mailto:01fe23bci044@kletech.ac.in,01fe23bci041@kletech.ac.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink, '_blank');
      setMessage('⚠️ Opening email client... Please send the email that opened.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="help-page-wrapper">
      {/* Full-width blue header */}
      <div className="full-width-header">
        <h1>Need Help? Contact Us</h1>
      </div>
      
      {/* Main content */}
      <div className="help-page-content">
        <form onSubmit={handleSubmit} className="simple-form">
          {/* Status Message */}
          {message && (
            <div className={`status-message ${message.includes('✅') ? 'success' : 'warning'}`}>
              {message}
            </div>
          )}
          
          {/* Information Box */}
          
            

          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="query">Your Query *</label>
            <textarea
              id="query"
              name="query"
              value={formData.query}
              onChange={handleChange}
              placeholder="Describe your issue or question"
              rows="4"
              required
              disabled={loading}
            />
          </div>

          <div className="button-group">
            <Link to="/" className="back-home-btn" onClick={(e) => loading && e.preventDefault()}>
              Back to Home
            </Link>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>

      {/* Footbar at bottom */}
      <Footbar />
    </div>
  );
};

export default HelpForm;