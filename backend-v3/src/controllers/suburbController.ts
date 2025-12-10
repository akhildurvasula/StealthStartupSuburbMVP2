import { Request, Response } from 'express';
import { z } from 'zod';
import { classifySuburb } from '../utils/suburbClassifier';

const suburbInfoSchema = z.object({
  lat: z.number(),
  lon: z.number(),
});

/**
 * GET /api/suburb-info
 * Given lat/lon, return the nearest suburb's identity
 */
export async function getSuburbInfo(req: Request, res: Response) {
  try {
    const { lat, lon } = suburbInfoSchema.parse({
      lat: parseFloat(req.query.lat as string),
      lon: parseFloat(req.query.lon as string),
    });

    const suburbInfo = await classifySuburb(lat, lon);

    if (!suburbInfo) {
      return res.status(404).json({ error: 'Could not classify suburb for this location' });
    }

    res.json(suburbInfo);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Get suburb info error:', error);
    res.status(500).json({ error: 'Failed to get suburb info' });
  }
}

