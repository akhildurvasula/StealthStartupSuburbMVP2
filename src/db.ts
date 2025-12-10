import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  User,
  NeighborhoodSegment,
  Event,
  HOAZone,
  EventAttendance,
  ArtistApplication,
} from './types';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase configuration. Please set SUPABASE_URL and SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY');
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

// Database helper functions

export async function findNearestNeighborhoodSegment(
  lat: number,
  lon: number
): Promise<NeighborhoodSegment | null> {
  // Use PostGIS distance calculation if available, otherwise calculate in application
  const { data, error } = await supabase
    .from('NeighborhoodSegment')
    .select('*');

  if (error || !data || data.length === 0) {
    console.error('Error fetching neighborhood segments:', error);
    return null;
  }

  // Calculate distance to each segment and find nearest
  let nearest: NeighborhoodSegment | null = null;
  let minDistance = Infinity;

  for (const segment of data) {
    const distance = haversineDistance(lat, lon, segment.lat, segment.lon);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = segment;
    }
  }

  return nearest;
}

// Haversine formula to calculate distance between two lat/lon points (in km)
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// User operations
export async function getUserById(id: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('User')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }
  return data;
}

// Event operations
export async function createEvent(eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event | null> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('Event')
    .insert({
      ...eventData,
      createdAt: now,
      updatedAt: now,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating event:', error);
    return null;
  }
  return data;
}

export async function getEvents(filters: {
  lat?: number;
  lon?: number;
  radiusKm?: number;
  suburbType?: string;
  city?: string;
}): Promise<Event[]> {
  let query = supabase.from('Event').select('*');

  if (filters.suburbType) {
    query = query.eq('suburbType', filters.suburbType);
  }

  if (filters.city) {
    query = query.eq('dominantCity', filters.city);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }

  if (!data) return [];

  // Filter by radius if lat/lon/radius provided
  if (filters.lat && filters.lon && filters.radiusKm) {
    return data.filter((event) => {
      const distance = haversineDistance(filters.lat!, filters.lon!, event.lat, event.lon);
      return distance <= filters.radiusKm!;
    });
  }

  return data;
}

export async function getEventById(id: string): Promise<Event | null> {
  const { data, error } = await supabase
    .from('Event')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching event:', error);
    return null;
  }
  return data;
}

// HOA Zone operations
export async function createHOAZone(
  zoneData: Omit<HOAZone, 'id' | 'createdAt' | 'updatedAt'>
): Promise<HOAZone | null> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('HOAZone')
    .insert({
      ...zoneData,
      createdAt: now,
      updatedAt: now,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating HOA zone:', error);
    return null;
  }
  return data;
}

export async function getHOAZones(filters: {
  suburbType?: string;
  city?: string;
}): Promise<HOAZone[]> {
  let query = supabase.from('HOAZone').select('*');

  if (filters.suburbType) {
    query = query.eq('suburbType', filters.suburbType);
  }

  if (filters.city) {
    query = query.eq('dominantCity', filters.city);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching HOA zones:', error);
    return [];
  }

  return data || [];
}

// Event Attendance operations
export async function createOrUpdateAttendance(
  eventId: string,
  userId: string,
  status: 'joined' | 'left'
): Promise<EventAttendance | null> {
  const now = new Date().toISOString();

  // Check if attendance record exists
  const { data: existing } = await supabase
    .from('EventAttendance')
    .select('*')
    .eq('eventId', eventId)
    .eq('userId', userId)
    .single();

  if (existing) {
    // Update existing record
    const { data, error } = await supabase
      .from('EventAttendance')
      .update({
        status,
        updatedAt: now,
      })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating attendance:', error);
      return null;
    }
    return data;
  } else {
    // Create new record
    const { data, error } = await supabase
      .from('EventAttendance')
      .insert({
        eventId,
        userId,
        status,
        createdAt: now,
        updatedAt: now,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating attendance:', error);
      return null;
    }
    return data;
  }
}

// Artist Application operations
export async function createArtistApplication(
  appData: Omit<ArtistApplication, 'id' | 'status' | 'createdAt' | 'updatedAt'>
): Promise<ArtistApplication | null> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('ArtistApplication')
    .insert({
      ...appData,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating artist application:', error);
    return null;
  }
  return data;
}

export async function getArtistApplications(filters: {
  hoaZoneId?: string;
  artistId?: string;
}): Promise<ArtistApplication[]> {
  let query = supabase.from('ArtistApplication').select('*');

  if (filters.hoaZoneId) {
    query = query.eq('hoaZoneId', filters.hoaZoneId);
  }

  if (filters.artistId) {
    query = query.eq('artistId', filters.artistId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching artist applications:', error);
    return [];
  }

  return data || [];
}

