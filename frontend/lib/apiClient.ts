/**
 * API Client for Suburb Events Backend
 * Handles all HTTP requests with automatic auth token injection
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// ========== TYPE DEFINITIONS ==========

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'RESIDENT' | 'ARTIST' | 'HOA_ADMIN';
  suburbId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Suburb {
  id: string;
  name: string;
  type: 'STARTER' | 'ESTABLISHED' | 'TIER_3';
  coordinates: {
    lat: number;
    lon: number;
  };
  population: number | null;
  scores: SuburbScore;
  stats?: {
    totalEvents: number;
    totalResidents: number;
  };
}

export interface SuburbScore {
  eventDensity: number;
  artistInterestScore: number;
  averageAttendance: number;
  lastCalculated?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  hostId: string;
  hostType: 'RESIDENT' | 'ARTIST' | 'HOA';
  suburbId: string;
  locationLat: number;
  locationLon: number;
  dateTime: string;
  category: string;
  expectedCapacity?: number;
  actualAttendance: number;
  hoaLocationId?: string;
  createdAt: string;
  updatedAt: string;
  host?: {
    id: string;
    name: string;
    role: string;
  };
  suburb?: {
    id: string;
    name: string;
    type: string;
  };
  currentAttendance?: number;
}

export interface HOALocation {
  id: string;
  hoaId: string;
  suburbId: string;
  lat: number;
  lon: number;
  description?: string;
  preferredTypes: string[];
  maxCapacity?: number;
  availableTimes?: string;
  createdAt: string;
  updatedAt: string;
  hoa?: {
    id: string;
    name: string;
  };
  suburb?: {
    id: string;
    name: string;
    type: string;
  };
  totalEvents?: number;
}

export interface HomeLocation {
  id: string;
  userId: string;
  lat: number;
  lon: number;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ArtistDiscoveryItem {
  suburbId: string;
  suburbName: string;
  suburbType: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  metrics: {
    totalEventsLast30Days: number;
    artistEventsLast30Days: number;
    artistEventPercentage: number;
    averageAttendance: number;
    engagementScore: number;
  };
  hoaSuggestedLocations: Array<{
    id: string;
    coordinates: { lat: number; lon: number };
    description?: string;
    preferredTypes: string[];
    maxCapacity?: number;
  }>;
  popularCategories: Array<{
    category: string;
    count: number;
  }>;
  recentEventsSample: Array<{
    title: string;
    dateTime: string;
    category: string;
    attendance: number;
  }>;
}

// ========== HTTP CLIENT ==========

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthHeader(): Record<string, string> {
    if (typeof window === 'undefined') return {};
    
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async get<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async post<T>(path: string, body?: any, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async patch<T>(path: string, body?: any, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${path}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async del<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${path}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }
}

const client = new ApiClient(API_BASE_URL);

// ========== API FUNCTIONS ==========

// Auth
export async function signup(payload: {
  email: string;
  password: string;
  name: string;
  role?: 'RESIDENT' | 'ARTIST' | 'HOA_ADMIN';
  suburbId?: string;
}): Promise<{ user: User; token: string }> {
  return client.post('/auth/signup', payload);
}

export async function login(payload: {
  email: string;
  password: string;
}): Promise<{ user: User; token: string }> {
  return client.post('/auth/login', payload);
}

// Suburbs
export async function getSuburbs(): Promise<{ suburbs: Suburb[]; total: number }> {
  return client.get('/suburbs');
}

export async function getSuburb(id: string): Promise<Suburb> {
  return client.get(`/suburbs/${id}`);
}

// Events
export async function listEvents(params?: {
  suburbId?: string;
  category?: string;
  hostType?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}): Promise<{ events: Event[]; pagination: any }> {
  const queryParams = new URLSearchParams();
  if (params?.suburbId) queryParams.append('suburbId', params.suburbId);
  if (params?.category) queryParams.append('category', params.category);
  if (params?.hostType) queryParams.append('hostType', params.hostType);
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.offset) queryParams.append('offset', params.offset.toString());

  const query = queryParams.toString();
  return client.get(`/events${query ? `?${query}` : ''}`);
}

export async function getEvent(id: string): Promise<Event> {
  return client.get(`/events/${id}`);
}

export async function createEvent(payload: {
  title: string;
  description: string;
  hostType: 'RESIDENT' | 'ARTIST' | 'HOA';
  suburbId: string;
  locationLat: number;
  locationLon: number;
  dateTime: string;
  category: string;
  expectedCapacity?: number;
  hoaLocationId?: string;
}): Promise<Event> {
  return client.post('/events', payload);
}

export async function updateEvent(
  id: string,
  payload: {
    title?: string;
    description?: string;
    dateTime?: string;
    category?: string;
    expectedCapacity?: number;
  }
): Promise<Event> {
  return client.patch(`/events/${id}`, payload);
}

export async function deleteEvent(id: string): Promise<{ message: string }> {
  return client.del(`/events/${id}`);
}

export async function attendEvent(eventId: string): Promise<{ message: string }> {
  return client.post(`/events/${eventId}/attend`);
}

export async function leaveEvent(eventId: string): Promise<{ message: string }> {
  return client.post(`/events/${eventId}/leave`);
}

// HOA Locations
export async function getHOALocations(suburbId?: string): Promise<{
  locations: HOALocation[];
  total: number;
}> {
  const query = suburbId ? `?suburbId=${suburbId}` : '';
  return client.get(`/hoa-locations${query}`);
}

export async function getHOALocation(id: string): Promise<HOALocation> {
  return client.get(`/hoa-locations/${id}`);
}

export async function createHOALocation(payload: {
  hoaName?: string;
  suburbId: string;
  lat: number;
  lon: number;
  description?: string;
  preferredTypes: string[];
  maxCapacity?: number;
  availableTimes?: string;
}): Promise<HOALocation> {
  return client.post('/hoa-locations', payload);
}

export async function updateHOALocation(
  id: string,
  payload: {
    description?: string;
    preferredTypes?: string[];
    maxCapacity?: number;
    availableTimes?: string;
  }
): Promise<HOALocation> {
  return client.patch(`/hoa-locations/${id}`, payload);
}

export async function deleteHOALocation(id: string): Promise<{ message: string }> {
  return client.del(`/hoa-locations/${id}`);
}

// Artist Discovery
export async function getArtistDiscovery(): Promise<{
  heatmap: ArtistDiscoveryItem[];
  summary: {
    totalSuburbs: number;
    highOpportunitySuburbs: number;
    totalHOALocations: number;
  };
  generatedAt: string;
}> {
  return client.get('/artist/discovery');
}

// Home Locations
export async function setHomeLocation(payload: {
  lat: number;
  lon: number;
  visible?: boolean;
}): Promise<HomeLocation> {
  return client.post('/home-location', payload);
}

export async function getHomeLocation(userId: string): Promise<HomeLocation> {
  return client.get(`/home-location/${userId}`);
}

export async function updateHomeLocationVisibility(visible: boolean): Promise<HomeLocation> {
  return client.patch('/home-location', { visible });
}

export async function deleteHomeLocation(): Promise<{ message: string }> {
  return client.del('/home-location');
}

