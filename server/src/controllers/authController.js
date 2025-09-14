const crypto = require('crypto');                      // ✅ for reset token
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { sendMail } = require('../utils/mailer');       // ✅ email helper

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

/* -------------------- SIGNUP -------------------- */
exports.signup = asyncHandler(async (req, res) => {
  const { name, email, password, role, preferences } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const emailNorm = String(email).trim().toLowerCase();
  const exists = await User.findOne({ email: emailNorm });
  if (exists) return res.status(400).json({ message: 'Email already in use' });

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email: emailNorm,
    passwordHash,
    role,
    preferences,
  });

  const token = signToken(user._id);
  res.status(201).json({
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

/* -------------------- LOGIN -------------------- */
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const emailNorm = String(email || '').trim().toLowerCase();

  const user = await User.findOne({ email: emailNorm });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(400).json({ message: 'Invalid credentials' });

  const token = signToken(user._id);
  res.json({
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

/* -------------------- ME -------------------- */
exports.me = asyncHandler(async (req, res) => {
  res.json(req.user);
});

/* -------------------- FORGOT PASSWORD -------------------- */
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const emailNorm = String(email).trim().toLowerCase();
  const user = await User.findOne({ email: emailNorm });

  // Always respond 200 to avoid user enumeration
  if (user) {
    // generate random token and store hashed version
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    user.resetPasswordToken = tokenHash;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1h
    await user.save();

    const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
    const resetLink = `${clientUrl}/reset/${token}`;

    const html = `
      <div style="font-family:system-ui,Segoe UI,Roboto,Arial">
        <h2>Reset your PG-Life password</h2>
        <p>We received a request to reset your password. Click the button below:</p>
        <p><a href="${resetLink}" style="display:inline-block;padding:10px 16px;background:#4f46e5;color:#fff;border-radius:8px;text-decoration:none">Reset Password</a></p>
        <p>Or copy this link:<br><a href="${resetLink}">${resetLink}</a></p>
        <p style="color:#64748b">If you didn’t request this, you can ignore this email.</p>
      </div>
    `;
    await sendMail({
      to: user.email,
      subject: 'PG-Life — Reset your password',
      html,
      text: `Reset link: ${resetLink}`,
    });
  }

  return res.json({ message: 'If that email exists, a reset link has been sent.' });
});

/* -------------------- RESET PASSWORD -------------------- */
exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body || {};
  if (!token || !password) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: tokenHash,
    resetPasswordExpires: { $gt: new Date() },
  }).select('+resetPasswordToken +resetPasswordExpires');

  if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' });

  const hash = await bcrypt.hash(password, 10);
  user.passwordHash = hash;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return res.json({ message: 'Password has been reset. You can now log in.' });
});
