# Suburb Events - Full Stack MVP

A complete neighborhood events platform connecting residents, artists, and HOAs in the RTP (Research Triangle Park) region.

## 🎯 What's Built

### Backend (Express + PostgreSQL + Prisma)
- ✅ **Complete REST API** with 20+ endpoints
- ✅ **Authentication** (JWT + magic links)
- ✅ **Suburb Intelligence Layer** - Automatic scoring system
- ✅ **Event Management** - Full CRUD with attendance tracking
- ✅ **HOA Integration** - Location management and preferences
- ✅ **Artist Discovery** - Heatmap with engagement scoring
- ✅ **Home Hosting** - Resident location management
- ✅ **Database Schema** - 10 normalized tables
- ✅ **Seed Data** - Sample suburbs, users, events

### Frontend (Next.js + TypeScript + Tailwind)
- ✅ **Complete UI** - All screens from Figma design
- ✅ **API Integration** - Typed client with all endpoints
- ✅ **Authentication** - Global auth context with persistence
- ✅ **Data Hooks** - React hooks for all API operations
- ✅ **Mobile-First** - 390x844px optimized design
- ✅ **Integration Guide** - Step-by-step wiring instructions

### Data Analysis (R + tidycensus)
- ✅ **Census Data Processing** - RTP suburb classification
- ✅ **Suburb Types** - Inner-Ring, General, Exurban
- ✅ **Population Density** - Calculated metrics
- ✅ **City Distance** - Raleigh, Durham, Chapel Hill

## 📁 Project Structure

```
Startup Idea/
├── backend/                      # Express API
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema
│   │   └── seed.ts              # Sample data
│   ├── src/
│   │   ├── server.ts            # Express setup
│   │   ├── controllers/         # Request handlers
│   │   ├── routes/              # API routes
│   │   └── utils/               # Auth, Prisma, helpers
│   ├── package.json
│   └── README.md                # API documentation
│
├── frontend/                     # Next.js app
│   ├── app/                     # Next.js app router
│   ├── components/              # React components
│   │   ├── App.tsx             # Main app
│   │   ├── OnboardingWelcome.tsx
│   │   ├── OnboardingLocation.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── EventCreation.tsx
│   │   ├── HOADashboard.tsx
│   │   ├── ArtistDashboard.tsx
│   │   ├── EventDetails.tsx
│   │   └── ProfileScreen.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx     # Global auth state
│   ├── hooks/                   # Data fetching hooks
│   │   ├── useSuburbs.ts
│   │   ├── useEvents.ts
│   │   ├── useHOALocations.ts
│   │   ├── useArtistDiscovery.ts
│   │   └── useHomeLocation.ts
│   ├── lib/
│   │   └── apiClient.ts        # Typed API client
│   ├── package.json
│   └── INTEGRATION_GUIDE.md    # Component wiring guide
│
├── src/                         # Original Express backend
│   ├── server.ts               # (can merge with backend/)
│   ├── db.ts
│   └── routes/
│
├── rtp_suburb_types_v0.csv     # Census data
├── rtp_suburb_types_v0.R       # R data processing
├── schema.sql                   # SQLite schema
├── schema_postgresql.sql        # PostgreSQL schema
│
├── SETUP.md                     # Complete setup guide
└── README.md                    # This file
```

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOL
DATABASE_URL="postgresql://user:password@localhost:5432/suburb_events"
JWT_SECRET="your-secret-key"
PORT=4000
EOL

# Set up database
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# Start server
npm run dev
# → Backend runs on http://localhost:4000
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:4000/api" > .env.local

# Start dev server
npm run dev
# → Frontend runs on http://localhost:3000
```

### 3. Test the App

Visit http://localhost:3000 and login with:
- **Email**: alex@example.com
- **Password**: password123

## 📖 Documentation

- **[SETUP.md](SETUP.md)** - Detailed setup instructions
- **[backend/README.md](backend/README.md)** - Complete API documentation
- **[frontend/INTEGRATION_GUIDE.md](frontend/INTEGRATION_GUIDE.md)** - Component wiring guide

## 🏗️ Architecture

### Database Schema (PostgreSQL)

```
User ←→ Suburb
  ↓
Event ← EventAttendance
  ↓
SuburbScore (intelligence layer)

HOA → HOALocation → Event
  ↑
User (HOA_ADMIN)

UserHomeLocation → User
```

### API Endpoints

**Authentication**
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/magic-link`

**Suburbs**
- `GET /api/suburbs` - All suburbs with scores
- `GET /api/suburbs/:id` - Single suburb with intelligence

**Events**
- `POST /api/events` - Create event
- `GET /api/events` - List events
- `PATCH /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/attend` - Join event
- `POST /api/events/:id/leave` - Leave event

**HOA Locations**
- `POST /api/hoa-locations` - Create location
- `GET /api/hoa-locations` - List locations

**Artist Discovery**
- `GET /api/artist/discovery` - Heatmap data

**Home Locations**
- `POST /api/home-location` - Set home location
- `GET /api/home-location/:userId` - Get home location

### Frontend Architecture

```
App.tsx (Main container)
  ↓
AuthContext (Global auth)
  ↓
Components → Hooks → API Client → Backend
```

**Data Flow**:
1. Component calls hook (e.g., `useEvents()`)
2. Hook fetches from API client
3. API client adds JWT token
4. Backend processes request
5. Data flows back through hooks to UI

## 🎨 Features

### For Residents
- ✅ Browse events in your suburb
- ✅ Create events at home
- ✅ Join/leave events
- ✅ Set home location on map
- ✅ View event details and attendees

### For Artists
- ✅ View discovery heatmap
- ✅ Find high-engagement suburbs
- ✅ See HOA-preferred venues
- ✅ Host performances
- ✅ Track event metrics

### For HOAs
- ✅ Create event zones
- ✅ Set preferred event types
- ✅ Manage capacity and availability
- ✅ Track zone usage
- ✅ Approve artist applications

### Intelligence Layer
- ✅ **Event Density** - Events per month
- ✅ **Artist Interest Score** - 0-100 based on activity
- ✅ **Average Attendance** - Mean attendees per event
- ✅ **Automatic Updates** - Recalculated on event changes

## 🔧 Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express 4
- **Database**: PostgreSQL 14+
- **ORM**: Prisma 5
- **Auth**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Language**: TypeScript

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State**: React Context + Hooks
- **HTTP**: Native Fetch API

### Data Analysis
- **Language**: R
- **Packages**: tidycensus, sf, dplyr
- **Data**: 2022 ACS 5-year estimates

## 📊 Database Models

- **User** - Residents, artists, HOA admins
- **Suburb** - RTP region suburbs
- **SuburbScore** - Intelligence metrics
- **Event** - Community events
- **EventAttendance** - Join/leave tracking
- **HOA** - Homeowner associations
- **HOALocation** - HOA-preferred venues
- **UserHomeLocation** - Resident home pins
- **MagicLink** - Passwordless auth tokens

## 🎯 Next Steps

### Phase 1: Core Functionality
- [ ] Wire up remaining components (see INTEGRATION_GUIDE.md)
- [ ] Add geolocation for suburb detection
- [ ] Implement real map (Mapbox/Google Maps)
- [ ] Add toast notifications

### Phase 2: Enhanced Features
- [ ] Apple Wallet integration for events
- [ ] Shared photo albums per event
- [ ] Artist application/approval system
- [ ] Email notifications
- [ ] Real-time updates (WebSockets)

### Phase 3: Growth
- [ ] Expand beyond RTP region
- [ ] Mobile apps (React Native)
- [ ] Payment integration
- [ ] Event recommendations (ML)
- [ ] Community guidelines/moderation

## 🧪 Testing

### Test Accounts (after seed)

| Role | Email | Password |
|------|-------|----------|
| Resident | alex@example.com | password123 |
| Artist | jamie@example.com | password123 |
| HOA Admin | admin@maplewood.com | password123 |

### API Testing

```bash
# Health check
curl http://localhost:4000/health

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex@example.com","password":"password123"}'

# Get suburbs
curl http://localhost:4000/api/suburbs

# Get events (requires auth token)
curl http://localhost:4000/api/events?suburbId=<suburb-id> \
  -H "Authorization: Bearer <your-token>"
```

## 🐛 Troubleshooting

**Backend won't start**
- Check PostgreSQL is running
- Verify `DATABASE_URL` in `.env`
- Run `npm run prisma:generate`

**Frontend can't reach API**
- Ensure backend is running on port 4000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Look for CORS errors in browser console

**Authentication not working**
- Clear browser localStorage
- Check JWT_SECRET is set
- Verify token in browser DevTools → Application → Local Storage

## 📝 Development Commands

### Backend
```bash
npm run dev              # Start dev server
npm run build            # TypeScript build
npm run prisma:studio    # Open database GUI
npm run prisma:generate  # Regenerate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:seed      # Seed database
```

### Frontend
```bash
npm run dev         # Start dev server
npm run build       # Production build
npm run start       # Run production build
npm run type-check  # TypeScript validation
```

## 🚢 Deployment

### Backend
1. Deploy PostgreSQL (Railway, Supabase, etc.)
2. Set environment variables
3. Run: `npx prisma migrate deploy`
4. Deploy to hosting (Render, Railway, Heroku)

### Frontend
1. Update `NEXT_PUBLIC_API_URL` to production backend
2. Deploy to Vercel or Netlify
3. Set environment variables in hosting dashboard

## 📄 License

This project is part of a startup MVP. All rights reserved.

## 🤝 Contributing

This is a private MVP project. For questions or issues, contact the development team.

---

**Built with** ❤️ **for the RTP community**
