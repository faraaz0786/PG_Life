// server/src/index.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

dotenv.config();

const connectDB = require('./lib/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const listingRoutes = require('./routes/listingRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const recRoutes = require('./routes/recommendationRoutes');
const { notFound, errorHandler } = require('./middleware/error');

// ✅ Add Firebase Auth route (converted to CommonJS)
const authFirebaseRoutes = require('./routes/authFirebase');

const app = express();

/* ---------- Core hardening ---------- */
app.set('trust proxy', 1); // required behind Render/other proxies
app.disable('x-powered-by');

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

/* ---------- CORS ---------- */
const allowed = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

if (!allowed.includes('http://localhost:5173')) {
  allowed.push('http://localhost:5173');
}

console.log('CORS allowlist:', allowed);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      return allowed.includes(origin)
        ? cb(null, true)
        : cb(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Set-Cookie'],
  })
);

app.options('*', cors());

/* ---------- Helmet ---------- */
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false,
  })
);

/* ---------- Sanitizers & compression ---------- */
app.use(mongoSanitize());
app.use(xss());
app.use(compression());

/* ---------- Health check ---------- */
app.get('/api/health', (req, res) => res.json({ ok: true }));

/* ---------- Rate limiting ---------- */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many auth attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply general limiter to /api/* except /api/auth/*
app.use('/api', (req, res, next) => {
  if (req.path.startsWith('/auth')) return next();
  return apiLimiter(req, res, next);
});
app.use('/api/auth', authLimiter);

/* ---------- Routes ---------- */
app.use('/api/auth', authRoutes);
app.use('/api/auth/firebase', authFirebaseRoutes); // ✅ Add here
app.use('/api/users', userRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/recommendations', recRoutes);

/* ---------- Errors ---------- */
app.use(notFound);
app.use(errorHandler);

/* ---------- Boot ---------- */
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () =>
      console.log(`✅ API running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
})();

/* ---------- Crash logs ---------- */
process.on('unhandledRejection', (err) => {
  console.error('UnhandledRejection:', err);
});
process.on('uncaughtException', (err) => {
  console.error('UncaughtException:', err);
});
