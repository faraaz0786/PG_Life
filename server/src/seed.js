const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Listing = require('./models/Listing');
const Review = require('./models/Review');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Seeding database...');

    await Promise.all([User.deleteMany({}), Listing.deleteMany({}), Review.deleteMany({})]);

    const salt = await bcrypt.genSalt(10);
    const ownerPwd = await bcrypt.hash('owner123', salt);
    const seekerPwd = await bcrypt.hash('seeker123', salt);

    const owners = await User.insertMany([
      { name: 'Owner One', email: 'owner1@example.com', passwordHash: ownerPwd, role: 'owner' },
      { name: 'Owner Two', email: 'owner2@example.com', passwordHash: ownerPwd, role: 'owner' }
    ]);

    const seekers = await User.insertMany([
      { name: 'Seeker One', email: 'seeker1@example.com', passwordHash: seekerPwd, role: 'seeker',
        preferences: { minBudget: 3000, maxBudget: 9000, city: 'Lucknow', amenities: ['wifi','laundry']} },
      { name: 'Seeker Two', email: 'seeker2@example.com', passwordHash: seekerPwd, role: 'seeker',
        preferences: { minBudget: 6000, maxBudget: 15000, city: 'Delhi', amenities: ['ac','food','wifi']} },
    ]);

    const cities = ['Lucknow','Delhi','Mumbai','Bengaluru','Hyderabad','Pune','Kolkata','Jaipur'];
    const amenitiesList = ['wifi','laundry','food','ac','parking','hotwater','cctv','fridge','tv','housekeeping'];
    const genders = ['male','female','any'];

    function rand(n){ return Math.floor(Math.random()*n); }
    const listings = [];

    for (let i=0;i<50;i++) {
      const city = cities[rand(cities.length)];
      const price = 3000 + rand(15000);
      const ams = [...new Set(Array.from({length: 3+rand(4)}, ()=> amenitiesList[rand(amenitiesList.length)]))];
      const genderPolicy = genders[rand(genders.length)];
      listings.push({
        ownerId: owners[rand(owners.length)]._id,
        title: `${city} Cozy PG #${100+i}`,
        description: `Nice ${genderPolicy} PG in ${city} with ${ams.join(', ')}`,
        city,
        address: `No. ${rand(200)+1}, Main Street, ${city}`,
        genderPolicy,
        price,
        amenities: ams,
        images: [
          `https://picsum.photos/seed/pg${i}/800/500`,
          `https://picsum.photos/seed/pg${i}b/800/500`
        ]
      });
    }
    const inserted = await Listing.insertMany(listings);

    // Add a few reviews per listing (random)
    const reviews = [];
    for (const lst of inserted) {
      const reviewCount = rand(4); // 0-3 reviews
      for (let i=0;i<reviewCount;i++) {
        reviews.push({
          listingId: lst._id,
          seekerId: seekers[rand(seekers.length)]._id,
          rating: 2 + rand(4), // 2..5
          comment: 'Good place.'
        });
      }
    }
    if (reviews.length) await Review.insertMany(reviews);

    console.log('✅ Seed complete.');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
