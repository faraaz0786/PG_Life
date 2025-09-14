// client/src/services/favorites.js
import api from './api';

/** Array of favorite listings for the logged-in user */
export const myFavorites = async () => {
  const { data } = await api.get('/api/favorites/me');
  return Array.isArray(data) ? data : (data.items || []);
};

/** Add to favorites */
export const addFavorite = async (listingId) => {
  const { data } = await api.post(`/api/favorites/${listingId}`);
  return data;
};

/** Remove from favorites */
export const removeFavorite = async (listingId) => {
  const { data } = await api.delete(`/api/favorites/${listingId}`);
  return data;
};

/**
 * Toggle favorite.
 * - If your backend only has POST (add) and DELETE (remove), this tries POST first.
 * - If POST responds with a conflict/exists error, it falls back to DELETE.
 */
export const toggleFavorite = async (listingId) => {
  try {
    const { data } = await api.post(`/api/favorites/${listingId}`);
    return data; // added
  } catch (err) {
    // if already exists, try removing
    const status = err?.response?.status;
    const msg = err?.response?.data?.message || '';
    if (status === 409 || /exist|already/i.test(msg)) {
      const { data } = await api.delete(`/api/favorites/${listingId}`);
      return data; // removed
    }
    throw err;
  }
};
