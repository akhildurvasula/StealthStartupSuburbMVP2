import { Router, Request, Response } from 'express';
import {
  createEvent,
  getEvents,
  getEventById,
  createOrUpdateAttendance,
  getUserById,
} from '../db';
import { findNearestNeighborhoodSegment } from '../db';

const router = Router();

/**
 * POST /events
 * Create a new event
 */
router.post('/events', async (req: Request, res: Response) => {
  try {
    const {
      hostId,
      hostType,
      title,
      description,
      startTime,
      endTime,
      lat,
      lon,
      category,
      expectedAttendance,
      hoaZoneId,
    } = req.body;

    // Validate required fields
    if (!hostId || !hostType || !title || !description || !startTime || !endTime || !lat || !lon || !category) {
      return res.status(400).json({
        error: 'Missing required fields',
      });
    }

    // Validate host exists
    const host = await getUserById(hostId);
    if (!host) {
      return res.status(404).json({ error: 'Host user not found' });
    }

    // Find nearest neighborhood segment to get suburb info
    const segment = await findNearestNeighborhoodSegment(lat, lon);
    if (!segment) {
      return res.status(404).json({
        error: 'Could not determine suburb information for the provided location',
      });
    }

    // Determine if hosted in HOA zone
    const hostedInHoaZone = !!hoaZoneId;

    // Create event
    const event = await createEvent({
      hostId,
      hostType,
      title,
      description,
      startTime,
      endTime,
      lat,
      lon,
      geoid: segment.geoid,
      suburbType: segment.suburbType,
      dominantCity: segment.dominantCity,
      category,
      expectedAttendance,
      hostedInHoaZone,
      hoaZoneId: hoaZoneId || undefined,
    });

    if (!event) {
      return res.status(500).json({ error: 'Failed to create event' });
    }

    res.status(201).json(event);
  } catch (error) {
    console.error('Error in POST /events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /events
 * Fetch events with optional filters
 */
router.get('/events', async (req: Request, res: Response) => {
  try {
    const lat = req.query.lat ? parseFloat(req.query.lat as string) : undefined;
    const lon = req.query.lon ? parseFloat(req.query.lon as string) : undefined;
    const radiusKm = req.query.radiusKm ? parseFloat(req.query.radiusKm as string) : undefined;
    const suburbType = req.query.suburbType as string | undefined;
    const city = req.query.city as string | undefined;

    // Validate radius query requires lat/lon
    if (radiusKm && (lat === undefined || lon === undefined)) {
      return res.status(400).json({
        error: 'lat and lon are required when using radiusKm',
      });
    }

    const events = await getEvents({
      lat,
      lon,
      radiusKm,
      suburbType,
      city,
    });

    // Return simplified event list
    const simplifiedEvents = events.map((event) => ({
      id: event.id,
      title: event.title,
      startTime: event.startTime,
      endTime: event.endTime,
      lat: event.lat,
      lon: event.lon,
      hostType: event.hostType,
      suburbType: event.suburbType,
      dominantCity: event.dominantCity,
    }));

    res.json(simplifiedEvents);
  } catch (error) {
    console.error('Error in GET /events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /events/:id/attend
 * User joins an event
 */
router.post('/events/:id/attend', async (req: Request, res: Response) => {
  try {
    const eventId = req.params.id;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Verify event exists
    const event = await getEventById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const attendance = await createOrUpdateAttendance(eventId, userId, 'joined');

    if (!attendance) {
      return res.status(500).json({ error: 'Failed to create attendance record' });
    }

    res.json({
      eventId: attendance.eventId,
      userId: attendance.userId,
      status: attendance.status,
    });
  } catch (error) {
    console.error('Error in POST /events/:id/attend:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /events/:id/leave
 * User leaves an event
 */
router.post('/events/:id/leave', async (req: Request, res: Response) => {
  try {
    const eventId = req.params.id;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Verify event exists
    const event = await getEventById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const attendance = await createOrUpdateAttendance(eventId, userId, 'left');

    if (!attendance) {
      return res.status(500).json({ error: 'Failed to update attendance record' });
    }

    res.json({
      eventId: attendance.eventId,
      userId: attendance.userId,
      status: attendance.status,
    });
  } catch (error) {
    console.error('Error in POST /events/:id/leave:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

