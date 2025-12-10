import React, { useState } from "react";
import "./Login1.css";
import { useNavigate } from "react-router-dom";
import logoImage from "../assets/logo.png";
import { Link } from "react-router-dom";

const Login1 = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(""); // Clear error when typing
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message === "User not found") {
          setError("Email not found. Creating new account...");
          setTimeout(() => navigate("/login"), 2000);
          return;
        }
        setError(data.message || "Login failed");
        return;
      }

      if (data.success) {
        // Store token and user data
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("userEmail", data.user.email);
        localStorage.setItem("userPhone", data.user.phone || "");
        localStorage.setItem("userEnrollment", data.user.enrollment || "");
        localStorage.setItem("userSemester", data.user.semester || "");
        localStorage.setItem("userBranch", data.user.branch || "");
        localStorage.setItem("userYear", data.user.year || "");

        setSuccess("Login Successful! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="logo-container">
        <img src={logoImage} alt="Logo" className="form-logo" />
      </div>

      <div className="background-image-overlay"></div>

      <div className="auth-card-wrapper">
        <div className="auth-card">
          <h2 className="auth-title">Login</h2>
          <p className="auth-subtitle">Access your account</p>

          {error && (
            <div className="general-error-message error">
              {error}
            </div>
          )}

          {success && (
            <div className="general-error-message success">
              {success}
            </div>
          )}

          <form className="auth-form" onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Enter Your Email"
                className="auth-input"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                className="auth-input"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <button className="auth-button" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="auth-footer-text">
            New user? <Link to="/login">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login1;