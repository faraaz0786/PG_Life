const Listing = require('../models/Listing');
const Review = require('../models/Review');
const { scoreListing } = require('../utils/recommendation');
const asyncHandler = require('../utils/asyncHandler');

exports.getForMe = asyncHandler(async (req, res) => {
  const prefs = req.user?.preferences || {};
  const listings = await Listing.find({});
  // Precompute ratings
  const reviewDocs = await Review.aggregate([
    { $group: { _id: '$listingId', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  const ratingMap = new Map(reviewDocs.map(d => [String(d._id), { avgRating: d.avgRating, count: d.count }]));
  const scored = listings.map(l => {
    const stats = ratingMap.get(String(l._id)) || { avgRating: 0, count: 0 };
    return { listing: l, score: scoreListing(l, prefs, stats), stats };
  });
  scored.sort((a,b)=> b.score - a.score);
  res.json(scored.slice(0, 20).map(x => ({ ...x.listing.toObject(), _score: x.score, ratingAvg: x.stats.avgRating, ratingCount: x.stats.count })));
});
