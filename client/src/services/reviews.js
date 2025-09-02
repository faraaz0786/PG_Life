import api from './api'
export const addReview = (data) => api.post('/api/reviews', data).then(r=>r.data)
export const getReviews = (listingId) => api.get(`/api/reviews/${listingId}`).then(r=>r.data)
