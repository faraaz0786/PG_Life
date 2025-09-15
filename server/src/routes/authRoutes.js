// server/src/routes/authRoutes.js
const router = require('express').Router();
const { protect } = require('../middleware/auth');
const auth = require('../controllers/authController');

// Auth
router.post('/signup', auth.signup);
router.post('/login', auth.login);
router.post('/logout', auth.logout);        // ✅ new

// Me
router.get('/me', protect, auth.me);

// Password reset (short paths)
router.post('/forgot', auth.forgotPassword); // ✅ added
router.post('/reset', auth.resetPassword);   // ✅ added

// Back-compat aliases (your previous paths)
router.post('/forgot-password', auth.forgotPassword);
router.post('/reset-password', auth.resetPassword);

module.exports = router;
