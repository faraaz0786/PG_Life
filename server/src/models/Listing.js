const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    city: { type: String, required: true, index: true },
    address: { type: String, default: '' },
    genderPolicy: { type: String, enum: ['male', 'female', 'any'], default: 'any', index: true },
    price: { type: Number, required: true, index: true },
    amenities: [{ type: String }],
    images: [{ type: String }],

    // ✅ NEW
    roomType: {
      type: String,
      enum: ['single', 'twin', 'triple', 'quad', 'other'],
      default: 'single',
      index: true,
    },
  },
  { timestamps: true }
);

// Helpful compound index for common search
ListingSchema.index({ city: 1, roomType: 1, genderPolicy: 1, price: 1, createdAt: -1 });
ListingSchema.index(
  { title: "text", description: "text", address: "text" },
  { weights: { title: 5 }, name: "ListingTextIndex" }
);

module.exports = mongoose.model('Listing', ListingSchema);
