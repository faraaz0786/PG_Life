const router = require('express').Router();
const { protect, ownerOnly, seekerOnly } = require('../middleware/auth');
const {
  createBooking,
  getMyBookings,
  getOwnerRequests,
  updateBookingStatus,
  getBookingById,            // 👈 (optional if needed later)
} = require('../controllers/bookingController');

/**
 * Seeker: create a booking/visit request
 */
router.post('/', protect, seekerOnly, createBooking);

/**
 * Seeker: view my own bookings
 */
router.get('/me', protect, seekerOnly, getMyBookings);

/**
 * Owner: view all incoming requests for their listings
 */
router.get('/owner', protect, ownerOnly, getOwnerRequests);

/**
 * Owner: update booking status (accept / decline / requested)
 * existing route for status updates via PUT
 */
router.put('/:id', protect, ownerOnly, updateBookingStatus);

/**
 * ✅ NEW — Universal status update route
 * Some frontend components call /api/bookings/:id/status (PATCH)
 * This ensures compatibility with that endpoint.
 */
router.patch('/:id/status', protect, ownerOnly, updateBookingStatus);

/**
 * (Optional) Get single booking detail if required later
 */
// router.get('/:id', protect, getBookingById);

module.exports = router;
