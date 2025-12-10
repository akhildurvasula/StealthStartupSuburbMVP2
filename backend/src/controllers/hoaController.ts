import { Response } from 'express';
import { z } from 'zod';
import supabase from '../utils/supabase';
import { AuthRequest } from '../utils/auth';

const createHOALocationSchema = z.object({
  hoaName: z.string().optional(),
  suburbId: z.string().uuid(),
  lat: z.number(),
  lon: z.number(),
  description: z.string().optional(),
  preferredTypes: z.array(z.string()),
  maxCapacity: z.number().optional(),
  availableTimes: z.string().optional(),
});

const updateHOALocationSchema = z.object({
  description: z.string().optional(),
  preferredTypes: z.array(z.string()).optional(),
  maxCapacity: z.number().optional(),
  availableTimes: z.string().optional(),
});

/**
 * GET /api/hoa-locations
 * Get all HOA locations with optional suburb filter
 */
export async function getHOALocations(req: AuthRequest, res: Response) {
  try {
    const { suburbId } = req.query;

    let query = supabase
      .from('hoa_locations')
      .select(`
        *,
        hoa:hoas(id, name, admin:users(id, name)),
        suburb:suburbs(id, name, type)
      `)
      .order('created_at', { ascending: false });

    if (suburbId) {
      query = query.eq('suburb_id', suburbId);
    }

    const { data: locations, error } = await query;

    if (error) {
      console.error('Get HOA locations error:', error);
      return res.status(500).json({ error: 'Failed to fetch HOA locations' });
    }

    // Get event counts for each location
    const locationsWithStats = await Promise.all((locations || []).map(async (location) => {
      const { count } = await supabase
        .from('events')
        .select('id', { count: 'exact', head: true })
        .eq('hoa_location_id', location.id);

      return {
        id: location.id,
        hoa: location.hoa,
        suburb: location.suburb,
        coordinates: {
          lat: location.lat,
          lon: location.lon,
        },
        description: location.description,
        preferredTypes: location.preferred_types,
        maxCapacity: location.max_capacity,
        availableTimes: location.available_times,
        totalEvents: count || 0,
        createdAt: location.created_at,
      };
    }));

    res.json({
      locations: locationsWithStats,
      total: locationsWithStats.length,
    });
  } catch (error) {
    console.error('Get HOA locations error:', error);
    res.status(500).json({ error: 'Failed to fetch HOA locations' });
  }
}

/**
 * GET /api/hoa-locations/:id
 * Get single HOA location with details
 */
export async function getHOALocationById(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    const { data: location, error } = await supabase
      .from('hoa_locations')
      .select(`
        *,
        hoa:hoas(*, admin:users(id, name, email)),
        suburb:suburbs(*)
      `)
      .eq('id', id)
      .single();

    if (error || !location) {
      return res.status(404).json({ error: 'HOA location not found' });
    }

    // Get events at this location
    const { data: events } = await supabase
      .from('events')
      .select('id, title, date_time, category, actual_attendance')
      .eq('hoa_location_id', id)
      .order('date_time', { ascending: false })
      .limit(10);

    res.json({
      ...location,
      recentEvents: events || [],
    });
  } catch (error) {
    console.error('Get HOA location error:', error);
    res.status(500).json({ error: 'Failed to fetch HOA location' });
  }
}

/**
 * POST /api/hoa-locations
 * Create a new HOA location
 */
export async function createHOALocation(req: AuthRequest, res: Response) {
  try {
    const body = createHOALocationSchema.parse(req.body);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if user is HOA admin
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (!user || user.role !== 'HOA_ADMIN') {
      return res.status(403).json({ error: 'Only HOA admins can create locations' });
    }

    // Find or create HOA
    let hoaId: string;
    
    if (body.hoaName) {
      // Check if HOA exists
      const { data: existingHOA } = await supabase
        .from('hoas')
        .select('id')
        .eq('name', body.hoaName)
        .eq('admin_id', userId)
        .single();

      if (existingHOA) {
        hoaId = existingHOA.id;
      } else {
        // Create new HOA
        const { data: newHOA, error: hoaError } = await supabase
          .from('hoas')
          .insert({
            name: body.hoaName,
            admin_id: userId,
            suburb_id: body.suburbId,
          })
          .select('id')
          .single();

        if (hoaError || !newHOA) {
          return res.status(500).json({ error: 'Failed to create HOA' });
        }

        hoaId = newHOA.id;
      }
    } else {
      // Get user's default HOA or create one
      const { data: userHOA } = await supabase
        .from('hoas')
        .select('id')
        .eq('admin_id', userId)
        .limit(1)
        .single();

      if (userHOA) {
        hoaId = userHOA.id;
      } else {
        const { data: newHOA, error: hoaError } = await supabase
          .from('hoas')
          .insert({
            name: 'My HOA',
            admin_id: userId,
            suburb_id: body.suburbId,
          })
          .select('id')
          .single();

        if (hoaError || !newHOA) {
          return res.status(500).json({ error: 'Failed to create HOA' });
        }

        hoaId = newHOA.id;
      }
    }

    // Create HOA location
    const { data: location, error } = await supabase
      .from('hoa_locations')
      .insert({
        hoa_id: hoaId,
        suburb_id: body.suburbId,
        lat: body.lat,
        lon: body.lon,
        description: body.description,
        preferred_types: body.preferredTypes,
        max_capacity: body.maxCapacity,
        available_times: body.availableTimes,
      })
      .select(`
        *,
        hoa:hoas(*),
        suburb:suburbs(*)
      `)
      .single();

    if (error || !location) {
      console.error('Create HOA location error:', error);
      return res.status(500).json({ error: 'Failed to create HOA location' });
    }

    res.status(201).json(location);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Create HOA location error:', error);
    res.status(500).json({ error: 'Failed to create HOA location' });
  }
}

/**
 * PATCH /api/hoa-locations/:id
 * Update an HOA location
 */
export async function updateHOALocation(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const body = updateHOALocationSchema.parse(req.body);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if user owns this location
    const { data: location } = await supabase
      .from('hoa_locations')
      .select('hoa:hoas(admin_id)')
      .eq('id', id)
      .single();

    if (!location || location.hoa.admin_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this location' });
    }

    const updateData: any = {};
    if (body.description !== undefined) updateData.description = body.description;
    if (body.preferredTypes) updateData.preferred_types = body.preferredTypes;
    if (body.maxCapacity !== undefined) updateData.max_capacity = body.maxCapacity;
    if (body.availableTimes !== undefined) updateData.available_times = body.availableTimes;

    const { data: updatedLocation, error } = await supabase
      .from('hoa_locations')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        hoa:hoas(*),
        suburb:suburbs(*)
      `)
      .single();

    if (error || !updatedLocation) {
      console.error('Update HOA location error:', error);
      return res.status(500).json({ error: 'Failed to update HOA location' });
    }

    res.json(updatedLocation);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Update HOA location error:', error);
    res.status(500).json({ error: 'Failed to update HOA location' });
  }
}

/**
 * DELETE /api/hoa-locations/:id
 * Delete an HOA location
 */
export async function deleteHOALocation(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if user owns this location
    const { data: location } = await supabase
      .from('hoa_locations')
      .select('hoa:hoas(admin_id)')
      .eq('id', id)
      .single();

    if (!location || location.hoa.admin_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this location' });
    }

    const { error } = await supabase
      .from('hoa_locations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete HOA location error:', error);
      return res.status(500).json({ error: 'Failed to delete HOA location' });
    }

    res.json({ message: 'HOA location deleted successfully' });
  } catch (error) {
    console.error('Delete HOA location error:', error);
    res.status(500).json({ error: 'Failed to delete HOA location' });
  }
}
