import api from './api'
export const recForMe = () => api.get('/api/recommendations/me').then(r=>r.data)
