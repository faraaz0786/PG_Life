const asyncHandler = require('../utils/asyncHandler');
const Booking = require('../models/Booking');
const Listing = require('../models/Listing');

/**
 * POST /api/bookings
 * Seeker creates a request
 * body: { listingId, message?, visitDate? }
 */
exports.createBooking = asyncHandler(async (req, res) => {
  const { listingId, message, visitDate } = req.body;
  if (!listingId) return res.status(400).json({ message: 'listingId is required' });

  const listing = await Listing.findById(listingId);
  if (!listing) return res.status(404).json({ message: 'Listing not found' });

  // Prevent booking own listing
  if (String(listing.ownerId) === String(req.user._id)) {
    return res.status(400).json({ message: 'You cannot book your own listing' });
  }

  // Prevent duplicate active requests by the same seeker for the same listing
  const existing = await Booking.findOne({
    listingId,
    seekerId: req.user._id,
    status: { $in: ['requested', 'accepted'] },
  });
  if (existing) {
    return res.status(409).json({ message: 'You already have an active request for this listing' });
  }

  const created = await Booking.create({
    listingId,
    seekerId: req.user._id,
    status: 'requested',
    message,
    visitDate,
  });

  // Return a UI-friendly shape
  res.status(201).json({
    _id: created._id,
    status: created.status,
    createdAt: created.createdAt,
    listing: {
      _id: listing._id,
      title: listing.title,
      city: listing.city,
      price: listing.price,
      images: listing.images,
    },
    seeker: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
  });
});

/**
 * GET /api/bookings/me
 * Seeker: my bookings
 */
exports.getMyBookings = asyncHandler(async (req, res) => {
  const docs = await Booking.find({ seekerId: req.user._id })
    .sort({ createdAt: -1 })
    .populate('listingId', 'title city price images')
    .lean();

  const items = docs.map((b) => ({
    _id: b._id,
    status: b.status,
    createdAt: b.createdAt,
    listing: b.listingId
      ? {
          _id: b.listingId._id,
          title: b.listingId.title,
          city: b.listingId.city,
          price: b.listingId.price,
          images: b.listingId.images,
        }
      : null,
  }));

  res.json(items);
});

/**
 * GET /api/bookings/owner
 * Owner: incoming requests for the owner’s listings
 */
exports.getOwnerRequests = asyncHandler(async (req, res) => {
  // All listing IDs owned by this owner
  const listingIds = await Listing.find({ ownerId: req.user._id }).distinct('_id');
  if (!listingIds.length) return res.json([]); // owner has no listings yet

  const docs = await Booking.find({ listingId: { $in: listingIds } })
    .sort({ createdAt: -1 })
    .populate('listingId', 'title city price images')
    .populate('seekerId', 'name email')
    .lean();

  const items = docs.map((b) => ({
    _id: b._id,
    status: b.status,
    createdAt: b.createdAt,
    listing: b.listingId
      ? {
          _id: b.listingId._id,
          title: b.listingId.title,
          city: b.listingId.city,
          price: b.listingId.price,
          images: b.listingId.images,
        }
      : null,
    seeker: b.seekerId
      ? {
          _id: b.seekerId._id,
          name: b.seekerId.name,
          email: b.seekerId.email,
        }
      : null,
  }));

  res.json(items);
});

/**
 * PUT /api/bookings/:id
 * Owner: accept/decline a booking
 * body: { status: 'accepted' | 'declined' | 'requested' }
 */
exports.updateBookingStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['requested', 'accepted', 'declined'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const booking = await Booking.findById(id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });

  const listing = await Listing.findById(booking.listingId);
  if (!listing) return res.status(404).json({ message: 'Listing not found' });

  // Ensure this booking belongs to one of the owner’s listings
  if (String(listing.ownerId) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  booking.status = status;
  await booking.save();

  res.json({ message: 'Updated', status: booking.status });
});
