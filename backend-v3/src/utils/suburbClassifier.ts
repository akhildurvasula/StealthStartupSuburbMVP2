import supabase from './supabase';
import { SuburbInfo } from '../types';

/**
 * Calculate distance between two lat/lon points using Haversine formula
 * Returns distance in kilometers
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Given a lat/lon, find the nearest neighborhood segment
 * Returns suburb classification info
 */
export async function classifySuburb(lat: number, lon: number): Promise<SuburbInfo | null> {
  try {
    // Get all neighborhood segments
    const { data: segments, error } = await supabase
      .from('neighborhood_segments')
      .select('*');

    if (error || !segments || segments.length === 0) {
      console.error('Error fetching neighborhood segments:', error);
      return null;
    }

    // Find nearest segment
    let nearestSegment = segments[0];
    let minDistance = calculateDistance(lat, lon, segments[0].lat, segments[0].lon);

    for (const segment of segments) {
      const distance = calculateDistance(lat, lon, segment.lat, segment.lon);
      if (distance < minDistance) {
        minDistance = distance;
        nearestSegment = segment;
      }
    }

    return {
      geoid: nearestSegment.geoid,
      suburbType: nearestSegment.suburb_type,
      dominantCity: nearestSegment.dominant_city,
      lat: nearestSegment.lat,
      lon: nearestSegment.lon,
    };
  } catch (error) {
    console.error('Error classifying suburb:', error);
    return null;
  }
}

