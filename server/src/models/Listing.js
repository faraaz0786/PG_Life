const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  city: { type: String, index: true, required: true },
  address: { type: String, default: '' },
  genderPolicy: { type: String, enum: ['male', 'female', 'any'], default: 'any', index: true },
  price: { type: Number, index: true, required: true },
  amenities: [{ type: String, index: true }],
  images: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

ListingSchema.virtual('ratingAvg', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'listingId',
  justOne: false,
  options: { select: 'rating' },
  get: function(v) { return v; }
});

module.exports = mongoose.model('Listing', ListingSchema);
