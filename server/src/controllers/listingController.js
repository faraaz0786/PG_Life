const Listing = require('../models/Listing');
const Review = require('../models/Review');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

/* ---------- helpers ---------- */
function toNum(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : undefined;
}

/* ---------- Create (OWNER) ---------- */
exports.createListing = asyncHandler(async (req, res) => {
  const payload = { ...req.body, ownerId: req.user._id };
  const listing = await Listing.create(payload);
  res.status(201).json(listing);
});

/* ---------- Update (OWNER of that listing) ---------- */
exports.updateListing = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) return res.status(404).json({ message: 'Listing not found' });
  if (String(listing.ownerId) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Not your listing' });
  }
  Object.assign(listing, req.body);
  await listing.save();
  res.json(listing);
});

/* ---------- Delete (OWNER of that listing) ---------- */
exports.deleteListing = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) return res.status(404).json({ message: 'Listing not found' });
  if (String(listing.ownerId) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Not your listing' });
  }
  await listing.deleteOne();
  res.json({ message: 'Deleted' });
});

/* ---------- Get single (PUBLIC) with rating summary ---------- */
exports.getListing = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) return res.status(404).json({ message: 'Listing not found' });

  const reviews = await Review.find({ listingId: id });
  const ratingAvg = reviews.length
    ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
    : 0;

  res.json({ ...listing.toObject(), ratingAvg, ratingCount: reviews.length });
});

/* ---------- Search / filter (PUBLIC) ---------- */
/* Supports: city, gender|genderPolicy, minPrice, maxPrice, amenities, q,
   roomType, page, limit, sort (default -createdAt)
   Returns { items, total, page, pages } */
exports.searchListings = asyncHandler(async (req, res) => {
  const {
    city,
    minPrice,
    maxPrice,
    gender,
    genderPolicy,
    amenities,
    q,
    roomType,
    page = 1,
    limit = 12,
    sort = '-createdAt',
  } = req.query;

  const query = {};

  // City (case-insensitive partial match)
  if (city && city.trim()) query.city = { $regex: new RegExp(city.trim(), 'i') };

  // Gender policy (allow both param names)
  const g = (gender || genderPolicy || '').toString().trim().toLowerCase();
  if (['male', 'female', 'any'].includes(g)) query.genderPolicy = g;

  // Price range
  const min = toNum(minPrice);
  const max = toNum(maxPrice);
  if (min !== undefined || max !== undefined) {
    query.price = {};
    if (min !== undefined) query.price.$gte = min;
    if (max !== undefined) query.price.$lte = max;
  }

  // Amenities: csv or array – require ALL selected amenities
  let amen = [];
  if (Array.isArray(amenities)) amen = amenities;
  else if (typeof amenities === 'string') {
    amen = amenities.split(',').map(s => s.trim()).filter(Boolean);
  }
  if (amen.length) query.amenities = { $all: amen };

  // ✅ Room type (only apply if the collection actually has this field)
  const rt = (roomType || '').toString().trim().toLowerCase();
  const allowedRT = ['single','twin','triple','quad','other'];
  if (allowedRT.includes(rt)) {
    const hasRoomType = await Listing.exists({ roomType: { $exists: true } });
    if (hasRoomType) query.roomType = rt;
  }

  // Text search
  if (q && q.trim()) {
    const rx = new RegExp(q.trim(), 'i');
    query.$or = [{ title: rx }, { description: rx }, { address: rx }];
  }

  // Pagination
  const pageNum  = Math.max(parseInt(page)  || 1, 1);
  const limitNum = Math.max(parseInt(limit) || 12, 1);

  const [items, total] = await Promise.all([
    Listing.find(query)
      .sort(sort)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Listing.countDocuments(query),
  ]);

  res.json({
    items,
    total,
    page: pageNum,
    pages: Math.max(Math.ceil(total / limitNum), 1),
  });
});

/* ---------- My listings (OWNER only) ---------- */
exports.getMyListings = asyncHandler(async (req, res) => {
  const items = await Listing.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
  res.json(items);
});

/* ---------- Seeder (DEV only with ALLOW_SEED=true) ---------- */
exports.seedListings = asyncHandler(async (req, res) => {
  if (process.env.ALLOW_SEED !== 'true') {
    return res.status(403).json({ message: 'Seeding disabled' });
  }

  // Create (or reuse) a demo owner
  let owner = await User.findOne({ email: 'demo-owner@pg-life.dev' });
  if (!owner) {
    owner = await User.create({
      name: 'Demo Owner',
      email: 'demo-owner@pg-life.dev',
      passwordHash: '$2a$10$z5pE4PpB3E.5vW6b3Tq7yO3V2BZZ2iTzQJ9S9wJXb4I7kY2uK6AUq', // "password"
      role: 'owner',
    });
  }

  // Wipe existing demo docs by this owner
  await Listing.deleteMany({ ownerId: owner._id });

  const cities = ['Lucknow','Delhi','Mumbai','Bengaluru','Hyderabad','Pune','Chennai','Kolkata','Ahmedabad'];
  const amenPool = ['wifi','ac','geyser','power backup','meals','laundry','parking','housekeeping','cctv','balcony','attached bathroom'];
  const rtPool   = ['single','twin','triple','quad'];

  const imgs = [
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505691723518-36a5ac3b2aa5?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600&auto=format&fit=crop'
  ];

  const items = Array.from({ length: 60 }).map((_, i) => {
    const city = cities[i % cities.length];
    const roomType = rtPool[i % rtPool.length];
    const priceBase = { single: 8000, twin: 6000, triple: 5000, quad: 4000 }[roomType];
    const price = priceBase + Math.round(Math.random() * 3000);

    const pick = (arr, k) => arr.sort(() => 0.5 - Math.random()).slice(0, k);
    const amenities = pick(amenPool, 3 + Math.floor(Math.random() * 5));
    const genderPolicy = ['male','female','any'][i % 3];

    return {
      ownerId: owner._id,
      title: `${city} ${roomType} room PG #${i + 1}`,
      description: 'Cozy PG with essential amenities near market & transit.',
      city,
      address: `${Math.floor(100 + Math.random() * 900)}, ${city} central`,
      genderPolicy,
      price,
      amenities,
      images: [imgs[i % imgs.length]],
      roomType,
    };
  });

  const { insertedCount } = await Listing.collection.insertMany(items);
  res.json({ inserted: insertedCount || items.length, owner: { email: owner.email } });
});
