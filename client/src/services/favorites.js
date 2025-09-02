import api from './api'
export const addFavorite = (listingId) => api.post(`/api/favorites/${listingId}`).then(r=>r.data)
export const removeFavorite = (listingId) => api.delete(`/api/favorites/${listingId}`).then(r=>r.data)
export const myFavorites = () => api.get('/api/favorites/me').then(r=>r.data)
