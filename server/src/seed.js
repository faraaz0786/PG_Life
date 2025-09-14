// server/src/seed.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('./lib/db');

const User = require('./models/User');
const Listing = require('./models/Listing');
const Review = require('./models/Review');

function rand(n) { return Math.floor(Math.random() * n); }
function pick(arr) { return arr[rand(arr.length)]; }
function pickMany(arr, k) {
  const copy = [...arr];
  const out = [];
  while (copy.length && out.length < k) out.push(copy.splice(rand(copy.length), 1)[0]);
  return out;
}
function randBetween(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function daysAgo(n) { const d = new Date(); d.setDate(d.getDate() - n); return d; }

async function ensureUser({ name, email, role, password = 'password123', preferences }) {
  let u = await User.findOne({ email });
  if (u) return u;
  const passwordHash = await bcrypt.hash(password, 10);
  u = await User.create({ name, email, role, passwordHash, preferences });
  return u;
}

async function run() {
  await connectDB();

  console.log('🔄 Clearing listings & reviews…');
  await Listing.deleteMany({});
  await Review.deleteMany({});

  // Keep existing users if any, but ensure demo ones exist
  console.log('👥 Ensuring demo users…');
  // Owners
  const owners = await Promise.all(
    Array.from({ length: 5 }).map((_, i) =>
      ensureUser({
        name: `Owner ${i + 1}`,
        email: `owner${i + 1}@example.com`,
        role: 'owner',
        password: 'owner123',
      })
    )
  );
  // Seekers
  const seekerPrefs = [
    { minBudget: 3000, maxBudget: 9000, city: 'Lucknow', amenities: ['wifi', 'laundry'] },
    { minBudget: 5000, maxBudget: 15000, city: 'Delhi', amenities: ['ac', 'wifi', 'food'] },
    { minBudget: 6000, maxBudget: 12000, city: 'Bengaluru', amenities: ['wifi', 'geyser', 'cctv'] },
    { minBudget: 4500, maxBudget: 10000, city: 'Pune', amenities: ['wifi', 'laundry', 'kitchen'] },
    { minBudget: 4000, maxBudget: 8000, city: 'Hyderabad', amenities: ['wifi', 'food'] },
    { minBudget: 5500, maxBudget: 13000, city: 'Mumbai', amenities: ['ac', 'wifi'] },
    { minBudget: 3500, maxBudget: 10000, city: 'Jaipur', amenities: ['wifi', 'power_backup'] },
    { minBudget: 4000, maxBudget: 9000, city: 'Kolkata', amenities: ['wifi', 'laundry'] },
    { minBudget: 4500, maxBudget: 11000, city: 'Chennai', amenities: ['ac', 'wifi', 'geyser'] },
    { minBudget: 5000, maxBudget: 12000, city: 'Ahmedabad', amenities: ['wifi', 'cctv'] },
  ];
  const seekers = await Promise.all(
    Array.from({ length: 10 }).map((_, i) =>
      ensureUser({
        name: `Seeker ${i + 1}`,
        email: `seeker${i + 1}@example.com`,
        role: 'seeker',
        password: 'seeker123',
        preferences: seekerPrefs[i % seekerPrefs.length],
      })
    )
  );

  // City pool (mix tier-1 & tier-2)
  const cities = [
    'Lucknow', 'Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata',
    'Ahmedabad', 'Jaipur', 'Indore', 'Chandigarh', 'Kochi', 'Noida', 'Gurgaon'
  ];
  const areas = [
    'Central', 'North', 'South', 'East', 'West', 'Near Station', 'University Area',
    'Old City', 'Tech Park', 'Market Road', 'Lake View', 'Airport Road'
  ];

  const amenityPool = [
    'wifi','ac','food','laundry','parking','cctv','power_backup','housekeeping',
    'geyser','attached_bathroom','balcony','refrigerator','study_table','cupboard',
    'kitchen_access','gym','ro_water','security_guard'
  ];

  const genders = ['male','female','any'];

  // Price bands by city (rough)
  const cityPriceHint = {
    Mumbai: [7000, 20000],
    Delhi: [6000, 16000],
    Bengaluru: [6000, 15000],
    Hyderabad: [5000, 13000],
    Pune: [5000, 13000],
    Chennai: [5000, 13000],
    Kolkata: [4500, 12000],
    Ahmedabad: [4500, 11000],
    Lucknow: [3500, 10000],
    Jaipur: [4000, 10000],
    Indore: [3500, 9000],
    Chandigarh: [5000, 12000],
    Kochi: [4500, 10000],
    Noida: [5000, 12000],
    Gurgaon: [6000, 15000],
  };

  const totalListings = 200;
  const docs = [];

  console.log(`🏠 Creating ${totalListings} listings…`);
  for (let i = 0; i < totalListings; i++) {
    const city = pick(cities);
    const [minP, maxP] = cityPriceHint[city] || [4000, 12000];
    const price = randBetween(minP, maxP);

    const title = `${pick(['Cozy','Spacious','Modern','Budget','Premium','Peaceful'])} PG in ${pick(areas)}, ${city}`;
    const description = `${title}. Well-connected location with essential amenities. Ideal for students and working professionals.`;

    const images = [
      `https://picsum.photos/seed/pg${i}-1/800/500`,
      `https://picsum.photos/seed/pg${i}-2/800/500`,
      `https://picsum.photos/seed/pg${i}-3/800/500`,
    ];

    const amenities = pickMany(amenityPool, randBetween(5, 9));
    const genderPolicy = pick(genders);

    const owner = pick(owners);
    const createdAt = daysAgo(randBetween(0, 180));

    docs.push({
      ownerId: owner._id,
      title,
      description,
      city,
      address: `No. ${randBetween(1, 300)}, ${pick(areas)} Road, ${city}`,
      genderPolicy,
      price,
      amenities,
      images,
      createdAt,
    });
  }

  const created = await Listing.insertMany(docs);
  console.log(`✅ Inserted ${created.length} listings`);

  // Seed some reviews so ratings show up
  console.log('⭐ Seeding reviews (random 0–4 per listing)…');
  const reviewTexts = [
    'Great place and friendly owner.',
    'Clean rooms and good food.',
    'Decent stay for the price.',
    'Location is excellent, near everything.',
    'Could be cleaner, but overall okay.',
    'Comfortable and safe environment.',
  ];

  const reviewDocs = [];
  for (const listing of created) {
    const reviewCount = randBetween(0, 4);
    for (let r = 0; r < reviewCount; r++) {
      const seeker = pick(seekers);
      reviewDocs.push({
        listingId: listing._id,
        seekerId: seeker._id,
        rating: randBetween(3, 5), // keep ratings mostly positive
        comment: pick(reviewTexts),
        createdAt: daysAgo(randBetween(0, 120)),
      });
    }
  }
  if (reviewDocs.length) {
    await Review.insertMany(reviewDocs);
    console.log(`✅ Inserted ${reviewDocs.length} reviews`);
  } else {
    console.log('⚠️ No reviews generated (random outcome).');
  }

  console.log('🎉 Seeding complete.\nDemo logins:');
  console.log('  Owner:  owner1@example.com / owner123');
  console.log('  Seeker: seeker1@example.com / seeker123');

  process.exit(0);
}

run().catch((e) => {
  console.error('❌ Seed failed:', e);
  process.exit(1);
});
