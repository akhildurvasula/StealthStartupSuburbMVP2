import { Router, Request, Response } from 'express';
import { findNearestNeighborhoodSegment } from '../db';

const router = Router();

/**
 * GET /suburb-info
 * Given lat/lon, return suburb info based on nearest NeighborhoodSegment
 */
router.get('/suburb-info', async (req: Request, res: Response) => {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lon = parseFloat(req.query.lon as string);

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({
        error: 'Invalid coordinates. Please provide valid lat and lon query parameters.',
      });
    }

    const segment = await findNearestNeighborhoodSegment(lat, lon);

    if (!segment) {
      return res.status(404).json({
        error: 'No neighborhood segment found for the provided coordinates.',
      });
    }

    // Return minimal info as specified in the API contract
    res.json({
      geoid: segment.geoid,
      suburbType: segment.suburbType,
      dominantCity: segment.dominantCity,
      lat: segment.lat,
      lon: segment.lon,
    });
  } catch (error) {
    console.error('Error in /suburb-info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

