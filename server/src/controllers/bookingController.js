const Booking = require('../models/Booking');
const Listing = require('../models/Listing');
const asyncHandler = require('../utils/asyncHandler');

exports.createBooking = asyncHandler(async (req, res) => {
  const { listingId } = req.body;
  if (!listingId) return res.status(400).json({ message: 'listingId required' });
  const booking = await Booking.create({ listingId, seekerId: req.user._id });
  res.status(201).json(booking);
});

exports.updateBookingStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const booking = await Booking.findById(id).populate('listingId');
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  if (String(booking.listingId.ownerId) !== String(req.user._id)) return res.status(403).json({ message: 'Not your listing booking' });
  if (!['accepted', 'declined', 'requested'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
  booking.status = status;
  await booking.save();
  res.json(booking);
});

exports.getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ seekerId: req.user._id }).populate('listingId');
  res.json(bookings);
});

exports.getOwnerBookings = asyncHandler(async (req, res) => {
  // find bookings where listing.ownerId == req.user._id
  const bookings = await Booking.find().populate('listingId');
  const mine = bookings.filter(b => String(b.listingId.ownerId) === String(req.user._id));
  res.json(mine);
});
