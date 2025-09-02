const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');

exports.getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});

exports.updateMe = asyncHandler(async (req, res) => {
  const { name, preferences } = req.body;
  const toUpdate = {};
  if (name) toUpdate.name = name;
  if (preferences) toUpdate.preferences = preferences;
  const updated = await User.findByIdAndUpdate(req.user._id, toUpdate, { new: true });
  res.json(updated);
});
