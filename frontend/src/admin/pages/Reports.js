import React, { useEffect, useState, useCallback } from "react";
import AdminLayout from "../layout/AdminLayout";
import { dashboardService } from "../services/dashboardService";
import { adminService } from "../services/adminService";
import {
  FaChartPie,
  FaList,
  FaDownload,
  FaSync,
  FaFileAlt
} from "react-icons/fa";
import "../styles/Admin.css";
import "../styles/AnalyticsReports.css";

function Reports() {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReportData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsData, activitiesData, itemsData] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getRecentActivities(15),
        adminService.getAllItems({ limit: 10, page: 1 }),
      ]);

      setStats(statsData);
      setActivities(activitiesData.activities || []);
      setRecentItems(itemsData.items || []);
    } catch (err) {
      console.error("Error fetching report data:", err);
      setError("Failed to load report data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  const exportToCSV = () => {
    const csvContent = [
      ["Date", "Type", "Description", "Time"],
      ...activities.map((activity) => [
        new Date().toLocaleDateString(),
        activity.type,
        activity.description,
        activity.time,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity-report-${new Date()
      .toISOString()
      .split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Compiling system reports...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <div className="title-section">
          <h2><FaFileAlt /> System Reports</h2>
          <p>Comprehensive logs and statistical summaries. Descriptions only.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={fetchReportData}>
            <FaSync /> Sync Data
          </button>
          <button
            className="btn btn-primary"
            onClick={exportToCSV}
            disabled={activities.length === 0}
          >
            <FaDownload /> Download CSV
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="reports-container">
        {/* Summary */}
        <div className="report-card">
          <h3>
            <FaChartPie /> Inventory Snapshot
          </h3>

          {stats && (
            <div className="summary-grid">
              <div className="summary-item">
                <span>Total Users</span>
                <strong>{stats.totalUsers}</strong>
              </div>
              <div className="summary-item">
                <span>Lost Items</span>
                <strong>{stats.lostItems}</strong>
              </div>
              <div className="summary-item">
                <span>Found Items</span>
                <strong>{stats.foundItems}</strong>
              </div>
              <div className="summary-item">
                <span>Resolved Cases</span>
                <strong>{stats.resolvedCases}</strong>
              </div>
              <div className="summary-item">
                <span>Pending Approval</span>
                <strong>{stats.pendingApproval}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Recent Items */}
        <div className="report-card full-width">
          <h3>
            <FaList /> Latest Submissions
          </h3>
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
                {recentItems.length > 0 ? (
                  recentItems.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <div>
                          <strong>{item.title}</strong>
                          <div style={{ fontSize: '0.8rem', color: '#666' }}>{item.itemType}</div>
                        </div>
                      </td>
                      <td style={{ maxWidth: '300px' }}>
                        <div className="item-description-cell">
                          {item.description}
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-${item.category}`}>{item.category}</span>
                      </td>
                      <td>
                        <span className={`status-pill status-${item.status}`}>{item.status}</span>
                      </td>
                      <td>{item.userId?.name || item.userName || "Unknown"}</td>
                      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" className="text-center">No recent items found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Log */}
        <div className="report-card full-width">
          <h3>
            <FaList /> System Audit Log
          </h3>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Event Type</th>
                  <th>Description</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {activities.length > 0 ? (
                  activities.map((a, i) => (
                    <tr key={i}>
                      <td><span className="event-type-badge">{a.type || 'Event'}</span></td>
                      <td>{a.description || a.message}</td>
                      <td>{a.time || new Date(a.createdAt).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No activity logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Reports;
