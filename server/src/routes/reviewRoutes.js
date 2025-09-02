const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { addReview, getReviews } = require('../controllers/reviewController');

router.post('/', protect, addReview);
router.get('/:listingId', getReviews);

module.exports = router;
