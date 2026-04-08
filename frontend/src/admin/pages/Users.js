import React, { useEffect, useState, useCallback } from "react";
import AdminLayout from '../layout/AdminLayout';
import { adminService } from '../services/adminService';
import { FaSearch, FaUser, FaEnvelope, FaBan, FaTrash, FaEye, FaEdit } from 'react-icons/fa';
import '../styles/Admin.css';

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        page: 1,
        limit: 10
    });
    const [pagination, setPagination] = useState(null);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await adminService.getAllUsers(filters);
            setUsers(response.users || []);
            setPagination(response.pagination || null);
        } catch (err) {
            setError('Failed to fetch users');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleSearch = (e) => {
        e.preventDefault();
        setFilters(prev => ({ ...prev, page: 1 }));
        fetchUsers();
    };

    return (
        <AdminLayout>
            <div className="admin-page-header">
                <div className="title-section">
                    <h2>Platform Users</h2>
                    <p>Manage and monitor all registered accounts on the system.</p>
                </div>
                <div className="header-actions">
                    <form onSubmit={handleSearch} className="search-form">
                        <div className="search-input-wrapper">
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={filters.search}
                                onChange={(e) =>
                                    setFilters(prev => ({ ...prev, search: e.target.value }))
                                }
                            />
                        </div>
                    </form>
                </div>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading member directory...</p>
                </div>
            ) : error ? (
                <div className="alert alert-danger">{error}</div>
            ) : (
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>User Profile</th>
                                <th>Contact Info</th>
                                <th>Joined</th>
                                <th>Account Status</th>
                                <th>Quick Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="user-avatar-circle">
                                                <FaUser />
                                            </div>
                                            <div className="user-info-text">
                                                <span className="user-name-bold">{user.name}</span>
                                                <span className="user-role-badge">{user.role || 'User'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="email-link">
                                            <FaEnvelope className="icon-xs" /> {user.email}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="date-cell">
                                            {new Date(user.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="status-cell">
                                            <span className={`status-pill ${user.isActive !== false ? 'status-active' : 'status-blocked'}`}>
                                                {user.isActive !== false ? 'Active' : 'Blocked'}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="actions-cell">
                                            <button className="action-btn-mini btn-view" title="View Details">
                                                <FaEye />
                                            </button>
                                            <button className="action-btn-mini btn-edit" title="Edit Profile">
                                                <FaEdit />
                                            </button>
                                            <button
                                                className={`action-btn-mini ${user.isActive !== false ? 'btn-block' : 'btn-unblock'}`}
                                                title={user.isActive !== false ? "Block User" : "Unblock User"}
                                            >
                                                <FaBan />
                                            </button>
                                            <button className="action-btn-mini btn-delete" title="Delete Account">
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {pagination && pagination.pages > 1 && (
                <div className="pagination">
                    <button
                        className="page-btn"
                        disabled={pagination.page === 1}
                        onClick={() =>
                            setFilters(prev => ({ ...prev, page: prev.page - 1 }))
                        }
                    >
                        Previous
                    </button>
                    <span className="page-info">
                        Page {pagination.page} / {pagination.pages}
                    </span>
                    <button
                        className="page-btn"
                        disabled={pagination.page === pagination.pages}
                        onClick={() =>
                            setFilters(prev => ({ ...prev, page: prev.page + 1 }))
                        }
                    >
                        Next
                    </button>
                </div>
            )}
        </AdminLayout>
    );
}

export default Users;
