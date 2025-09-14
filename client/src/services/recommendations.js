import api from './api'

export const getMyRecommendations = async () => {
  const { data } = await api.get('/api/recommendations/me')
  // API may return an array or {items}
  return Array.isArray(data) ? data : (data.items || data)
}
