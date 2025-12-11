import React, { useEffect, useState } from "react";
import AdminLayout from '../layout/AdminLayout';
import { adminService } from '../services/adminService';
import { FaChartPie, FaList, FaDownload } from 'react-icons/fa';
import '../styles/Admin.css';

function Reports() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, we would fetch specific report data
        // For now, we'll just simulate loading
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <AdminLayout>
            <div className="admin-page-header">
                <h2>System Reports</h2>
                <div className="header-actions">
                    <button className="btn btn-secondary">
                        <FaDownload /> Export CSV
                    </button>
                </div>
            </div>

            <div className="reports-container">
                <div className="report-card">
                    <h3><FaChartPie /> Item Status Distribution</h3>
                    <div className="placeholder-chart">
                        <p>Chart visualization would go here</p>
                        {/* Placeholder for chart */}
                        <div style={{ height: '200px', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            Chart Placeholder
                        </div>
                    </div>
                </div>

                <div className="report-card">
                    <h3><FaList /> Recent Activity Log</h3>
                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Activity</th>
                                    <th>User</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan="4" className="text-center">No reports generated yet.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default Reports;
