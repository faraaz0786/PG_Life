const router = require('express').Router();
const { protect, ownerOnly, seekerOnly } = require('../middleware/auth');
const {
  createBooking,
  getMyBookings,
  getOwnerRequests,
  updateBookingStatus,
} = require('../controllers/bookingController');

// Seeker creates a booking/visit request
router.post('/', protect, seekerOnly, createBooking);

// Seeker: my bookings
router.get('/me', protect, seekerOnly, getMyBookings);

// Owner: incoming requests for the owner’s listings
router.get('/owner', protect, ownerOnly, getOwnerRequests);

// Owner: accept/decline a request (status in body: requested|accepted|declined)
router.put('/:id', protect, ownerOnly, updateBookingStatus);

module.exports = router;
