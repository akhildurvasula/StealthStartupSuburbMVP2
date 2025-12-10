# 🚀 V3 Alpha - Complete Setup Guide

Your **Suburban Culture Engine V3 Alpha** is ready! Follow this guide to get it running locally and deployed.

---

## ✅ **What You Have**

### **Backend V3** - 100% Complete
- Express + TypeScript + Supabase
- 9 API endpoints
- Micro-event templates
- Interest signals (ghost pins)
- Suburb classifier

### **Frontend V3** - 100% Complete
- Next.js + TypeScript + Tailwind
- Mapbox integration
- All UI components
- Full data flow

---

## 🏃 **Local Setup (15 minutes)**

### **Step 1: Set Up Backend**

```bash
cd backend-v3
npm install
```

Create `.env` file:
```env
SUPABASE_URL=https://swxlsqfcyzpbfwvynjwg.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=suburb-culture-engine-secret-2024
PORT=4000
NODE_ENV=development
```

**Create V3 Database Tables:**
1. Go to Supabase SQL Editor
2. Run `backend-v3/scripts/setup-tables-v3.sql`
3. Verify 7 tables created

**Import Suburb Data:**
1. In Supabase, go to Table Editor → `neighborhood_segments`
2. Click "Insert" → "Insert via spreadsheet"
3. Upload your `rtp_suburb_types_v0.csv`
4. Map columns: `geoid`, `county`, `name`, `lat`, `lon`, etc.

**Start Backend:**
```bash
npm run dev
```

You should see:
```
🌱 Suburban Culture Engine V3 Alpha
🚀 Building community, one micro-event at a time
✅ Server running on http://localhost:4000
```

---

### **Step 2: Set Up Frontend**

```bash
cd frontend-v3
npm install
```

**Get Mapbox Token:**
1. Go to https://account.mapbox.com
2. Sign up (free)
3. Copy your "Default public token"

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...your-mapbox-token
```

**Start Frontend:**
```bash
npm run dev
```

You should see:
```
✓ Ready in 2s
○ Local: http://localhost:3000
```

---

### **Step 3: Test the App**

1. Open http://localhost:3000
2. Allow location access
3. You should see:
   - ✅ "Inner-Ring Suburb of [City]" banner
   - ✅ Map with your location
   - ✅ Bottom drawer "Events Near You"
   - ✅ Two FAB buttons (green + white)

4. Click the green "+" button → Host an event
5. Select a template
6. Pick a time
7. Submit
8. See your event appear on the map!

---

## 🚀 **Deployment (Same as V2)**

### **Backend to Render:**

1. Go to Render.com
2. New Web Service
3. Connect GitHub repo: `StealthStartupSuburbMVP2`
4. Settings:
   - **Root Directory**: `backend-v3`
   - **Build**: `npm install && npm run build`
   - **Start**: `npm start`
5. Add environment variables (same as local)
6. Deploy!

Save your URL: `https://your-app-v3.onrender.com`

---

### **Frontend to Vercel:**

1. Go to Vercel.com
2. New Project
3. Import GitHub repo
4. Settings:
   - **Root Directory**: `frontend-v3`
   - **Framework**: Next.js
5. Add environment variables:
   - `NEXT_PUBLIC_API_URL` = `https://your-render-url.onrender.com/api`
   - `NEXT_PUBLIC_MAPBOX_TOKEN` = your Mapbox token
6. Deploy!

---

## 📋 **Key Differences from V2**

| Feature | V2 | V3 Alpha |
|---------|----|----|
| User types | Resident, Artist, HOA | **Resident only** |
| Event creation | Complex form | **1-tap templates** |
| Discovery | Generic search | **Interest signals** |
| Focus | Multi-feature | **Core loop** |
| Mission | Events app | **Culture engine** |

---

## 🎯 **Alpha Success Metrics**

Track these in analytics:

1. **Repeat usage** - Do users come back?
2. **Event frequency** - How many events per suburb?
3. **Attendance** - Are people joining?
4. **Interest signals** - Are people using ghost pins?
5. **Geographic clustering** - Are hot spots forming?

---

## 🎨 **UI Components**

### **Pages:**
- `/` - Main map screen
- `/event/[id]` - Event detail page

### **Components:**
- `Map` - Mapbox with event/signal pins
- `SuburbBanner` - Identity display
- `EventDrawer` - Bottom sheet
- `HostEventModal` - Event creation
- `InterestSignalModal` - Ghost pin creation
- `GhostPinPopover` - Signal interaction
- `EventCard` - List item
- `TemplateGrid` - Template picker
- `Toast` - Notifications

---

## 🔧 **Troubleshooting**

### "Map not loading"
- ✅ Check `NEXT_PUBLIC_MAPBOX_TOKEN` is set
- ✅ Check token is valid (starts with `pk.`)
- ✅ Check browser console for errors

### "No events showing"
- ✅ Check backend is running on port 4000
- ✅ Check `NEXT_PUBLIC_API_URL` is correct
- ✅ Check browser console → Network tab
- ✅ Try creating an event first

### "Suburb banner not showing"
- ✅ Allow browser geolocation
- ✅ Check backend `/suburb-info` endpoint works
- ✅ Verify suburb data is in Supabase

### "Can't create events"
- ✅ Check backend logs
- ✅ Verify Supabase tables exist
- ✅ Check browser console for errors

---

## 🌟 **What Makes V3 Special**

This isn't just a refactor - it's a **philosophical shift**:

### **V2 was:**
- Feature-rich events platform
- Multi-stakeholder (residents, HOAs, artists)
- Generic event discovery

### **V3 is:**
- Laser-focused on resident behavior
- Micro-events with templates
- Cultural identity front-and-center
- Interest signals (demand without commitment)
- **Community engine, not events app**

---

## 📚 **Next Steps After Alpha**

Once the resident core loop works:

### **Phase 2 - Rituals:**
- Recurring events
- "Your Morning Walk Group"
- Regular gathering spots
- Community traditions

### **Phase 3 - Culture Feed:**
- Weekly suburb digest
- "Your suburb hosted 12 events this week"
- Trending activities
- Identity evolution

### **Phase 4 - External Players:**
- HOA zones (structured support)
- Local creatives (cultural amplification)
- Business partnerships

---

## 🎯 **The Mission**

> "Building community in places where community has collapsed."

Every line of code in V3 serves this mission. Culture comes from frequency, not size. This Alpha enables the smallest possible friction for residents to create the cultural heartbeat their suburb desperately needs.

---

## 🆘 **Need Help?**

- Check the browser console
- Check backend logs
- Review API responses in Network tab
- Verify environment variables
- Make sure both servers are running

---

**You're building something that matters. Let's bring suburbs to life.** 🌱


