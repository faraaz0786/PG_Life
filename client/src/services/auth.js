import api from './api'
export const signup = (data) => api.post('/api/auth/signup', data).then(r=>r.data)
export const loginApi = (data) => api.post('/api/auth/login', data).then(r=>r.data)
export const me = () => api.get('/api/auth/me').then(r=>r.data)
