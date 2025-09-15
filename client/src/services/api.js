import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
});

// Optional boot default on first import
const bootToken = localStorage.getItem('token')
if (bootToken) api.defaults.headers.common.Authorization = `Bearer ${bootToken}`

export default api;
