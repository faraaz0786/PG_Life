// server/src/models/User.js
const mongoose = require('mongoose');

/* ---------------- Preferences (unchanged) ---------------- */
const PreferencesSchema = new mongoose.Schema(
  {
    minBudget: { type: Number, default: 0 },
    maxBudget: { type: Number, default: 100000 },
    city: { type: String, default: '' },
    amenities: [{ type: String }],
  },
  { _id: false }
);

/* ---------------- User ---------------- */
const UserSchema = new mongoose.Schema(
  {
    // Basic identity
    name: { type: String, required: true, trim: true, default: 'User' },

    // Email is OPTIONAL now (phone-only users possible). Keep unique + sparse.
    email: {
      type: String,
      unique: true,
      sparse: true, // allows multiple docs with null/undefined email
      lowercase: true,
      trim: true,
      index: true,
    },

    // Optional phone for phone/OTP users (unique + sparse).
    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      index: true,
    },

    // Local auth password hash (optional so social/phone works).
    // Keep the same field name to match your existing local auth code.
    passwordHash: { type: String, select: false },

    // Password reset (unchanged)
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },

    // Role
    role: { type: String, enum: ['seeker', 'owner'], default: 'seeker', index: true },

    // Social / Phone auth metadata
    authProvider: { type: String, enum: ['local', 'google', 'phone'], default: 'local', index: true },
    firebaseUid: { type: String, index: true },

    // Relations
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],

    // Preferences
    preferences: { type: PreferencesSchema, default: () => ({}) },
  },
  { timestamps: true }
);

/* ---------------- Output hygiene: hide sensitive fields ---------------- */
if (!UserSchema.options.toJSON) UserSchema.options.toJSON = {};
UserSchema.options.toJSON.transform = function (doc, ret) {
  delete ret.passwordHash;
  delete ret.resetPasswordToken;
  delete ret.resetPasswordExpires;
  return ret;
};

/* ---------------- Helpful indexes ---------------- */
// (unique + sparse already set on email/phone above)
// Extra index on createdAt for dashboards/lists if needed
UserSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', UserSchema);
