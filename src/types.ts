// Type definitions matching the data models

export type UserRole = "resident" | "artist" | "hoa_admin";
export type HostType = "resident" | "hoa";
export type AttendanceStatus = "joined" | "left";
export type ApplicationStatus = "pending" | "approved" | "rejected";
export type DominantCity = "Raleigh" | "Durham" | "Chapel Hill";
export type SuburbType = "Inner-Ring Suburb" | "General Suburb" | "Exurban Suburb";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  homeLat?: number;
  homeLon?: number;
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
  dominantCity: DominantCity;
  popDensity: number;
  suburbType: SuburbType;
}

export interface Event {
  id: string;
  hostId: string;
  hostType: HostType;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  lat: number;
  lon: number;
  geoid: string;
  suburbType: string;
  dominantCity: string;
  category: string;
  expectedAttendance?: number;
  hostedInHoaZone: boolean;
  hoaZoneId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HOAZone {
  id: string;
  hoaUserId: string;
  name: string;
  lat: number;
  lon: number;
  radiusMeters: number;
  geoid: string;
  suburbType: string;
  dominantCity: string;
  preferredEventTypes: string[];
  maxCapacity?: number;
  availableTimesJson?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventAttendance {
  id: string;
  eventId: string;
  userId: string;
  status: AttendanceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ArtistApplication {
  id: string;
  artistId: string;
  hoaZoneId: string;
  message?: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

