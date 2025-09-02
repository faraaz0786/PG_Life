const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.signup = asyncHandler(async (req, res) => {
  const { name, email, password, role, preferences } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already in use' });
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  const user = await User.create({ name, email, passwordHash, role, preferences });
  const token = signToken(user._id);
  res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, preferences: user.preferences } });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(400).json({ message: 'Invalid credentials' });
  const token = signToken(user._id);
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, preferences: user.preferences, favorites: user.favorites } });
});

exports.me = asyncHandler(async (req, res) => {
  res.json(req.user);
});
