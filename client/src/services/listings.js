import api from './api'
export const searchListings = (params) => api.get('/api/listings', { params }).then(r=>r.data)
export const getListing = (id) => api.get(`/api/listings/${id}`).then(r=>r.data)
export const createListing = (data) => api.post('/api/listings', data).then(r=>r.data)
export const updateListing = (id, data) => api.put(`/api/listings/${id}`, data).then(r=>r.data)
export const deleteListing = (id) => api.delete(`/api/listings/${id}`).then(r=>r.data)
