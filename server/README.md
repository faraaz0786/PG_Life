# PG-Life API (Express + MongoDB)

## Quick Start
```bash
cd server
cp .env.example .env
# edit .env if needed
npm install
npm run seed   # seeds demo users (owners & seekers) + ~50 listings
npm run dev    # http://localhost:5000
```

### Default demo accounts
- Owner: `owner1@example.com` / `owner123`
- Seeker: `seeker1@example.com` / `seeker123`

### Endpoints (high level)
- `POST /api/auth/signup`, `POST /api/auth/login`, `GET /api/auth/me`
- Listings CRUD: `/api/listings`
- Favorites: `/api/favorites`
- Bookings: `/api/bookings`
- Reviews: `/api/reviews`
- Recommendations: `/api/recommendations/me`

See the included **PG-Life.postman_collection.json** for ready-to-run API calls.
