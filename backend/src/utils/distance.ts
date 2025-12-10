/**
 * Calculate distance between two lat/lon points using Haversine formula
 * Returns distance in miles
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Find nearest suburb to a given lat/lon coordinate
 */
export function findNearestSuburb(
  lat: number,
  lon: number,
  suburbs: Array<{ id: string; lat: number; lon: number; name: string }>
): typeof suburbs[0] | null {
  if (suburbs.length === 0) return null;

  let nearest = suburbs[0];
  let minDistance = calculateDistance(lat, lon, nearest.lat, nearest.lon);

  for (const suburb of suburbs.slice(1)) {
    const distance = calculateDistance(lat, lon, suburb.lat, suburb.lon);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = suburb;
    }
  }

  return nearest;
}

