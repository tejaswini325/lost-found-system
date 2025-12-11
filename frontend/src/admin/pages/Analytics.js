import React from "react";
import AdminLayout from '../layout/AdminLayout';
import { FaChartLine } from 'react-icons/fa';
import '../styles/Admin.css';

function Analytics() {
    return (
        <AdminLayout>
            <div className="admin-page-header">
                <h2>Analytics</h2>
            </div>

            <div className="analytics-container">
                <div className="empty-state">
                    <FaChartLine size={50} color="#ccc" />
                    <h3>Analytics Dashboard</h3>
                    <p>Detailed analytics and charts will be implemented here.</p>
                </div>
            </div>
        </AdminLayout>
    );
}

export default Analytics;
