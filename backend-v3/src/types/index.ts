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
  distToRaleighMi: number;
  distToDurhamMi: number;
  distToChapelHillMi: number;
  dominantCity: 'Raleigh' | 'Durham' | 'Chapel Hill';
  popDensity: number;
  suburbType: 'Inner-Ring Suburb' | 'General Suburb' | 'Exurban Suburb';
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

