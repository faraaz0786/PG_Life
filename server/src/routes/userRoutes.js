const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getMe, updateMe } = require('../controllers/userController');

router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);

module.exports = router;
