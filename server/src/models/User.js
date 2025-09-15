const mongoose = require('mongoose');

const PreferencesSchema = new mongoose.Schema({
  minBudget: { type: Number, default: 0 },
  maxBudget: { type: Number, default: 100000 },
  city: { type: String, default: '' },
  amenities: [{ type: String }],
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  resetPasswordToken: { type: String, select: false },
  resetPasswordExpires: { type: Date, select: false },
  role: { type: String, enum: ['seeker', 'owner'], required: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
  preferences: { type: PreferencesSchema, default: () => ({}) },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
