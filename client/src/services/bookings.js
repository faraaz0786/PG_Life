import api from './api'
export const createBooking = (data) => api.post('/api/bookings', data).then(r=>r.data)
export const myBookings = () => api.get('/api/bookings/me').then(r=>r.data)
export const ownerBookings = () => api.get('/api/bookings/owner').then(r=>r.data)
export const updateBooking = (id, status) => api.put(`/api/bookings/${id}`, { status }).then(r=>r.data)
