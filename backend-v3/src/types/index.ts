// Core Types for V3 Alpha

export interface User {
  id: string;
  email?: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NeighborhoodSegment {
  geoid: string;
  county: string;
  name: string;
  lat: number;
  lon: number;
  dist_to_raleigh_mi: number;
  dist_to_durham_mi: number;
  dist_to_chapelhill_mi: number;
  dominant_city: 'Raleigh' | 'Durham' | 'Chapel Hill';
  pop_density: number;
  suburb_type: 'Inner-Ring Suburb' | 'General Suburb' | 'Exurban Suburb';
}

export interface Event {
  id: string;
  hostId: string;
  templateKey: string;
  title: string;
  description?: string;
  startTime: string;
  endTime?: string;
  lat: number;
  lon: number;
  geoid: string;
  suburbType: string;
  dominantCity: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventAttendance {
  id: string;
  eventId: string;
  userId: string;
  status: 'joined';
  createdAt: string;
}

export interface InterestSignal {
  id: string;
  userId: string;
  templateKey: string;
  lat: number;
  lon: number;
  geoid: string;
  suburbType: string;
  dominantCity: string;
  interestedCount: number;
  expiresAt: string;
  createdAt: string;
}

export interface SuburbInfo {
  geoid: string;
  suburbType: string;
  dominantCity: string;
  lat: number;
  lon: number;
}

