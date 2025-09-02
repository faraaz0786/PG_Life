const router = require('express').Router();
const { protect, ownerOnly } = require('../middleware/auth');
const { createBooking, updateBookingStatus, getMyBookings, getOwnerBookings } = require('../controllers/bookingController');

router.post('/', protect, createBooking);
router.put('/:id', protect, ownerOnly, updateBookingStatus);
router.get('/me', protect, getMyBookings);
router.get('/owner', protect, ownerOnly, getOwnerBookings);

module.exports = router;
