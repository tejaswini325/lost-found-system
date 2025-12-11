import api from './api';

export const adminService = {
  // User Management
  getAllUsers: async (params) => {
    try {
      const response = await api.get('/admin/users', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Item Management
  getAllItems: async (params) => {
    try {
      const response = await api.get('/admin/items', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateItemStatus: async (id, status, adminNotes) => {
    try {
      const response = await api.put(`/admin/items/${id}/status`, { status, adminNotes });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Settings (Placeholder for now)
  updateSettings: async (settings) => {
    // Implement when backend supports it
    return { success: true };
  }
};
