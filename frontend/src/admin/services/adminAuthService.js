import axios from "axios";

// Primary API (use env when provided), fallback to alternate port if unreachable
const PRIMARY = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const ALT = PRIMARY.includes("5001") ? "http://localhost:5000/api" : "http://localhost:5001/api";

const postLogin = async (base, email, password) => {
  const url = `${base.replace(/\/$/, '')}/admin/login`;
  return axios.post(url, { email, password });
};

export const adminAuthService = {
  login: async (email, password) => {
    try {
      // Try primary base first
      let response;
      try {
        response = await postLogin(PRIMARY, email, password);
      } catch (err) {
        // If network error (no response), try alternate base
        if (err.request && !err.response) {
          try {
            response = await postLogin(ALT, email, password);
          } catch (err2) {
            // both attempts failed to connect
            throw new Error('Cannot reach backend API (tried primary and alternate).');
          }
        } else {
          // Received error response (4xx/5xx) from primary
          throw err;
        }
      }

      if (response?.data?.success) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminData', JSON.stringify(response.data.admin));
        if (response.data.admin?.email) localStorage.setItem('adminEmail', response.data.admin.email);
      }

      return response.data;
    } catch (err) {
      // Normalize error object returned to callers
      if (err.response) {
        return { success: false, message: err.response.data?.message || err.response.statusText };
      }
      return { success: false, message: err.message || 'Login failed' };
    }
  },

  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    localStorage.removeItem('adminEmail');
  },

  getToken: () => localStorage.getItem('adminToken'),
};
