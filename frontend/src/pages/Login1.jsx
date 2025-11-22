// src/pages/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../pages/Login1.css'; // We'll create this CSS file for styling
import logoImage from '../assets/logo.png'; // Assuming your logo path

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  // Dummy database of registered emails for client-side simulation
  // In a real app, this would be an API call to your backend
  const registeredEmails = ['user@example.com', 'admin@kletech.ac.in'];

  const validateForm = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    if (!email) {
      setEmailError('Email Address is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email Address is invalid');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = (e) => {
    e.preventDefault(); // Prevent default form submission

    if (validateForm()) {
      // Simulate backend call
      if (!registeredEmails.includes(email)) {
        // If email not found, navigate to Create Account page
        setGeneralError('Email not found. Please create an account.');
        setTimeout(() => {
          navigate('/create-account', { state: { prefillEmail: email } }); // Pass email to pre-fill
        }, 1500); // Give user time to read the message
      } else {
        // Simulate successful login
        // In a real app, you would send email and password to backend for authentication
        console.log('Attempting login with:', { email, password });
        setGeneralError('Login successful! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/dashboard'); // Navigate to dashboard on success
        }, 1500);
      }
    }
  };

  return (
    <div className="auth-page-container">
      {/* Background image will be set via CSS */}
      <div className="background-image-overlay"></div>

      {/* Auth Card Container */}
      <div className="auth-card-wrapper">
        <div className="auth-card">
          <div className="logo-container-auth">
            <img src={logoImage} alt="KLE Tech Logo" className="auth-logo" />
          </div>

          <h2 className="auth-title">Login to Your Account</h2>
          <p className="auth-subtitle">
            Please enter your credentials to access the system.
          </p>

          <form onSubmit={handleLogin} className="auth-form">
            <div className="input-group">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`auth-input ${emailError ? 'input-error' : ''}`}
              />
              {emailError && <p className="error-message">{emailError}</p>}
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`auth-input ${passwordError ? 'input-error' : ''}`}
              />
              {passwordError && <p className="error-message">{passwordError}</p>}
            </div>

            {generalError && <p className="general-error-message">{generalError}</p>}

            <button type="submit" className="auth-button">
              Login
            </button>

            <p className="auth-footer-text">
              Don't have an account? <Link to="/create-account">Create Account</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;