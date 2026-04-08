import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminAuthService } from "../services/adminAuthService";
import { FaShieldAlt, FaClipboardList, FaUsersCog, FaArrowRight } from "react-icons/fa";
import "../styles/Admin.css";
import logo from "../../assets/logo.png";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please provide both email and password.");
      return;
    }
    setLoading(true);

    try {
      const result = await adminAuthService.login(email, password);
      if (result.success) {
        navigate("/admin/dashboard");
      } else {
        setError(result.message || "Invalid email or password");
      }
    } catch (err) {
      console.error("Admin login error:", err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      {/* Top Left Corner Logo */}
      <div className="page-logo-container">
        <img src={logo} alt="KLE Tech Logo" className="page-top-logo" />
      </div>

      {/* Background Hero text stays centered */}
      <div className="login-hero-section">
        <h1 className="hero-title">Lost and Found <br /> System</h1>
        <p className="hero-subtitle">
          An advanced platform for efficiently managing and recovering lost and found items within KLE Technological University, ensuring a secure and streamlined process.
        </p>
      </div>

      <div className="login-split-view full-spread">
        {/* COMPLETELY LEFT: Admin Login Card */}
        <div className="login-side-wrapper">
          <div className="login-standalone-card realistic-shadow">
            <div className="login-header">
              <h2>Admin Access</h2>
              <p className="subtitle">Secure administrative login for system management.</p>
            </div>

            {error && <div className="alert alert-error"> {error}</div>}

            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label>Administrator Email</label>
                <input
                  type="email"
                  placeholder="admin@test.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  autoFocus
                  className="input-field realistic-input"
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="password-input realistic-input"
                />
              </div>

              <button type="submit" className="login-btn realistic-btn" disabled={loading}>
                {loading ? "Verifying..." : <>Log In <FaArrowRight /></>}
              </button>
            </form>
          </div>
        </div>

        {/* COMPLETELY RIGHT: Additional Info Blocks */}
        <div className="info-standalone-panel right-aligned">
          <div className="info-block frosted-info float-animation">
            <div className="info-icon-wrapper">
              <FaShieldAlt />
            </div>
            <div className="info-text">
              <h3>System Integrity</h3>
              <p>Ensuring data consistency and periodic database audits for campus inventory.</p>
            </div>
          </div>

          <div className="info-block frosted-info float-animation">
            <div className="info-icon-wrapper">
              <FaClipboardList />
            </div>
            <div className="info-text">
              <h3>Global Moderation</h3>
              <p>Centralized control over lost/found reports and claim verification workflows.</p>
            </div>
          </div>

          <div className="info-block frosted-info float-animation">
            <div className="info-icon-wrapper">
              <FaUsersCog />
            </div>
            <div className="info-text">
              <h3>Admin Governance</h3>
              <p>Defining user roles, monitoring access logs, and resolving dispute cases efficiently.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="login-footer-fixed">
        <p>© {new Date().getFullYear()} KLE Technological University | All Rights Reserved</p>
      </div>
    </div>
  );
};

export default AdminLogin;
