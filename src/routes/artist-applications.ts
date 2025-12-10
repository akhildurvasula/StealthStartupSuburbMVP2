import { Router, Request, Response } from 'express';
import { createArtistApplication, getArtistApplications, getUserById } from '../db';

const router = Router();

/**
 * POST /artist-applications
 * Artist applies to perform at an HOA zone
 */
router.post('/artist-applications', async (req: Request, res: Response) => {
  try {
    const { artistId, hoaZoneId, message } = req.body;

    // Validate required fields
    if (!artistId || !hoaZoneId) {
      return res.status(400).json({
        error: 'Missing required fields: artistId, hoaZoneId',
      });
    }

    // Validate user exists and is an artist
    const user = await getUserById(artistId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.role !== 'artist') {
      return res.status(403).json({ error: 'User must be an artist to create applications' });
    }

    // Create application
    const application = await createArtistApplication({
      artistId,
      hoaZoneId,
      message,
    });

    if (!application) {
      return res.status(500).json({ error: 'Failed to create artist application' });
    }

    res.status(201).json(application);
  } catch (error) {
    console.error('Error in POST /artist-applications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /artist-applications
 * Fetch artist applications with optional filters
 */
router.get('/artist-applications', async (req: Request, res: Response) => {
  try {
    const hoaZoneId = req.query.hoaZoneId as string | undefined;
    const artistId = req.query.artistId as string | undefined;

    const applications = await getArtistApplications({
      hoaZoneId,
      artistId,
    });

    res.json(applications);
  } catch (error) {
    console.error('Error in GET /artist-applications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

