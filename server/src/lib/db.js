const mongoose = require('mongoose');

module.exports = async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI missing in .env');
    process.exit(1);
  }
  try {
    await mongoose.connect(uri, { });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('MongoDB error:', err.message);
    process.exit(1);
  }
};
