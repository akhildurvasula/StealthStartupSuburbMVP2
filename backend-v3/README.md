# 🌱 Suburban Culture Engine - V3 Alpha Backend

**Mission**: Build community in places where community has collapsed.

This is the Alpha backend for the Suburban Culture Engine - a platform that helps residents create cultural identity and belonging through frequent micro-events.

---

## 🎯 What This Is

V3 focuses on the **resident-only core loop**:
- Residents host micro-events with 1-tap templates
- Neighbors discover events on a live map
- Interest signals ("ghost pins") show demand without commitment
- Every suburb gets a cultural identity

**No HOAs, no artists, no complexity** - just the cultural heartbeat.

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment

Create `.env` file:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PORT=4000
NODE_ENV=development
JWT_SECRET=your-secret-key
```

### 3. Set Up Database

1. Go to Supabase SQL Editor
2. Run `scripts/setup-tables-v3.sql`
3. Import your suburb CSV into `neighborhood_segments` table

### 4. Run the Server

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

---

## 📋 API Endpoints

### Auth
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login

### Suburb Info
- `GET /api/suburb-info?lat=35.91&lon=-79.05` - Get suburb identity

### Events (Micro-Events)
- `POST /api/events` - Create micro-event
- `GET /api/events?lat=35.91&lon=-79.05&radiusKm=10` - Get nearby events
- `GET /api/events/:id` - Get event details
- `POST /api/events/:id/attend` - Join event
- `POST /api/events/:id/leave` - Leave event

### Interest Signals (Ghost Pins)
- `POST /api/interest-signals` - Create interest signal
- `GET /api/interest-signals?lat=35.91&lon=-79.05&radiusKm=10` - Get nearby signals
- `POST /api/interest-signals/:id/interest` - Express interest

---

## 🎨 Micro-Event Templates

Pre-defined templates for 1-tap event creation:

- **Morning Walk Meetup** 🚶 - 60 min
- **Coffee in the Cul-de-Sac** ☕ - 90 min
- **Dog Play Hour** 🐕 - 60 min
- **Porch Music Jam** 🎶 - 120 min

See `src/config/microEventTemplates.ts`

---

## 🗄️ Database Schema

### Core Tables:
- `users` - Resident accounts
- `neighborhood_segments` - Suburb classification data
- `events` - Micro-events
- `event_attendance` - Who's attending what
- `interest_signals` - Ghost pins (demand signals)
- `interest_signal_users` - Interest tracking

---

## 🏗️ Project Structure

```
backend-v3/
├── src/
│   ├── config/
│   │   └── microEventTemplates.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── suburbController.ts
│   │   ├── eventsController.ts
│   │   └── interestSignalsController.ts
│   ├── routes/
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── auth.ts
│   │   ├── supabase.ts
│   │   └── suburbClassifier.ts
│   └── server.ts
├── scripts/
│   └── setup-tables-v3.sql
└── package.json
```

---

## 🎯 Alpha Success Metrics

The Alpha is successful if:
1. Residents open the app more than once
2. 3+ residents in the same suburb host or join events
3. Users say: "This makes my suburb feel less lonely"
4. Clusters form on the map
5. People host micro-events at least twice

---

## 🚀 Deployment

### Render
1. Connect GitHub repo
2. Root directory: `backend-v3`
3. Build: `npm install && npm run build`
4. Start: `npm start`
5. Add environment variables

### Vercel (Alternative)
- Use as serverless functions
- Add `vercel.json` config

---

## 📝 Notes

- **Alpha simplicity**: No passwords, minimal auth, focus on behavior
- **Spatial queries**: In-memory for Alpha, PostGIS for production
- **Interest signals**: Expire after 24 hours
- **Event templates**: Hardcoded, can be made dynamic later

---

## 🌟 Vision

> "We're not building an events app. We're building a community engine for places where community has collapsed."

Culture comes from frequency, not size. This backend enables the smallest possible friction for residents to create the cultural heartbeat their suburb needs.

---

**Built with ❤️ for suburban communities**

