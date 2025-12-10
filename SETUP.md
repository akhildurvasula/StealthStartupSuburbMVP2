# Suburb Events - Complete Setup Guide

## Project Structure

```
Startup Idea/
├── backend/              # Express + Prisma backend
├── frontend/             # Next.js frontend
├── src/                  # Original Express backend (can merge with backend/)
└── rtp_suburb_types_v0.* # Census data files
```

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Create `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/suburb_events?schema=public"
PORT=4000
NODE_ENV=development
JWT_SECRET="your-super-secret-jwt-key"
MAPBOX_API_KEY="optional"
```

### 3. Set Up Database

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed with sample data
npm run prisma:seed
```

### 4. Run Backend

```bash
# Development mode
npm run dev

# Backend runs on http://localhost:4000
```

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Create `.env.local` file (or copy from `.env.example` if it exists):

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### 3. Run Frontend

```bash
# Development mode
npm run dev

# Frontend runs on http://localhost:3000
```

## Test Accounts

After seeding the database, you can use these accounts:

- **Resident**: alex@example.com / password123
- **Artist**: jamie@example.com / password123
- **HOA Admin**: admin@maplewood.com / password123

## API Integration

The frontend is now connected to the backend via:

### API Client (`frontend/lib/apiClient.ts`)
- Typed interfaces for all data models
- Automatic JWT token injection
- Error handling

### Authentication (`frontend/contexts/AuthContext.tsx`)
- `useAuth()` hook for login/signup/logout
- Automatic token persistence in localStorage
- Global auth state management

### Data Hooks
- `useSuburbs()` - Fetch all suburbs
- `useEvents(suburbId)` - Fetch events for a suburb
- `useHOALocations(suburbId)` - Fetch HOA locations
- `useArtistDiscovery()` - Fetch artist discovery heatmap
- `useHomeLocation(userId)` - Manage user home location

## Development Workflow

### Running Both Servers

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

### Making API Changes

1. Update Prisma schema in `backend/prisma/schema.prisma`
2. Run `npm run prisma:migrate`
3. Update API client types in `frontend/lib/apiClient.ts`
4. Update hooks if needed

## Key Features

### Implemented
- ✅ User authentication (signup/login)
- ✅ Suburb intelligence layer
- ✅ Event creation and management
- ✅ HOA location management
- ✅ Artist discovery heatmap
- ✅ Home location for residents
- ✅ Event attendance tracking

### Components Wired Up
- Onboarding flow (location detection coming soon)
- Home screen with event listing
- Event creation form
- HOA dashboard
- Artist discovery view
- Profile management

## Next Steps

1. **Connect OnboardingLocation**
   - Implement geolocation to lat/lon conversion
   - Call `/api/suburbs` to find nearest suburb

2. **Enhance Map View**
   - Integrate real map library (Mapbox/Google Maps)
   - Show event pins, HOA locations, home locations
   - Add clustering for many events

3. **Add Real-time Updates**
   - WebSocket for live event updates
   - Push notifications for nearby events

4. **Apple Wallet Integration**
   - Generate passes for joined events
   - QR codes for event check-in

5. **Enhanced Artist Features**
   - Application system for HOA venues
   - Portfolio/profile for artists
   - Booking system

## Troubleshooting

### Backend Issues

**"Prisma Client not found"**
```bash
cd backend
npm run prisma:generate
```

**Database connection error**
- Check PostgreSQL is running
- Verify DATABASE_URL in `.env`

### Frontend Issues

**"API request failed"**
- Ensure backend is running on port 4000
- Check NEXT_PUBLIC_API_URL in `.env.local`
- Check browser console for CORS errors

**Authentication not working**
- Clear localStorage: `localStorage.clear()` in browser console
- Check JWT_SECRET matches between requests

## Architecture Notes

### Authentication Flow
1. User logs in → Backend returns JWT token
2. Frontend stores token in localStorage
3. AuthContext provides global auth state
4. API client auto-attaches token to requests

### Data Flow
1. Components use hooks (e.g., `useEvents`)
2. Hooks call API client functions
3. API client makes fetch requests to backend
4. Backend queries Prisma/PostgreSQL
5. Response flows back through hooks to components

### Suburb Intelligence
- Automatically calculated on event creation/updates
- Scores: event density, artist interest, avg attendance
- Used for artist discovery heatmap

## Useful Commands

```bash
# Backend
npm run prisma:studio    # Open database GUI
npm run prisma:generate  # Regenerate Prisma client
npm run type-check       # TypeScript check

# Frontend
npm run build           # Production build
npm run type-check      # TypeScript check
```

## Production Deployment

### Backend
1. Set up PostgreSQL database
2. Update environment variables
3. Run migrations: `npx prisma migrate deploy`
4. Deploy to service (Railway, Render, Heroku, etc.)

### Frontend
1. Update `NEXT_PUBLIC_API_URL` to production backend URL
2. Deploy to Vercel/Netlify
3. Configure environment variables in hosting platform

## Support

For issues or questions:
1. Check backend logs: Terminal running `npm run dev`
2. Check frontend console: Browser DevTools
3. Verify API endpoints: `curl http://localhost:4000/health`

