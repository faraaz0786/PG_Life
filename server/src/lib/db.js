// server/src/lib/db.js
const mongoose = require('mongoose');

module.exports = async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI missing in .env');
    process.exit(1);
  }

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri, {
      // keep options minimal; the driver now auto-handles most settings
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err?.message || err);
    // Common hints:
    // - Check IP allowlist in Atlas
    // - Check DB user & password (URL-encode password!)
    // - Ensure the SRV host matches your cluster
    process.exit(1);
  }
};
