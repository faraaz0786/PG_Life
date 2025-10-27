// client/src/services/api.js
import axios from 'axios';

// Determine backend base URL — from env or fallback to local dev
const rawBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const baseURL = rawBase.replace(/\/$/, ''); // remove trailing slash if any

console.log('[API] Base URL →', baseURL); // helpful during debugging

const api = axios.create({
  baseURL,
  withCredentials: true, // allow sending cookies / auth headers
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 20000, // prevent hanging requests
});

// Helper — set or clear bearer token
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete api.defaults.headers.common.Authorization;
  }
};

// Auto-attach token from localStorage for each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle expired / invalid tokens gracefully
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      setAuthToken(null);
    }
    return Promise.reject(err);
  }
);

// Boot existing token on reload
const bootToken = localStorage.getItem('token');
if (bootToken) {
  api.defaults.headers.common.Authorization = `Bearer ${bootToken}`;
}

export default api;
