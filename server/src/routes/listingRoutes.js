const router = require('express').Router();
const { protect, ownerOnly } = require('../middleware/auth');
const { createListing, updateListing, deleteListing, getListing, searchListings } = require('../controllers/listingController');

router.post('/', protect, ownerOnly, createListing);
router.get('/', searchListings);
router.get('/:id', getListing);
router.put('/:id', protect, ownerOnly, updateListing);
router.delete('/:id', protect, ownerOnly, deleteListing);

module.exports = router;
