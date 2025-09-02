const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { addFavorite, removeFavorite, getMyFavorites } = require('../controllers/favoriteController');

router.post('/:listingId', protect, addFavorite);
router.delete('/:listingId', protect, removeFavorite);
router.get('/me', protect, getMyFavorites);

module.exports = router;
