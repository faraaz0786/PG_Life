const User = require('../models/User');
const Listing = require('../models/Listing');
const asyncHandler = require('../utils/asyncHandler');

exports.addFavorite = asyncHandler(async (req, res) => {
  const { listingId } = req.params;
  const listing = await Listing.findById(listingId);
  if (!listing) return res.status(404).json({ message: 'Listing not found' });
  const user = await User.findById(req.user._id);
  if (!user.favorites.some(id => String(id) === String(listingId))) {
    user.favorites.push(listingId);
    await user.save();
  }
  res.json({ favorites: user.favorites });
});

exports.removeFavorite = asyncHandler(async (req, res) => {
  const { listingId } = req.params;
  const user = await User.findById(req.user._id);
  user.favorites = user.favorites.filter(id => String(id) !== String(listingId));
  await user.save();
  res.json({ favorites: user.favorites });
});

exports.getMyFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('favorites');
  res.json(user.favorites || []);
});
