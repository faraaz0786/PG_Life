# PG-Life (Full-stack MERN)

**Stack:** React (Vite) + Tailwind + React Query + React Router · Node/Express + MongoDB (Mongoose) · JWT

## Run Locally
### 1) API
```
cd server
cp .env.example .env
npm install
npm run seed
npm run dev
```
API: http://localhost:5000

### 2) Frontend
```
cd client
cp .env.example .env
npm install
npm run dev
```
App: http://localhost:5173

## Demo Accounts
- Owner: owner1@example.com / owner123
- Seeker: seeker1@example.com / seeker123

## Deployment (free-tier)
- **DB:** MongoDB Atlas (copy connection string to `server/.env` as `MONGODB_URI`)
- **Backend:** Render (Node). Set env vars `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN`
- **Frontend:** Vercel (React/Vite). Set `VITE_API_URL` to your Render backend URL

## Postman
Import `server/PG-Life.postman_collection.json`
