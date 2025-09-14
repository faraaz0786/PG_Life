const jwt = require('jsonwebtoken')
const asyncHandler = require('../utils/asyncHandler')
const User = require('../models/User')

const protect = asyncHandler(async (req, res, next) => {
  const auth = req.headers.authorization || ''
  const [, token] = auth.split(' ')
  if (!token) return res.status(401).json({ message: 'Not authorized' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select('-passwordHash')
    if (!user) return res.status(401).json({ message: 'User not found' })
    req.user = user
    next()
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' })
  }
})

const ownerOnly = (req, res, next) => {
  if (req.user?.role !== 'owner') {
    return res.status(403).json({ message: 'Owner only' })
  }
  next()
}

const seekerOnly = (req, res, next) => {
  if (req.user?.role !== 'seeker') {
    return res.status(403).json({ message: 'Seeker only' })
  }
  next()
}

module.exports = { protect, ownerOnly, seekerOnly }
