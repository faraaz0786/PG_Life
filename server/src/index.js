const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');               // ✅ NEW (perf)
const mongoSanitize = require('express-mongo-sanitize');  // ✅ NEW (security)
const xss = require('xss-clean');                         // ✅ NEW (security)

const connectDB = require('./lib/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const listingRoutes = require('./routes/listingRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const recRoutes = require('./routes/recommendationRoutes');
const { notFound, errorHandler } = require('./middleware/error');

dotenv.config();

const app = express();

// Trust proxy (needed on Render/other proxies so rate-limit sees real IP)
app.set('trust proxy', 1);
app.disable('x-powered-by'); // ✅ small hardening

// Parsers & logging
app.use(express.json({ limit: '1mb' })); // ✅ avoid huge payloads
app.use(cookieParser());
app.use(morgan('dev'));

// CORS
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:5173',
  credentials: true
}));

// Security headers (CSP relaxed in dev; tighten in prod as needed)
const isProd = process.env.NODE_ENV === 'production';
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
      contentSecurityPolicy: isProd ? {
        useDefaults: true,
        directives: {
          "default-src": ["'self'"],
          "img-src": ["'self'", "data:", "blob:", "https:"],
          "connect-src": ["'self'", process.env.CORS_ORIGIN],
          "script-src": ["'self'"],
          "style-src": ["'self'", "'unsafe-inline'"],
          "font-src": ["'self'", "data:"],
          "frame-ancestors": ["'none'"],
          "object-src": ["'none'"]
        }
      } : false
    })
  );

// ✅ Sanitizers (before routes)
app.use(mongoSanitize());
app.use(xss());

// ✅ Compression (after security, before routes)
app.use(compression());

// Health (unlimited)
app.get('/', (req, res) => res.json({ status: 'ok', service: 'pg-life-api' }));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 300,                 // 300 requests / 15m / IP
  standardHeaders: true,
  legacyHeaders: false,
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // stricter for login/signup
  message: { message: 'Too many auth attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// DB
connectDB();

// ✅ Apply rate limits (auth stricter), then mount routes
app.use('/api/auth', authLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/recommendations', recRoutes);

// ✅ Errors LAST
app.use(notFound);
app.use(errorHandler);

// Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));

// (Optional) safer crash logs
process.on('unhandledRejection', (err) => {
  console.error('UnhandledRejection:', err);
});
process.on('uncaughtException', (err) => {
  console.error('UncaughtException:', err);
});
