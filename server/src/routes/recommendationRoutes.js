const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getForMe } = require('../controllers/recommendationController');

router.get('/me', protect, getForMe);

module.exports = router;
