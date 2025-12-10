// API Client for V3 Backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Helper for API calls
async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
}

// Suburb Info
export async function getSuburbInfo(lat: number, lon: number) {
  return apiCall<{
    geoid: string;
    suburbType: 'Inner-Ring Suburb' | 'General Suburb' | 'Exurban Suburb';
    dominantCity: 'Raleigh' | 'Durham' | 'Chapel Hill';
    lat: number;
    lon: number;
  }>(`/suburb-info?lat=${lat}&lon=${lon}`);
}

// Events
export async function getEvents(lat: number, lon: number, radiusKm: number = 10) {
  return apiCall<any[]>(`/events?lat=${lat}&lon=${lon}&radiusKm=${radiusKm}`);
}

export async function getEvent(id: string) {
  return apiCall<any>(`/events/${id}`);
}

export async function createEvent(data: {
  hostId: string;
  templateKey: string;
  title: string;
  description?: string;
  startTime: string;
  lat: number;
  lon: number;
}) {
  return apiCall<any>('/events', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function attendEvent(eventId: string, userId: string) {
  return apiCall<any>(`/events/${eventId}/attend`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
}

export async function leaveEvent(eventId: string, userId: string) {
  return apiCall<any>(`/events/${eventId}/leave`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
}

// Interest Signals
export async function getInterestSignals(lat: number, lon: number, radiusKm: number = 10) {
  return apiCall<any[]>(`/interest-signals?lat=${lat}&lon=${lon}&radiusKm=${radiusKm}`);
}

export async function createInterestSignal(data: {
  userId: string;
  templateKey: string;
  lat: number;
  lon: number;
}) {
  return apiCall<any>('/interest-signals', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function expressInterest(signalId: string, userId: string) {
  return apiCall<any>(`/interest-signals/${signalId}/interest`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
}

// Auth (simple for Alpha)
export async function signup(data: { email?: string; name?: string }) {
  return apiCall<{ user: any; token: string }>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function login(email: string) {
  return apiCall<{ user: any; token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

