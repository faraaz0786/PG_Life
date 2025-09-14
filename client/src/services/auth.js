import api from './api'
export const signup = (data) => api.post('/api/auth/signup', data).then(r=>r.data)
export const loginApi = (data) => api.post('/api/auth/login', data).then(r=>r.data)
export const me = () => api.get('/api/auth/me').then(r=>r.data)

export const forgotPassword = async (email) => {
    const { data } = await api.post('/api/auth/forgot-password', { email })
    return data
  }
  
  export const resetPassword = async ({ token, password }) => {
    const { data } = await api.post('/api/auth/reset-password', { token, password })
    return data
  }