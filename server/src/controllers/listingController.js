const Listing = require('../models/Listing');
const Review = require('../models/Review');
const asyncHandler = require('../utils/asyncHandler');

exports.createListing = asyncHandler(async (req, res) => {
  const payload = { ...req.body, ownerId: req.user._id };
  const listing = await Listing.create(payload);
  res.status(201).json(listing);
});

exports.updateListing = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) return res.status(404).json({ message: 'Listing not found' });
  if (String(listing.ownerId) !== String(req.user._id)) return res.status(403).json({ message: 'Not your listing' });
  Object.assign(listing, req.body);
  await listing.save();
  res.json(listing);
});

exports.deleteListing = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) return res.status(404).json({ message: 'Listing not found' });
  if (String(listing.ownerId) !== String(req.user._id)) return res.status(403).json({ message: 'Not your listing' });
  await listing.deleteOne();
  res.json({ message: 'Deleted' });
});

exports.getListing = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) return res.status(404).json({ message: 'Listing not found' });
  const reviews = await Review.find({ listingId: id });
  const ratingAvg = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length) : 0;
  res.json({ ...listing.toObject(), ratingAvg, ratingCount: reviews.length });
});

exports.searchListings = asyncHandler(async (req, res) => {
  const { city, minPrice, maxPrice, gender, amenities, q } = req.query;
  const filter = {};
  if (city) filter.city = new RegExp(`^${city}$`, 'i');
  if (gender) filter.genderPolicy = gender;
  if (minPrice || maxPrice) filter.price = {};
  if (minPrice) filter.price.$gte = Number(minPrice);
  if (maxPrice) filter.price.$lte = Number(maxPrice);
  if (amenities) {
    const list = (Array.isArray(amenities) ? amenities.join(',') : amenities).split(',').map(s => s.trim()).filter(Boolean);
    if (list.length) filter.amenities = { $all: list };
  }
  if (q) {
    filter.$or = [
      { title: new RegExp(q, 'i') },
      { description: new RegExp(q, 'i') },
      { address: new RegExp(q, 'i') }
    ];
  }
  const items = await Listing.find(filter).sort({ createdAt: -1 }).limit(100);
  res.json(items);
});
