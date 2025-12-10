import { Router, Request, Response } from 'express';
import { createHOAZone, getHOAZones, getUserById } from '../db';
import { findNearestNeighborhoodSegment } from '../db';

const router = Router();

/**
 * POST /hoa-zones
 * Create a new HOA zone
 */
router.post('/hoa-zones', async (req: Request, res: Response) => {
  try {
    const {
      hoaUserId,
      name,
      lat,
      lon,
      radiusMeters,
      preferredEventTypes,
      maxCapacity,
      availableTimesJson,
    } = req.body;

    // Validate required fields
    if (!hoaUserId || !name || lat === undefined || lon === undefined || !radiusMeters) {
      return res.status(400).json({
        error: 'Missing required fields: hoaUserId, name, lat, lon, radiusMeters',
      });
    }

    // Validate user exists and is HOA admin
    const user = await getUserById(hoaUserId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.role !== 'hoa_admin') {
      return res.status(403).json({ error: 'User must be an HOA admin to create zones' });
    }

    // Find nearest neighborhood segment to get suburb info
    const segment = await findNearestNeighborhoodSegment(lat, lon);
    if (!segment) {
      return res.status(404).json({
        error: 'Could not determine suburb information for the provided location',
      });
    }

    // Create HOA zone
    const zone = await createHOAZone({
      hoaUserId,
      name,
      lat,
      lon,
      radiusMeters,
      geoid: segment.geoid,
      suburbType: segment.suburbType,
      dominantCity: segment.dominantCity,
      preferredEventTypes: preferredEventTypes || [],
      maxCapacity,
      availableTimesJson,
    });

    if (!zone) {
      return res.status(500).json({ error: 'Failed to create HOA zone' });
    }

    res.status(201).json(zone);
  } catch (error) {
    console.error('Error in POST /hoa-zones:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /hoa-zones
 * Fetch HOA zones with optional filters
 */
router.get('/hoa-zones', async (req: Request, res: Response) => {
  try {
    const suburbType = req.query.suburbType as string | undefined;
    const city = req.query.city as string | undefined;

    const zones = await getHOAZones({
      suburbType,
      city,
    });

    // Return simplified zone list
    const simplifiedZones = zones.map((zone) => ({
      id: zone.id,
      name: zone.name,
      lat: zone.lat,
      lon: zone.lon,
      radiusMeters: zone.radiusMeters,
      preferredEventTypes: zone.preferredEventTypes,
      suburbType: zone.suburbType,
      dominantCity: zone.dominantCity,
    }));

    res.json(simplifiedZones);
  } catch (error) {
    console.error('Error in GET /hoa-zones:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

