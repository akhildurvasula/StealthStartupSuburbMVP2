# Suburb Events Frontend

Next.js frontend application for the RTP neighborhood events platform, replicated from the Figma design.

## Features

- **Onboarding Flow**: Welcome screen, location detection, and suburb identification
- **Home Screen**: Map and feed views for exploring events
- **Event Creation**: Multi-step event creation with location placement
- **HOA Dashboard**: Zone management for HOA admins
- **Artist Dashboard**: Venue discovery and application system
- **Event Details**: Detailed event view with attendance management
- **Profile Screen**: User profile with role switching

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Lucide React** (Icons)

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/
│   ├── App.tsx             # Main app component with navigation
│   ├── OnboardingWelcome.tsx
│   ├── OnboardingLocation.tsx
│   ├── SuburbIdentified.tsx
│   ├── HomeScreen.tsx
│   ├── MapView.tsx
│   ├── FeedView.tsx
│   ├── EventCreation.tsx
│   ├── HOADashboard.tsx
│   ├── ArtistDashboard.tsx
│   ├── EventDetails.tsx
│   └── ProfileScreen.tsx
├── lib/
│   └── mockData.ts         # Mock data for events and zones
└── types/
    └── index.ts            # TypeScript type definitions
```

## Design Notes

- Mobile-first design optimized for 390x844px viewport (iPhone 12/13/14)
- Uses emerald and sky color scheme matching the Figma design
- All components are client-side rendered with React hooks
- Mock data is used for demonstration purposes

## Next Steps

- Connect to the backend API endpoints
- Add real map integration (e.g., Google Maps, Mapbox)
- Implement authentication
- Add real-time updates for events
- Integrate with Apple Wallet for event tickets
