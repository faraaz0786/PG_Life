const router = require('express').Router();
const { protect, ownerOnly } = require('../middleware/auth');
const {
  createListing,
  updateListing,
  deleteListing,
  getListing,
  searchListings,
  getMyListings,
  seedListings, // ✅ import the controller seeder (internally checks ALLOW_SEED)
} = require('../controllers/listingController');

/**
 * ORDER MATTERS:
 * Keep '/mine' and '/__seed' BEFORE '/:id' so they're not treated as an ID.
 */

// PUBLIC: list/search
router.get('/', searchListings);

// Dev-only seeding (the controller returns 403 unless ALLOW_SEED=true)
router.post('/__seed', seedListings);

// OWNER: my listings
router.get('/mine', protect, ownerOnly, getMyListings);

// PUBLIC: single listing by id
router.get('/:id', getListing);

// OWNER: create / update / delete
router.post('/', protect, ownerOnly, createListing);
router.put('/:id', protect, ownerOnly, updateListing);
router.delete('/:id', protect, ownerOnly, deleteListing);

module.exports = router;
