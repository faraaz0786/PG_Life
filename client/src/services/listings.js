// client/src/services/listings.js
import api from './api';

/**
 * Normalize the /api/listings response so the UI always receives:
 * { items: [], total: number, page: number, pages: number }
 * Whether the server returns an array or an object.
 */
export const searchListings = async (params) => {
  const { data } = await api.get('/api/listings', { params });
  if (Array.isArray(data)) {
    return { items: data, total: data.length, page: 1, pages: 1 };
  }
  // object shape from the new controller
  return {
    items: data?.items ?? [],
    total: data?.total ?? (data?.items?.length ?? 0),
    page: data?.page ?? 1,
    pages: data?.pages ?? 1,
  };
};

export const getListing = (id) =>
  api.get(`/api/listings/${id}`).then(r => r.data);

export const createListing = (data) =>
  api.post('/api/listings', data).then(r => r.data);

export const updateListing = (id, data) =>
  api.put(`/api/listings/${id}`, data).then(r => r.data);

export const deleteListing = (id) =>
  api.delete(`/api/listings/${id}`).then(r => r.data);

export const myListings = () =>
  api.get('/api/listings/mine').then(r => r.data);
