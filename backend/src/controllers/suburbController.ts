import { Request, Response } from 'express';
import { z } from 'zod';
import supabase from '../utils/supabase';

const createSuburbSchema = z.object({
  name: z.string(),
  type: z.enum(['STARTER', 'ESTABLISHED', 'TIER_3']),
  lat: z.number(),
  lon: z.number(),
  population: z.number().optional(),
});

/**
 * GET /api/suburbs
 * Get all suburbs with their intelligence scores
 */
export async function getAllSuburbs(req: Request, res: Response) {
  try {
    const { data: suburbs, error } = await supabase
      .from('suburbs')
      .select(`
        *,
        suburb_scores(*)
      `)
      .order('name', { ascending: true });

    if (error) {
      console.error('Get suburbs error:', error);
      return res.status(500).json({ error: 'Failed to fetch suburbs' });
    }

    // Get counts for each suburb
    const suburbsWithIntelligence = await Promise.all((suburbs || []).map(async (suburb) => {
      const [eventsCount, usersCount] = await Promise.all([
        supabase.from('events').select('id', { count: 'exact', head: true }).eq('suburb_id', suburb.id),
        supabase.from('users').select('id', { count: 'exact', head: true }).eq('suburb_id', suburb.id),
      ]);

      const scores = suburb.suburb_scores?.[0] || {};

      return {
        id: suburb.id,
        name: suburb.name,
        type: suburb.type,
        coordinates: {
          lat: suburb.lat,
          lon: suburb.lon,
        },
        population: suburb.population,
        scores: {
          eventDensity: scores.event_density || 0,
          artistInterestScore: scores.artist_interest_score || 0,
          averageAttendance: scores.average_attendance || 0,
          lastCalculated: scores.last_calculated,
        },
        stats: {
          totalEvents: eventsCount.count || 0,
          totalResidents: usersCount.count || 0,
        },
      };
    }));

    res.json({
      suburbs: suburbsWithIntelligence,
      total: suburbsWithIntelligence.length,
    });
  } catch (error) {
    console.error('Get suburbs error:', error);
    res.status(500).json({ error: 'Failed to fetch suburbs' });
  }
}

/**
 * GET /api/suburbs/:id
 * Get single suburb with detailed intelligence layer
 */
export async function getSuburbById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const { data: suburb, error } = await supabase
      .from('suburbs')
      .select(`
        *,
        suburb_scores(*)
      `)
      .eq('id', id)
      .single();

    if (error || !suburb) {
      return res.status(404).json({ error: 'Suburb not found' });
    }

    // Get recent events (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: recentEvents } = await supabase
      .from('events')
      .select('id, title, date_time, category, actual_attendance')
      .eq('suburb_id', id)
      .gte('date_time', thirtyDaysAgo)
      .order('date_time', { ascending: false });

    // Get counts
    const [usersCount, eventsCount, hoasCount] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact', head: true }).eq('suburb_id', id),
      supabase.from('events').select('id', { count: 'exact', head: true }).eq('suburb_id', id),
      supabase.from('hoas').select('id', { count: 'exact', head: true }).eq('suburb_id', id),
    ]);

    // Calculate metrics
    const events = recentEvents || [];
    const avgRecentAttendance = events.length > 0
      ? events.reduce((sum, e) => sum + (e.actual_attendance || 0), 0) / events.length
      : 0;

    const eventsByCategory = events.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const scores = suburb.suburb_scores?.[0] || {};

    res.json({
      id: suburb.id,
      name: suburb.name,
      type: suburb.type,
      coordinates: {
        lat: suburb.lat,
        lon: suburb.lon,
      },
      population: suburb.population,
      scores: {
        eventDensity: scores.event_density || 0,
        artistInterestScore: scores.artist_interest_score || 0,
        averageAttendance: scores.average_attendance || 0,
        lastCalculated: scores.last_calculated,
      },
      intelligence: {
        totalResidents: usersCount.count || 0,
        totalEvents: eventsCount.count || 0,
        totalHOAs: hoasCount.count || 0,
        recentEvents: events.length,
        avgRecentAttendance,
        popularCategories: Object.entries(eventsByCategory)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([category, count]) => ({ category, count })),
      },
      recentEventsSample: events.slice(0, 5),
    });
  } catch (error) {
    console.error('Get suburb by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch suburb' });
  }
}

/**
 * POST /api/suburbs
 * Create a new suburb (admin use)
 */
export async function createSuburb(req: Request, res: Response) {
  try {
    const body = createSuburbSchema.parse(req.body);

    // Create suburb
    const { data: suburb, error: suburbError } = await supabase
      .from('suburbs')
      .insert({
        name: body.name,
        type: body.type,
        lat: body.lat,
        lon: body.lon,
        population: body.population,
      })
      .select()
      .single();

    if (suburbError || !suburb) {
      console.error('Create suburb error:', suburbError);
      return res.status(500).json({ error: 'Failed to create suburb' });
    }

    // Create initial scores
    await supabase
      .from('suburb_scores')
      .insert({
        suburb_id: suburb.id,
        event_density: 0,
        artist_interest_score: 0,
        average_attendance: 0,
      });

    res.status(201).json(suburb);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Create suburb error:', error);
    res.status(500).json({ error: 'Failed to create suburb' });
  }
}
