# Wedding Attendance Management System

## Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

## Setup & Run

### 1. Backend
```bash
cd backend
npm install
# Edit .env — set your MONGO_URI and ADMIN_PINS
npm run dev
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173  
Backend runs on http://localhost:5000

## Admin PINs
Edit `backend/.env`:
```
ADMIN_PINS=9494739450:Riyaz,1111111111:Vaseem,2222222222:Ruksana
```
Format: `PIN:Name` separated by commas.

## Features
- Guest RSVP form (mobile-first)
- Duplicate detection per event
- Admin PIN login (top-right button)
- Filter by event / invited by / name search
- Delete individual entries
- Export to CSV
- Auto-refresh every 30 seconds
- Stats: total guests, per event, per host
