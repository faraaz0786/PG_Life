// client/src/services/bookings.js
import api from './api';

/**
 * Create a booking/visit request.
 * Accepts either (listingId, payload?) OR ({ listingId, ... })
 */
export const createBooking = async (listingIdOrPayload, maybePayload = {}) => {
  const payload = typeof listingIdOrPayload === 'string'
    ? { listingId: listingIdOrPayload, ...maybePayload }
    : listingIdOrPayload;

  const { data } = await api.post('/api/bookings', payload);
  return data;
};

/** Seeker: my bookings */
export const myBookings = async () => {
  const { data } = await api.get('/api/bookings/me');
  return Array.isArray(data) ? data : (data.items || []);
};

/** Owner: incoming booking requests */
export const ownerRequests = async () => {
  const { data } = await api.get('/api/bookings/owner');
  return Array.isArray(data) ? data : (data.items || []);
};

/** Owner: update booking status (accepted | declined) */
export const updateBookingStatus = async (id, status) => {
  // matches route: PATCH /api/bookings/:id/status
  const { data } = await api.patch(`/api/bookings/${id}/status`, { status });
  return data;
};
