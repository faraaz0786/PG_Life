// server/src/controllers/authController.js
const crypto = require('crypto');                      // for reset token
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { sendMail } = require('../utils/mailer');       // email helper (configure in utils/mailer.js)

/* ---------------- helpers ---------------- */
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // Render prod = true
  sameSite: 'none',                               // REQUIRED for Vercel (FE) <-> Render (API)
  path: '/',
  maxAge: (() => {
    // match JWT_EXPIRES_IN if it's a "Xd" string; fallback to 7d
    const exp = String(process.env.JWT_EXPIRES_IN || '7d');
    const m = exp.match(/^(\d+)d$/i);
    return m ? Number(m[1]) * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
  })(),
};

const normEmail = (email) => String(email || '').trim().toLowerCase();

/* ---------------- SIGNUP ---------------- */
exports.signup = asyncHandler(async (req, res) => {
  const { name, email, password, role, preferences } = req.body || {};
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  if (!['seeker', 'owner'].includes(String(role))) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  const emailNorm = normEmail(email);
  const exists = await User.findOne({ email: emailNorm });
  if (exists) return res.status(400).json({ message: 'Email already in use' });

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await User.create({
    name: String(name).trim(),
    email: emailNorm,
    passwordHash,
    role,
    preferences,
  });

  const token = signToken(user._id);
  res.cookie('token', token, cookieOpts); // set cross-site auth cookie

  return res.status(201).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      preferences: user.preferences,
    },
  });
});

/* ---------------- LOGIN ---------------- */
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  const emailNorm = normEmail(email);

  const user = await User.findOne({ email: emailNorm });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const match = await bcrypt.compare(String(password || ''), user.passwordHash);
  if (!match) return res.status(400).json({ message: 'Invalid credentials' });

  const token = signToken(user._id);
  res.cookie('token', token, cookieOpts);

  return res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      preferences: user.preferences,
      favorites: user.favorites,
    },
  });
});

/* ---------------- LOGOUT ---------------- */
exports.logout = asyncHandler(async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    path: '/',
  });
  return res.json({ message: 'Logged out' });
});

/* ---------------- ME ---------------- */
exports.me = asyncHandler(async (req, res) => {
  return res.json(req.user);
});

/* ------------- FORGOT PASSWORD ------------- */
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const emailNorm = normEmail(email);
  const user = await User.findOne({ email: emailNorm });

  // Always pretend success if user not found (avoid email enumeration)
  if (!user) {
    return res.json({ message: 'If that email exists, a reset link has been sent.' });
  }

  // Create one-time token and store its hash + expiry
  const token = crypto.randomBytes(32).toString('hex'); // RAW token (not JWT)
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  user.resetPasswordToken = tokenHash;
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1h
  await user.save();

  // Compose reset link for email
  const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
  const resetLink = `${clientUrl}/reset/${token}`;

  // Send email if SMTP configured
  try {
    await sendMail({
      to: user.email,
      subject: 'PG-Life — Reset your password',
      html: `
        <div style="font-family:system-ui,Segoe UI,Roboto,Arial">
          <h2>Reset your PG-Life password</h2>
          <p>Click the button below to reset your password. This link expires in 1 hour.</p>
          <p><a href="${resetLink}" style="display:inline-block;padding:10px 16px;background:#4f46e5;color:#fff;border-radius:8px;text-decoration:none">Reset Password</a></p>
          <p>Or copy this link:<br><a href="${resetLink}">${resetLink}</a></p>
          <p style="color:#64748b">If you didn’t request this, ignore this email.</p>
        </div>
      `,
      text: `Reset link: ${resetLink}`,
    });
  } catch (e) {
    console.warn('sendMail failed (dev ok):', e.message);
  }

  // DEV ONLY: explicitly surface token if toggled ON
  // You can use either env:
  // - DEBUG_RESET_TOKEN=1
  // - DEV_RESET_TOKEN_RESPONSE=true
  const debug =
    process.env.DEBUG_RESET_TOKEN === '1' ||
    process.env.DEV_RESET_TOKEN_RESPONSE === 'true' ||
    process.env.NODE_ENV !== 'production';

  if (debug) {
    console.log('🔑 DEV reset token (raw):', token);
    return res.json({
      message: 'Reset link created (DEV). Use token with /api/auth/reset-password within 1 hour.',
      token,
      expiresAt: user.resetPasswordExpires,
    });
  }

  // Production default
  return res.json({ message: 'If that email exists, a reset link has been sent.' });
});

/* -------------- RESET PASSWORD -------------- */
exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body || {};
  if (!token || !password) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }

  // Hash the incoming raw token and match what we stored
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: tokenHash,
    resetPasswordExpires: { $gt: new Date() },
  }).select('+resetPasswordToken +resetPasswordExpires');

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired reset token' });
  }

  user.passwordHash = await bcrypt.hash(String(password), 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return res.json({ message: 'Password has been reset. You can now log in.' });
});
