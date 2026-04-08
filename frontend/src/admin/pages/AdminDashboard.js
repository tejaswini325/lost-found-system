/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import { dashboardService } from "../services/dashboardService";
import "../styles/Admin.css";

import {
  FaUsers,
  FaBoxOpen,
  FaCheckCircle,
  FaChartBar,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaExclamationTriangle,
  FaUserShield,
  FaSync,
  FaHistory,
} from "react-icons/fa";

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    lostItems: 0,
    foundItems: 0,
    resolvedCases: 0,
    pendingApproval: 0,
  });
  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchDashboardData();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem("adminToken");
    const adminData = localStorage.getItem("adminData");

    if (!token || !adminData) {
      navigate("/admin/login");
      return;
    }

    try {
      setAdmin(JSON.parse(adminData));
    } catch {
      navigate("/admin/login");
    }
  };

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);

      const statsData = await dashboardService.getDashboardStats();


      // Map fields returned by backend
      setStats({
        totalUsers: statsData.totalUsers || 0,
        lostItems: statsData.lostItems || 0,
        foundItems: statsData.foundItems || 0,
        resolvedCases: statsData.resolvedCases || 0,
        pendingApproval: statsData.pendingApproval || 0,
      });

      setLastRefreshed(new Date());
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const id = setInterval(() => {
      fetchDashboardData();
    }, 60000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  const StatCard = ({ title, value, icon: Icon, color, onClick }) => (
    <div
      className="stat-card clickable"
      onClick={onClick}
      style={{ borderLeft: `4px solid ${color}` }}
    >
      <div className="stat-icon" style={{ backgroundColor: `${color}15` }}>
        <Icon size={22} color={color} />
      </div>
      <div className="stat-content">
        <h3>{value}</h3>
        <p>{title}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>
              <FaUserShield /> Admin Dashboard
            </h1>
            <p>Welcome back, {admin?.name || admin?.email}</p>
            {lastRefreshed && (
              <div className="last-refreshed">Last refreshed: {new Date(lastRefreshed).toLocaleString()}</div>
            )}
          </div>

          <div className="header-actions">
            <button onClick={fetchDashboardData} disabled={refreshing}>
              <FaSync /> Refresh
            </button>
            <button onClick={handleLogout} className="btn-danger">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        <div className="stats-grid">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={FaUsers}
            color="#3498db"
            onClick={() => navigate("/admin/users")}
          />
          <StatCard
            title="Lost Items"
            value={stats.lostItems}
            icon={FaExclamationTriangle}
            color="#e74c3c"
            onClick={() => navigate("/admin/all-items")}
          />
          <StatCard
            title="Found Items"
            value={stats.foundItems}
            icon={FaBoxOpen}
            color="#2ecc71"
            onClick={() => navigate("/admin/all-items")}
          />
          <StatCard
            title="Resolved"
            value={stats.resolvedCases}
            icon={FaCheckCircle}
            color="#9b59b6"
          />
          <StatCard
            title="Pending"
            value={stats.pendingApproval}
            icon={FaHistory}
            color="#f39c12"
            onClick={() => navigate("/admin/pending")}
          />
        </div>



        <div className="quick-actions">
          <button onClick={() => navigate("/admin/users")}>
            <FaUsers /> Users
          </button>
          <button onClick={() => navigate("/admin/all-items")}>
            <FaBoxOpen /> Items
          </button>
          <button onClick={() => navigate("/admin/reports")}>
            <FaChartBar /> Reports
          </button>
          <button onClick={() => navigate("/admin/analytics")}>
            <FaChartLine /> Analytics
          </button>
          <button onClick={() => navigate("/admin/settings")}>
            <FaCog /> Settings
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
