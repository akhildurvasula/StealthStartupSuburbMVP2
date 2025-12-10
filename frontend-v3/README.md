# 🌱 Suburban Culture Engine - V3 Alpha Frontend

**Mission**: Building community in places where community has collapsed.

This is the Alpha frontend for the Suburban Culture Engine - focused on the resident-only core loop with micro-events and interest signals.

---

## 🎯 What This Is

The V3 Alpha frontend enables residents to:
- 🗺️ See their suburb's cultural identity
- 📍 Discover nearby micro-events on a live map
- ⚡ Host events with 1-tap templates
- 👻 Create "interest signals" (ghost pins) for demand
- 🤝 Join and attend community gatherings

**No HOAs, no artists, no complexity** - just the cultural heartbeat.

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Get Mapbox Token

1. Go to https://www.mapbox.com
2. Sign up (free tier)
3. Go to Account → Tokens
4. Copy your **Default public token**

### 3. Set Up Environment

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...your-token
```

### 4. Run the App

```bash
npm run dev
```

Open http://localhost:3000

---

## 🏗️ Architecture

### **Core Flow:**
```
User opens app
    ↓
Request geolocation
    ↓
Fetch suburb info (/suburb-info)
    ↓
Display: "Inner-Ring Suburb of Raleigh"
    ↓
Fetch events + interest signals
    ↓
Render map with pins
    ↓
User interactions (host, join, signal)
```

### **Key Components:**

```
app/
├── page.tsx              → Main map screen
├── event/[id]/page.tsx   → Event detail page
└── layout.tsx

components/
├── Map.tsx               → Mapbox GL map with pins
├── SuburbBanner.tsx      → Top identity banner
├── EventDrawer.tsx       → Bottom sheet with event list
├── HostEventModal.tsx    → Create micro-event modal
├── InterestSignalModal.tsx → Create ghost pin modal
├── GhostPinPopover.tsx   → Interest signal details
├── EventCard.tsx         → Event list item
├── TemplateGrid.tsx      → Template picker
└── Toast.tsx             → Success/error messages

lib/
├── api.ts                → API client (all endpoints)
├── types.ts              → TypeScript interfaces
├── storage.ts            → localStorage utilities
└── utils.ts              → Helper functions
```

---

## 🎨 Micro-Event Templates

The Alpha has 4 templates:

- 🚶 **Morning Walk Meetup** (60 min)
- ☕ **Coffee in the Cul-de-Sac** (90 min)
- 🐕 **Dog Play Hour** (60 min)
- 🎶 **Porch Music Jam** (120 min)

---

## 🗺️ Map Features

### **Event Pins (Solid)**
- Emerald green circles
- Click to view event details
- Shows active community gatherings

### **Interest Signals (Ghost Pins)**
- Semi-transparent gray
- Dashed border
- Click to express interest
- Shows demand without commitment

### **User Location**
- Blue marker
- Centers map on user

---

## 🔌 API Integration

All API calls go through `lib/api.ts`:

- `getSuburbInfo(lat, lon)` - Suburb classification
- `getEvents(lat, lon, radiusKm)` - Nearby events
- `getEvent(id)` - Event details
- `createEvent(data)` - Host micro-event
- `attendEvent(eventId, userId)` - Join event
- `leaveEvent(eventId, userId)` - Leave event
- `getInterestSignals(lat, lon, radiusKm)` - Ghost pins
- `createInterestSignal(data)` - Create ghost pin
- `expressInterest(signalId, userId)` - Show interest

---

## 💾 State Management

Simple useState + useEffect for Alpha:

- **Location**: User's current lat/lon
- **Suburb Info**: Classification data
- **Events**: Array of nearby events
- **Interest Signals**: Array of ghost pins
- **UI State**: Modal visibility, selected items
- **User ID**: Auto-generated, stored in localStorage

---

## 🎨 Design Principles

1. **Map First** - Fullscreen map is primary UI
2. **Zero Friction** - 1-tap template selection
3. **Visual Warmth** - Emerald green theme
4. **Suburb Identity** - Always visible at top
5. **Ghost Pins** - Clearly differentiated from events
6. **Mobile Optimized** - Bottom drawer, FABs

---

## 🚀 Deployment

### Vercel

1. Connect GitHub repo
2. Root directory: `frontend-v3`
3. Framework: Next.js (auto-detected)
4. Environment variables:
   - `NEXT_PUBLIC_API_URL` = your backend URL
   - `NEXT_PUBLIC_MAPBOX_TOKEN` = your Mapbox token
5. Deploy!

---

## 🧪 Testing Locally

### With Backend Running:

1. Start backend on port 4000
2. Start frontend on port 3000
3. Allow browser geolocation
4. You should see:
   - Suburb banner at top
   - Map with your location
   - Bottom drawer with events
   - FAB buttons for actions

### Test Flow:

1. Click "Host Event" FAB
2. Select a template (e.g., Coffee)
3. Pick a time
4. Submit
5. See new pin appear on map
6. Click pin or drawer item
7. View event details
8. Click "Join Event"
9. See attendee count increase

---

## 📱 Mobile Experience

The Alpha is mobile-first:
- Touch-friendly buttons
- Bottom sheet drawer
- FAB positioning
- Swipeable modals
- Responsive map

---

## 🎯 Alpha Success Metrics

The frontend enables measuring:
1. **Repeat usage** - localStorage tracks userId across sessions
2. **Event creation** - Track POST /events calls
3. **Event joining** - Track attendance patterns
4. **Interest signals** - Track ghost pin creation
5. **Geographic clustering** - Map visualization shows hot spots

---

## 🛠️ Customization

### Add More Templates:
Edit `lib/types.ts` → `MICRO_EVENT_TEMPLATES`

### Change Map Style:
Edit `components/Map.tsx` → `style` property

### Adjust Colors:
Edit `app/globals.css` and component Tailwind classes

### Change Radius:
Edit `app/page.tsx` → `radiusKm` parameter

---

## 🌟 Vision

> "We're not building an events app. We're building a community engine for places where community has collapsed."

This frontend makes suburban culture visible, tangible, and participatory.

Culture comes from frequency, not size. Every micro-event is a heartbeat.

---

**Built with ❤️ for suburban communities**

