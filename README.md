# Carrier Search - Sample App

This sample project demonstrates a carrier/trip search for recurring weekly routes.
It uses MongoDB for storage, Algolia for search, and a React frontend (Vite) with a flight-style search (From, To, Date).

## Features
- Trips stored as companies with multiple weekly routes (dayOfWeek).
- Contact info supports multiple phones, email, and website.
- Backend syncs MongoDB -> Algolia (flattening routes into searchable records).
- Frontend date picker maps to weekday and searches Algolia by dayOfWeek.
- Country dropdowns include European countries.

## Quick start (local)

### 1) Backend
```bash
cd backend
cp .env.example .env
# edit .env (Mongo URI, Algolia keys)
npm install
npm run seed   # seeds sample data into MongoDB
npm run dev    # or npm start
```

### 2) Frontend
```bash
cd frontend
cp .env.example .env
# edit .env with Algolia APP ID & Search Key
npm install
npm run dev
```

Open the frontend dev URL (usually http://localhost:5173) and use the search form.
When you pick a specific date, the app will compute its weekday and match weekly routes that run on that weekday.

## Notes
- The backend will attempt to sync to Algolia on start and every 60s. Provide Algolia keys in backend/.env to enable syncing.
- For production deployment, use MongoDB Atlas and supply environment variables per platform (Render, Railway, Vercel).

