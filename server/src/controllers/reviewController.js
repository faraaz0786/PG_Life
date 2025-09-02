const Review = require('../models/Review');
const asyncHandler = require('../utils/asyncHandler');

exports.addReview = asyncHandler(async (req, res) => {
  const { listingId, rating, comment } = req.body;
  if (!listingId || !rating) return res.status(400).json({ message: 'listingId and rating required' });
  const review = await Review.create({ listingId, rating, comment: comment || '', seekerId: req.user._id });
  res.status(201).json(review);
});

exports.getReviews = asyncHandler(async (req, res) => {
  const { listingId } = req.params;
  const reviews = await Review.find({ listingId }).populate('seekerId', 'name');
  res.json(reviews);
});
