import { Response } from 'express';
import { z } from 'zod';
import supabase from '../utils/supabase';
import { AuthRequest } from '../utils/auth';
import { classifySuburb } from '../utils/suburbClassifier';
import { calculateEndTime } from '../config/microEventTemplates';

const createEventSchema = z.object({
  hostId: z.string().uuid(),
  templateKey: z.string(),
  title: z.string(),
  description: z.string().optional(),
  startTime: z.string().datetime(),
  lat: z.number(),
  lon: z.number(),
});

/**
 * POST /api/events
 * Create a new micro-event
 */
export async function createEvent(req: AuthRequest, res: Response) {
  try {
    const body = createEventSchema.parse(req.body);

    // Classify suburb based on lat/lon
    const suburbInfo = await classifySuburb(body.lat, body.lon);
    
    if (!suburbInfo) {
      return res.status(400).json({ error: 'Could not classify location' });
    }

    // Calculate end time based on template
    const startTime = new Date(body.startTime);
    const endTime = calculateEndTime(startTime, body.templateKey);

    // Create event
    const { data: event, error } = await supabase
      .from('events')
      .insert({
        host_id: body.hostId,
        template_key: body.templateKey,
        title: body.title,
        description: body.description,
        start_time: body.startTime,
        end_time: endTime.toISOString(),
        lat: body.lat,
        lon: body.lon,
        geoid: suburbInfo.geoid,
        suburb_type: suburbInfo.suburbType,
        dominant_city: suburbInfo.dominantCity,
      })
      .select()
      .single();

    if (error || !event) {
      console.error('Create event error:', error);
      return res.status(500).json({ error: 'Failed to create event' });
    }

    res.status(201).json({
      id: event.id,
      hostId: event.host_id,
      templateKey: event.template_key,
      title: event.title,
      description: event.description,
      startTime: event.start_time,
      endTime: event.end_time,
      lat: event.lat,
      lon: event.lon,
      geoid: event.geoid,
      suburbType: event.suburb_type,
      dominantCity: event.dominant_city,
      createdAt: event.created_at,
      updatedAt: event.updated_at,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
}

/**
 * GET /api/events
 * Get events near a location
 */
export async function getEvents(req: AuthRequest, res: Response) {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lon = parseFloat(req.query.lon as string);
    const radiusKm = parseFloat(req.query.radiusKm as string) || 10;

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({ error: 'Invalid lat/lon' });
    }

    // Get all events (we'll filter by distance in-memory for Alpha)
    // In production, use PostGIS for efficient spatial queries
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .gte('start_time', new Date().toISOString())
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Get events error:', error);
      return res.status(500).json({ error: 'Failed to fetch events' });
    }

    // Filter by distance and get attendee counts
    const eventsWithAttendance = await Promise.all(
      (events || [])
        .filter(event => {
          const distance = calculateDistance(lat, lon, event.lat, event.lon);
          return distance <= radiusKm;
        })
        .map(async (event) => {
          const { count } = await supabase
            .from('event_attendance')
            .select('id', { count: 'exact', head: true })
            .eq('event_id', event.id)
            .eq('status', 'joined');

          return {
            id: event.id,
            title: event.title,
            templateKey: event.template_key,
            startTime: event.start_time,
            lat: event.lat,
            lon: event.lon,
            suburbType: event.suburb_type,
            dominantCity: event.dominant_city,
            attendeeCount: count || 0,
          };
        })
    );

    res.json(eventsWithAttendance);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
}

/**
 * GET /api/events/:id
 * Get single event details
 */
export async function getEventById(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const { data: event, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Get attendee count
    const { count } = await supabase
      .from('event_attendance')
      .select('id', { count: 'exact', head: true })
      .eq('event_id', id)
      .eq('status', 'joined');

    // Check if user is attending
    let isUserAttending = false;
    if (userId) {
      const { data: attendance } = await supabase
        .from('event_attendance')
        .select('id')
        .eq('event_id', id)
        .eq('user_id', userId)
        .eq('status', 'joined')
        .single();
      
      isUserAttending = !!attendance;
    }

    res.json({
      id: event.id,
      hostId: event.host_id,
      templateKey: event.template_key,
      title: event.title,
      description: event.description,
      startTime: event.start_time,
      endTime: event.end_time,
      lat: event.lat,
      lon: event.lon,
      geoid: event.geoid,
      suburbType: event.suburb_type,
      dominantCity: event.dominant_city,
      attendeeCount: count || 0,
      isUserAttending,
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
}

/**
 * POST /api/events/:id/attend
 * Join an event
 */
export async function attendEvent(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    // Check if already attending
    const { data: existing } = await supabase
      .from('event_attendance')
      .select('id')
      .eq('event_id', id)
      .eq('user_id', userId)
      .single();

    if (existing) {
      return res.status(400).json({ error: 'Already attending this event' });
    }

    // Create attendance
    const { data, error } = await supabase
      .from('event_attendance')
      .insert({
        event_id: id,
        user_id: userId,
        status: 'joined',
      })
      .select()
      .single();

    if (error || !data) {
      console.error('Attend event error:', error);
      return res.status(500).json({ error: 'Failed to join event' });
    }

    res.json({
      eventId: id,
      userId: userId,
      status: 'joined',
    });
  } catch (error) {
    console.error('Attend event error:', error);
    res.status(500).json({ error: 'Failed to join event' });
  }
}

/**
 * POST /api/events/:id/leave
 * Leave an event
 */
export async function leaveEvent(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const { error } = await supabase
      .from('event_attendance')
      .delete()
      .eq('event_id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Leave event error:', error);
      return res.status(500).json({ error: 'Failed to leave event' });
    }

    res.json({
      eventId: id,
      userId: userId,
      status: 'left',
    });
  } catch (error) {
    console.error('Leave event error:', error);
    res.status(500).json({ error: 'Failed to leave event' });
  }
}

// Helper function to calculate distance
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

