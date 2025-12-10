# Frontend-Backend Integration Guide

This guide shows how to wire up each existing component to use the backend API.

## ✅ Already Set Up

1. **API Client** (`lib/apiClient.ts`) - Complete with all endpoints
2. **Auth Context** (`contexts/AuthContext.tsx`) - Global auth state
3. **Data Hooks** - All hooks ready in `hooks/` directory
4. **Layout** - AuthProvider wrapped around app

## 🔌 Components to Wire Up

### 1. App Component (`components/App.tsx`)

**Current State**: Uses local state for suburb

**Add to top:**
```typescript
import { useAuth } from '@/contexts/AuthContext';
import { useSuburbs } from '@/hooks/useSuburbs';
```

**Add after existing state:**
```typescript
const { user, isAuthenticated } = useAuth();
const { suburbs } = useSuburbs();

// Find suburb by name or use first available
const suburbData = suburbs.find(s => s.name === suburb) || suburbs[0];
```

**Pass to components:**
```typescript
// Pass suburbData.id to HomeScreen, EventCreation, etc.
<HomeScreen 
  navigateTo={navigateTo}
  suburb={suburb}
  suburbId={suburbData?.id}
  userRole={userRole}
/>
```

---

### 2. OnboardingLocation (`components/OnboardingLocation.tsx`)

**Add imports:**
```typescript
import { useSuburbs } from '@/hooks/useSuburbs';
```

**Replace location detection:**
```typescript
const { suburbs, isLoading } = useSuburbs();

const handleEnableLocation = () => {
  // Get user's coordinates (simulated for now)
  const userLat = 35.7796; // Would come from navigator.geolocation
  const userLon = -78.6382;

  // Find nearest suburb
  const nearest = findNearestSuburb(userLat, userLon, suburbs);
  if (nearest) {
    onNext(nearest.name);
  }
};

// Helper function
function findNearestSuburb(lat: number, lon: number, suburbs: Suburb[]) {
  let nearest = suburbs[0];
  let minDist = calculateDistance(lat, lon, nearest.coordinates.lat, nearest.coordinates.lon);
  
  suburbs.forEach(s => {
    const dist = calculateDistance(lat, lon, s.coordinates.lat, s.coordinates.lon);
    if (dist < minDist) {
      minDist = dist;
      nearest = s;
    }
  });
  
  return nearest;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 3959; // Earth radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}
```

---

### 3. HomeScreen (`components/HomeScreen.tsx`)

**Add prop:**
```typescript
interface HomeScreenProps {
  navigateTo: (screen: Screen, eventId?: string) => void;
  suburb: string;
  suburbId?: string;  // ADD THIS
  userRole: UserRole;
}
```

**Pass to child components:**
```typescript
<MapView 
  navigateTo={navigateTo} 
  suburb={suburb} 
  suburbId={suburbId}  // ADD THIS
  userRole={userRole} 
/>

<FeedView 
  navigateTo={navigateTo} 
  suburb={suburb}
  suburbId={suburbId}  // ADD THIS
/>
```

---

### 4. MapView (`components/MapView.tsx`)

**Add imports and props:**
```typescript
import { useEvents } from '@/hooks/useEvents';
import { useHOALocations } from '@/hooks/useHOALocations';

interface MapViewProps {
  navigateTo: (screen: Screen, eventId?: string) => void;
  suburb: string;
  suburbId?: string;  // ADD THIS
  userRole: UserRole;
}
```

**Replace mockEvents with real data:**
```typescript
const { events, isLoading } = useEvents(suburbId);
const { locations: hoaLocations } = useHOALocations(suburbId);

// In the drawer content, replace mockEvents with:
{isLoading ? (
  <div className="text-center py-4">Loading events...</div>
) : (
  events.slice(0, 4).map((event) => (
    // ... existing event card JSX
  ))
)}
```

---

### 5. FeedView (`components/FeedView.tsx`)

**Add imports and props:**
```typescript
import { useEvents } from '@/hooks/useEvents';

interface FeedViewProps {
  navigateTo: (screen: Screen, eventId?: string) => void;
  suburb: string;
  suburbId?: string;  // ADD THIS
}
```

**Replace mockEvents:**
```typescript
const { events, isLoading, attendEvent } = useEvents(suburbId);
const [addedEvents, setAddedEvents] = useState<string[]>([]);

const toggleEventWallet = async (eventId: string) => {
  if (addedEvents.includes(eventId)) {
    setAddedEvents(prev => prev.filter(id => id !== eventId));
  } else {
    try {
      await attendEvent(eventId);
      setAddedEvents(prev => [...prev, eventId]);
    } catch (error) {
      console.error('Failed to join event:', error);
      // Show error toast
    }
  }
};

// In JSX:
{isLoading ? (
  <div className="text-center py-8">Loading events...</div>
) : (
  events.map((event) => (
    // ... existing event card JSX
    // Update to use event.title, event.dateTime, etc.
  ))
)}
```

---

### 6. EventCreation (`components/EventCreation.tsx`)

**Add imports:**
```typescript
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/hooks/useEvents';

interface EventCreationProps {
  onBack: () => void;
  suburb: string;
  suburbId?: string;  // ADD THIS
}
```

**Get current user and create function:**
```typescript
const { user } = useAuth();
const { createEvent } = useEvents(suburbId);
const [isSubmitting, setIsSubmitting] = useState(false);
const [error, setError] = useState<string | null>(null);
```

**Update handleCreateEvent:**
```typescript
const handleCreateEvent = async () => {
  if (!user || !suburbId) {
    setError('Please log in to create an event');
    return;
  }

  setIsSubmitting(true);
  setError(null);

  try {
    const dateTime = new Date(`${formData.date}T${formData.time}`).toISOString();
    
    await createEvent({
      title: formData.title,
      description: formData.description,
      hostType: hostType === 'home' ? 'RESIDENT' : 'HOA',
      suburbId,
      locationLat: 35.7796, // Would come from map selection
      locationLon: -78.6382,
      dateTime,
      category: formData.category.toLowerCase(),
      expectedCapacity: formData.expectedAttendance ? 
        parseInt(formData.expectedAttendance) : undefined,
    });

    setStep('success');
    setTimeout(() => {
      onBack();
    }, 2000);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to create event');
  } finally {
    setIsSubmitting(false);
  }
};
```

**Show error and disable button:**
```typescript
{error && (
  <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
    {error}
  </div>
)}

<button
  onClick={handleCreateEvent}
  disabled={isSubmitting || !formData.title}
  className="flex-1 bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 transition-colors disabled:bg-gray-300"
>
  {isSubmitting ? 'Creating...' : 'Create Event'}
</button>
```

---

### 7. EventDetails (`components/EventDetails.tsx`)

**Add imports:**
```typescript
import { useEvent } from '@/hooks/useEvents';
import { useAuth } from '@/contexts/AuthContext';
```

**Fetch real event data:**
```typescript
const { user } = useAuth();
const { event, isLoading } = useEvent(eventId);
const [isJoined, setIsJoined] = useState(false);

// Show loading state
if (isLoading) {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-slate-600">Loading event...</div>
    </div>
  );
}

if (!event) {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-slate-600">Event not found</div>
    </div>
  );
}
```

**Update join/leave functions:**
```typescript
const handleJoinLeave = async () => {
  if (!user) {
    alert('Please log in to join events');
    return;
  }

  try {
    if (isJoined) {
      // await leaveEvent(event.id);
      setIsJoined(false);
    } else {
      // await attendEvent(event.id);
      setIsJoined(true);
    }
  } catch (error) {
    console.error('Failed to update attendance:', error);
  }
};
```

---

### 8. HOADashboard (`components/HOADashboard.tsx`)

**Add imports:**
```typescript
import { useAuth } from '@/contexts/AuthContext';
import { useHOALocations } from '@/hooks/useHOALocations';

interface HOADashboardProps {
  onBack: () => void;
  suburb: string;
  suburbId?: string;  // ADD THIS
}
```

**Replace mock data:**
```typescript
const { user } = useAuth();
const { locations, isLoading, createLocation } = useHOALocations(suburbId);
const [isSubmitting, setIsSubmitting] = useState(false);
const [error, setError] = useState<string | null>(null);
```

**Update handleSaveZone:**
```typescript
const handleSaveZone = async () => {
  if (!user || !suburbId) {
    setError('Please log in as HOA admin');
    return;
  }

  setIsSubmitting(true);
  setError(null);

  try {
    await createLocation({
      zoneName: formData.zoneName,
      suburbId,
      lat: 35.7810, // Would come from map selection
      lon: -78.6390,
      description: formData.zoneName,
      preferredTypes: formData.eventTypes,
      maxCapacity: formData.maxCapacity ? parseInt(formData.maxCapacity) : undefined,
      availableTimes: formData.availableTimes,
    });

    setView('success');
    setTimeout(() => {
      setView('list');
    }, 2000);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to create zone');
  } finally {
    setIsSubmitting(false);
  }
};
```

**Show real locations:**
```typescript
{isLoading ? (
  <div className="text-center py-4">Loading zones...</div>
) : (
  locations.map((zone) => (
    // ... existing zone card JSX
  ))
)}
```

---

### 9. ArtistDashboard (`components/ArtistDashboard.tsx`)

**Add imports:**
```typescript
import { useArtistDiscovery } from '@/hooks/useArtistDiscovery';
import { useHOALocations } from '@/hooks/useHOALocations';
```

**Fetch discovery data:**
```typescript
const { heatmap, isLoading, summary } = useArtistDiscovery();
const [selectedSuburb, setSelectedSuburb] = useState<string | null>(null);
const { locations: hoaLocations } = useHOALocations(selectedSuburb || undefined);
```

**Show real data:**
```typescript
{isLoading ? (
  <div className="text-center py-4">Loading opportunities...</div>
) : (
  <div>
    <p className="text-sm text-slate-600 mb-4">
      {summary.highOpportunitySuburbs} high-opportunity suburbs found
    </p>
    {/* Show heatmap items */}
  </div>
)}
```

---

### 10. ProfileScreen (`components/ProfileScreen.tsx`)

**Add imports:**
```typescript
import { useAuth } from '@/contexts/AuthContext';

interface ProfileScreenProps {
  onBack: () => void;
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  suburb: string;
}
```

**Get real user data:**
```typescript
const { user, logout } = useAuth();

// Update display:
<h3 className="text-slate-900 mb-2">{user?.name || 'Guest'}</h3>

// Wire up logout:
<button 
  onClick={logout}
  className="w-full flex items-center gap-3 p-4 hover:bg-red-50 rounded-xl transition-colors text-left"
>
  <LogOut className="w-5 h-5 text-red-500" />
  <span className="text-red-600">Log Out</span>
</button>
```

---

## Quick Start Checklist

### Setup
- [ ] Backend running on port 4000
- [ ] Frontend `.env.local` created with `NEXT_PUBLIC_API_URL`
- [ ] AuthProvider added to layout
- [ ] Test backend: `curl http://localhost:4000/health`

### Integration Order
1. [ ] Update App.tsx to fetch suburbs
2. [ ] Wire OnboardingLocation to find nearest suburb
3. [ ] Add suburbId prop throughout component tree
4. [ ] Wire MapView to show real events
5. [ ] Wire FeedView to show real events
6. [ ] Wire EventCreation to create events
7. [ ] Wire EventDetails to show event data
8. [ ] Wire HOADashboard to manage locations
9. [ ] Wire ArtistDashboard to show discovery
10. [ ] Wire ProfileScreen to show user data

### Testing
- [ ] Can signup/login
- [ ] Can view events for a suburb
- [ ] Can create an event
- [ ] Can join/leave an event
- [ ] HOA admin can create zones
- [ ] Artist can view discovery heatmap

## Common Patterns

### Adding Loading States
```typescript
{isLoading ? (
  <div className="text-center py-4">Loading...</div>
) : error ? (
  <div className="text-red-600 text-center py-4">{error}</div>
) : (
  // Your content
)}
```

### Error Handling
```typescript
try {
  await someApiCall();
} catch (err) {
  const message = err instanceof Error ? err.message : 'Operation failed';
  setError(message);
  // Or show toast notification
}
```

### Protected Actions
```typescript
const handleAction = () => {
  if (!user) {
    alert('Please log in first');
    return;
  }
  // Proceed with action
};
```

## Next Steps After Integration

1. **Add Geolocation**
   ```typescript
   navigator.geolocation.getCurrentPosition(
     (position) => {
       const { latitude, longitude } = position.coords;
       // Find nearest suburb
     }
   );
   ```

2. **Add Real Map**
   - Install Mapbox GL: `npm install mapbox-gl`
   - Or Google Maps: `npm install @vis.gl/react-google-maps`

3. **Add Notifications**
   - Toast library: `npm install sonner`
   - Show success/error messages

4. **Add Optimistic Updates**
   - Update UI before API response
   - Revert on error

5. **Add Caching**
   - Consider React Query for advanced caching
   - Or implement simple cache in hooks

