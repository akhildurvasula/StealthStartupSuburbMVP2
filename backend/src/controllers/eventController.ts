import { Response } from 'express';
import { z } from 'zod';
import supabase from '../utils/supabase';
import { AuthRequest } from '../utils/auth';

const createEventSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  hostType: z.enum(['RESIDENT', 'ARTIST', 'HOA']),
  suburbId: z.string().uuid(),
  locationLat: z.number(),
  locationLon: z.number(),
  dateTime: z.string().datetime(),
  category: z.string(),
  expectedCapacity: z.number().optional(),
  hoaLocationId: z.string().uuid().optional(),
});

const updateEventSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  dateTime: z.string().datetime().optional(),
  category: z.string().optional(),
  expectedCapacity: z.number().optional(),
});

/**
 * GET /api/events
 * Get events with optional filters
 */
export async function getEvents(req: AuthRequest, res: Response) {
  try {
    const {
      suburbId,
      category,
      hostType,
      startDate,
      endDate,
      limit = '50',
      offset = '0',
    } = req.query;

    let query = supabase
      .from('events')
      .select(`
        *,
        host:users!events_host_id_fkey(id, name, role),
        suburb:suburbs(id, name, type),
        hoa_location:hoa_locations(id, description)
      `)
      .order('date_time', { ascending: true })
      .range(parseInt(offset as string), parseInt(offset as string) + parseInt(limit as string) - 1);

    if (suburbId) query = query.eq('suburb_id', suburbId);
    if (category) query = query.eq('category', category);
    if (hostType) query = query.eq('host_type', hostType);
    if (startDate) query = query.gte('date_time', startDate);
    if (endDate) query = query.lte('date_time', endDate);

    const { data: events, error, count } = await query;

    if (error) {
      console.error('Get events error:', error);
      return res.status(500).json({ error: 'Failed to fetch events' });
    }

    // Get attendance counts
    const eventsWithAttendance = await Promise.all((events || []).map(async (event) => {
      const { count } = await supabase
        .from('event_attendances')
        .select('id', { count: 'exact', head: true })
        .eq('event_id', event.id)
        .eq('status', 'JOINED');

      return {
        ...event,
        currentAttendance: count || 0,
      };
    }));

    res.json({
      events: eventsWithAttendance,
      pagination: {
        total: count || eventsWithAttendance.length,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      },
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
}

/**
 * GET /api/events/:id
 * Get single event with full details
 */
export async function getEventById(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    const { data: event, error } = await supabase
      .from('events')
      .select(`
        *,
        host:users!events_host_id_fkey(*),
        suburb:suburbs(*),
        hoa_location:hoa_locations(*)
      `)
      .eq('id', id)
      .single();

    if (error || !event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Get attendees
    const { data: attendances } = await supabase
      .from('event_attendances')
      .select(`
        *,
        user:users(id, name)
      `)
      .eq('event_id', id)
      .eq('status', 'JOINED');

    res.json({
      ...event,
      attendees: (attendances || []).map(a => a.user),
      currentAttendance: attendances?.length || 0,
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
}

/**
 * POST /api/events
 * Create a new event
 */
export async function createEvent(req: AuthRequest, res: Response) {
  try {
    const body = createEventSchema.parse(req.body);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: event, error } = await supabase
      .from('events')
      .insert({
        title: body.title,
        description: body.description,
        host_id: userId,
        host_type: body.hostType,
        suburb_id: body.suburbId,
        location_lat: body.locationLat,
        location_lon: body.locationLon,
        date_time: body.dateTime,
        category: body.category,
        expected_capacity: body.expectedCapacity,
        hoa_location_id: body.hoaLocationId,
        actual_attendance: 0,
      })
      .select(`
        *,
        host:users!events_host_id_fkey(id, name, role),
        suburb:suburbs(id, name, type)
      `)
      .single();

    if (error || !event) {
      console.error('Create event error:', error);
      return res.status(500).json({ error: 'Failed to create event' });
    }

    res.status(201).json(event);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
}

/**
 * PATCH /api/events/:id
 * Update an event
 */
export async function updateEvent(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const body = updateEventSchema.parse(req.body);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if user is the host
    const { data: event } = await supabase
      .from('events')
      .select('host_id')
      .eq('id', id)
      .single();

    if (!event || event.host_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this event' });
    }

    const updateData: any = {};
    if (body.title) updateData.title = body.title;
    if (body.description) updateData.description = body.description;
    if (body.dateTime) updateData.date_time = body.dateTime;
    if (body.category) updateData.category = body.category;
    if (body.expectedCapacity !== undefined) updateData.expected_capacity = body.expectedCapacity;

    const { data: updatedEvent, error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        host:users!events_host_id_fkey(id, name, role),
        suburb:suburbs(id, name, type)
      `)
      .single();

    if (error || !updatedEvent) {
      console.error('Update event error:', error);
      return res.status(500).json({ error: 'Failed to update event' });
    }

    res.json(updatedEvent);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
}

/**
 * DELETE /api/events/:id
 * Delete an event
 */
export async function deleteEvent(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if user is the host
    const { data: event } = await supabase
      .from('events')
      .select('host_id')
      .eq('id', id)
      .single();

    if (!event || event.host_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this event' });
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete event error:', error);
      return res.status(500).json({ error: 'Failed to delete event' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
}

/**
 * POST /api/events/:id/attend
 * Join an event
 */
export async function attendEvent(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if already attending
    const { data: existing } = await supabase
      .from('event_attendances')
      .select('id, status')
      .eq('event_id', id)
      .eq('user_id', userId)
      .single();

    if (existing && existing.status === 'JOINED') {
      return res.status(400).json({ error: 'Already attending this event' });
    }

    if (existing) {
      // Update status
      const { data, error } = await supabase
        .from('event_attendances')
        .update({ status: 'JOINED' })
        .eq('id', existing.id)
        .select()
        .single();

      if (error || !data) {
        return res.status(500).json({ error: 'Failed to join event' });
      }

      return res.json({ message: 'Joined event', attendance: data });
    }

    // Create new attendance
    const { data, error } = await supabase
      .from('event_attendances')
      .insert({
        event_id: id,
        user_id: userId,
        status: 'JOINED',
      })
      .select()
      .single();

    if (error || !data) {
      console.error('Attend event error:', error);
      return res.status(500).json({ error: 'Failed to join event' });
    }

    res.json({ message: 'Joined event', attendance: data });
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
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: existing } = await supabase
      .from('event_attendances')
      .select('id')
      .eq('event_id', id)
      .eq('user_id', userId)
      .single();

    if (!existing) {
      return res.status(400).json({ error: 'Not attending this event' });
    }

    const { error } = await supabase
      .from('event_attendances')
      .update({ status: 'LEFT' })
      .eq('id', existing.id);

    if (error) {
      console.error('Leave event error:', error);
      return res.status(500).json({ error: 'Failed to leave event' });
    }

    res.json({ message: 'Left event' });
  } catch (error) {
    console.error('Leave event error:', error);
    res.status(500).json({ error: 'Failed to leave event' });
  }
}
