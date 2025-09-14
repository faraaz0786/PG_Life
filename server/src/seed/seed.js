/* eslint-disable no-console */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Listing = require('../models/Listing');
const Review = require('../models/Review');

const MONGO_URI = process.env.MONGO_URI;
const SALT_ROUNDS = 10;

// ----- Data pools -----
const cities = [
  { name: 'Delhi', areas: ['GTB Nagar', 'Laxmi Nagar', 'Hauz Khas', 'Dwarka'] },
  { name: 'Mumbai', areas: ['Andheri', 'Bandra West', 'Powai', 'Goregaon'] },
  { name: 'Bengaluru', areas: ['Koramangala', 'HSR Layout', 'Indiranagar', 'Whitefield'] },
  { name: 'Hyderabad', areas: ['Madhapur', 'Gachibowli', 'Hitech City', 'Kondapur'] },
  { name: 'Pune', areas: ['Aundh', 'Kothrud', 'Hinjawadi', 'Viman Nagar'] },
  { name: 'Chennai', areas: ['Velachery', 'Guindy', 'T Nagar', 'Adyar'] },
  { name: 'Kolkata', areas: ['Salt Lake', 'New Town', 'Garia', 'Behala'] },
  { name: 'Ahmedabad', areas: ['Prahlad Nagar', 'Bodakdev', 'SG Highway', 'Vastrapur'] },
  { name: 'Jaipur', areas: ['Vaishali Nagar', 'Malviya Nagar', 'C-Scheme', 'Mansarovar'] },
  { name: 'Lucknow', areas: ['Gomti Nagar', 'Alambagh', 'Charbagh', 'Hazratganj'] },
  { name: 'Noida', areas: ['Sector 62', 'Sector 18', 'Sector 76', 'Sector 137'] },
  { name: 'Gurgaon', areas: ['Cyber City', 'Golf Course Rd', 'Sohna Rd', 'Udyog Vihar'] },
  { name: 'Indore', areas: ['Vijay Nagar', 'Bhawarkua', 'Bhawrasla', 'Palasia'] },
  { name: 'Chandigarh', areas: ['Sector 17', 'Sector 22', 'Sector 35', 'Manimajra'] },
  { name: 'Kochi', areas: ['Kakkanad', 'Edapally', 'Vyttila', 'Kaloor'] },
];

const amenitiesPool = [
  'wifi','ac','laundry','housekeeping','power_backup','cctv','ro_water','parking',
  'kitchen_access','attached_bathroom','balcony','geyser','refrigerator','tv','gym','mess'
];
const genders = ['male','female','any'];
const sampleImages = [
  'https://images.unsplash.com/photo-1505691723518-36a5ac3b2d52?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1484100356142-db6ab6244067?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1469734865453-59b23f9d017b?q=80&w=1200&auto=format&fit=crop'
];

// ----- Helpers -----
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[rand(0, arr.length - 1)];
const pickMany = (arr, n) => {
  const copy = [...arr];
  const out = [];
  for (let i = 0; i < n && copy.length; i++) {
    const idx = rand(0, copy.length - 1);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
};

async function connect() {
  if (!MONGO_URI) throw new Error('Missing MONGO_URI');
  await mongoose.connect(MONGO_URI, { dbName: undefined });
}

async function seed() {
  const reset = process.argv.includes('--reset');

  console.log('→ Connecting to MongoDB…');
  await connect();

  if (reset) {
    console.log('→ Dropping database…');
    await mongoose.connection.dropDatabase();
  }

  console.log('→ Creating demo users…');
  const passwordHash = await bcrypt.hash('123456', SALT_ROUNDS);

  // Upsert 2 seekers + 2 owners
  const [seeker1, seeker2, owner1, owner2] = await Promise.all([
    User.findOneAndUpdate(
      { email: 'seeker1@example.com' },
      { name: 'Seeker One', role: 'seeker', passwordHash, preferences: { minBudget: 6000, maxBudget: 12000, city: 'Delhi', amenities: ['wifi','ro_water'] } },
      { new: true, upsert: true }
    ),
    User.findOneAndUpdate(
      { email: 'seeker2@example.com' },
      { name: 'Seeker Two', role: 'seeker', passwordHash, preferences: { minBudget: 8000, maxBudget: 15000, city: 'Bengaluru', amenities: ['wifi','ac'] } },
      { new: true, upsert: true }
    ),
    User.findOneAndUpdate(
      { email: 'owner1@example.com' },
      { name: 'Owner One', role: 'owner', passwordHash },
      { new: true, upsert: true }
    ),
    User.findOneAndUpdate(
      { email: 'owner2@example.com' },
      { name: 'Owner Two', role: 'owner', passwordHash },
      { new: true, upsert: true }
    ),
  ]);

  const ownerIds = [owner1._id, owner2._id];

  console.log('→ Generating listings…');
  const listingDocs = [];
  const TOTAL = Number(process.argv.find(a => a.startsWith('--count='))?.split('=')[1]) || 120;

  for (let i = 0; i < TOTAL; i++) {
    const c = pick(cities);
    const area = pick(c.areas);
    const price = rand(6000, 20000);
    const genderPolicy = pick(genders);
    const title = `${pick(['Cozy','Premium','Budget','Modern','Spacious'])} PG in ${area}`;
    const desc = `Furnished rooms in ${area}, ${c.name}. Amenities include ${pickMany(amenitiesPool, 3).join(', ')}. Great connectivity.`;
    const amenities = pickMany(amenitiesPool, rand(4, 8));
    const images = [pick(sampleImages)];
    const ownerId = pick(ownerIds);
    const createdAt = new Date(Date.now() - rand(0, 60) * 24 * 3600 * 1000); // last 60 days

    listingDocs.push({
      ownerId, title, description: desc,
      city: c.name, address: area,
      genderPolicy, price, amenities, images, createdAt
    });
  }

  await Listing.insertMany(listingDocs);

  console.log('→ Adding a few reviews…');
  const someListings = await Listing.find().limit(20);
  const reviewBodies = ['Nice & clean place', 'Great location', 'Helpful owner', 'Value for money', 'Good for students'];
  const reviews = someListings.map(l => ({
    listingId: l._id,
    seekerId: Math.random() > 0.5 ? seeker1._id : seeker2._id,
    rating: rand(3, 5),
    comment: pick(reviewBodies),
    createdAt: new Date()
  }));
  if (reviews.length) await Review.insertMany(reviews);

  console.log('✅ Seed complete!');
  console.table([
    { role: 'seeker', email: 'seeker1@example.com', password: '123456' },
    { role: 'seeker', email: 'seeker2@example.com', password: '123456' },
    { role: 'owner',  email: 'owner1@example.com',  password: '123456' },
    { role: 'owner',  email: 'owner2@example.com',  password: '123456' },
  ]);

  await mongoose.disconnect();
}

// optional: just drop DB and exit
async function resetOnly() {
  await connect();
  await mongoose.connection.dropDatabase();
  console.log('🗑️  Database dropped.');
  await mongoose.disconnect();
}

if (process.argv.includes('--drop-only')) {
  resetOnly().catch(e => { console.error(e); process.exit(1); });
} else {
  seed().catch(e => { console.error(e); process.exit(1); });
}
