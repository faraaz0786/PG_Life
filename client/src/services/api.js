// client/src/services/api.js
import axios from 'axios';

// Normalize base URL from env (Vercel) with a safe local fallback
const raw = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const baseURL = raw.replace(/\/$/, ''); // strip trailing slash

const api = axios.create({
  baseURL,
  withCredentials: true, // send/receive auth cookies across domains
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 20000,
});

// Helper: set/clear Bearer token (optional, cookie is primary)
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete api.defaults.headers.common.Authorization;
  }
};

// Attach token from localStorage on each request (if present)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If 401, clear any stale token so cookie-only flow can proceed
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      setAuthToken(null);
    }
    return Promise.reject(err);
  }
);

// Boot with existing token (refresh page, etc.)
const bootToken = localStorage.getItem('token');
if (bootToken) {
  api.defaults.headers.common.Authorization = `Bearer ${bootToken}`;
}

export default api;
