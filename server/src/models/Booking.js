const mongoose = require('mongoose')

const BookingSchema = new mongoose.Schema({
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  seekerId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status:    { type: String, enum: ['requested', 'accepted', 'declined'], default: 'requested' },
  message:   { type: String },
  visitDate: { type: Date },
}, { timestamps: true })

module.exports = mongoose.model('Booking', BookingSchema)
