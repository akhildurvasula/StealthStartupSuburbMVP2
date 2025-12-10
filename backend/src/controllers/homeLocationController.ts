import { Request, Response } from 'express';
import { z } from 'zod';
import supabase from '../utils/supabase';
import { AuthRequest } from '../utils/auth';

const setHomeLocationSchema = z.object({
  lat: z.number(),
  lon: z.number(),
  visible: z.boolean().optional(),
});

const updateHomeLocationSchema = z.object({
  visible: z.boolean(),
});

/**
 * POST /api/home-location
 * Set or update user's home location
 */
export async function setHomeLocation(req: AuthRequest, res: Response) {
  try {
    const body = setHomeLocationSchema.parse(req.body);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if home location exists
    const { data: existing } = await supabase
      .from('user_home_locations')
      .select('id')
      .eq('user_id', userId)
      .single();

    let homeLocation;

    if (existing) {
      // Update
      const { data, error } = await supabase
        .from('user_home_locations')
        .update({
          lat: body.lat,
          lon: body.lon,
          ...(body.visible !== undefined && { visible: body.visible }),
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Update home location error:', error);
        return res.status(500).json({ error: 'Failed to update home location' });
      }

      homeLocation = data;
    } else {
      // Create
      const { data, error } = await supabase
        .from('user_home_locations')
        .insert({
          user_id: userId,
          lat: body.lat,
          lon: body.lon,
          visible: body.visible ?? true,
        })
        .select()
        .single();

      if (error) {
        console.error('Create home location error:', error);
        return res.status(500).json({ error: 'Failed to create home location' });
      }

      homeLocation = data;
    }

    res.json(homeLocation);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Set home location error:', error);
    res.status(500).json({ error: 'Failed to set home location' });
  }
}

/**
 * GET /api/home-location/:userId
 * Get user's home location (only if visible)
 */
export async function getHomeLocation(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    const { data: homeLocation, error } = await supabase
      .from('user_home_locations')
      .select(`
        *,
        user:users(id, name)
      `)
      .eq('user_id', userId)
      .single();

    if (error || !homeLocation) {
      return res.status(404).json({ error: 'Home location not found' });
    }

    // Only return location if it's visible
    if (!homeLocation.visible) {
      return res.status(403).json({ error: 'Home location is private' });
    }

    res.json(homeLocation);
  } catch (error) {
    console.error('Get home location error:', error);
    res.status(500).json({ error: 'Failed to get home location' });
  }
}

/**
 * PATCH /api/home-location
 * Update home location visibility
 */
export async function updateHomeLocation(req: AuthRequest, res: Response) {
  try {
    const body = updateHomeLocationSchema.parse(req.body);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: homeLocation, error } = await supabase
      .from('user_home_locations')
      .update({
        visible: body.visible,
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !homeLocation) {
      console.error('Update home location error:', error);
      return res.status(500).json({ error: 'Failed to update home location' });
    }

    res.json(homeLocation);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Update home location error:', error);
    res.status(500).json({ error: 'Failed to update home location' });
  }
}

/**
 * DELETE /api/home-location
 * Delete user's home location
 */
export async function deleteHomeLocation(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { error } = await supabase
      .from('user_home_locations')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Delete home location error:', error);
      return res.status(500).json({ error: 'Failed to delete home location' });
    }

    res.json({ message: 'Home location deleted successfully' });
  } catch (error) {
    console.error('Delete home location error:', error);
    res.status(500).json({ error: 'Failed to delete home location' });
  }
}
