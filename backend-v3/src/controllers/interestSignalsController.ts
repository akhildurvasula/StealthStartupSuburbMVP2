import { Response } from 'express';
import { z } from 'zod';
import supabase from '../utils/supabase';
import { AuthRequest } from '../utils/auth';
import { classifySuburb } from '../utils/suburbClassifier';

const createInterestSignalSchema = z.object({
  userId: z.string(), // Any string ID for Alpha (not just UUID)
  templateKey: z.string(),
  lat: z.number(),
  lon: z.number(),
});

/**
 * POST /api/interest-signals
 * Create a new interest signal (ghost pin)
 */
export async function createInterestSignal(req: AuthRequest, res: Response) {
  try {
    const body = createInterestSignalSchema.parse(req.body);

    // Classify suburb
    const suburbInfo = await classifySuburb(body.lat, body.lon);
    
    if (!suburbInfo) {
      return res.status(400).json({ error: 'Could not classify location' });
    }

    // Set expiry to 24 hours from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Create interest signal
    const { data: signal, error } = await supabase
      .from('interest_signals')
      .insert({
        user_id: body.userId,
        template_key: body.templateKey,
        lat: body.lat,
        lon: body.lon,
        geoid: suburbInfo.geoid,
        suburb_type: suburbInfo.suburbType,
        dominant_city: suburbInfo.dominantCity,
        interested_count: 1,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (error || !signal) {
      console.error('Create interest signal error:', error);
      return res.status(500).json({ error: 'Failed to create interest signal' });
    }

    // Also create the user association
    await supabase
      .from('interest_signal_users')
      .insert({
        signal_id: signal.id,
        user_id: body.userId,
      });

    res.status(201).json({
      id: signal.id,
      userId: signal.user_id,
      templateKey: signal.template_key,
      lat: signal.lat,
      lon: signal.lon,
      geoid: signal.geoid,
      suburbType: signal.suburb_type,
      dominantCity: signal.dominant_city,
      interestedCount: signal.interested_count,
      expiresAt: signal.expires_at,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    console.error('Create interest signal error:', error);
    res.status(500).json({ error: 'Failed to create interest signal' });
  }
}

/**
 * GET /api/interest-signals
 * Get interest signals near a location (ghost pins on map)
 */
export async function getInterestSignals(req: AuthRequest, res: Response) {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lon = parseFloat(req.query.lon as string);
    const radiusKm = parseFloat(req.query.radiusKm as string) || 10;

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({ error: 'Invalid lat/lon' });
    }

    // Get all non-expired signals
    const { data: signals, error } = await supabase
      .from('interest_signals')
      .select('*')
      .gt('expires_at', new Date().toISOString());

    if (error) {
      console.error('Get interest signals error:', error);
      return res.status(500).json({ error: 'Failed to fetch interest signals' });
    }

    // Filter by distance
    const nearbySignals = (signals || [])
      .filter(signal => {
        const distance = calculateDistance(lat, lon, signal.lat, signal.lon);
        return distance <= radiusKm;
      })
      .map(signal => ({
        id: signal.id,
        templateKey: signal.template_key,
        lat: signal.lat,
        lon: signal.lon,
        suburbType: signal.suburb_type,
        dominantCity: signal.dominant_city,
        interestedCount: signal.interested_count,
        expiresAt: signal.expires_at,
      }));

    res.json(nearbySignals);
  } catch (error) {
    console.error('Get interest signals error:', error);
    res.status(500).json({ error: 'Failed to fetch interest signals' });
  }
}

/**
 * POST /api/interest-signals/:id/interest
 * Express interest in a signal (neighbor taps "I'm interested")
 */
export async function expressInterest(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    // Check if user already expressed interest
    const { data: existing } = await supabase
      .from('interest_signal_users')
      .select('id')
      .eq('signal_id', id)
      .eq('user_id', userId)
      .single();

    if (existing) {
      return res.status(400).json({ error: 'Already expressed interest' });
    }

    // Add user to signal
    await supabase
      .from('interest_signal_users')
      .insert({
        signal_id: id,
        user_id: userId,
      });

    // Increment interested count
    const { data: signal, error } = await supabase
      .from('interest_signals')
      .update({
        interested_count: supabase.sql`interested_count + 1`,
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !signal) {
      console.error('Express interest error:', error);
      return res.status(500).json({ error: 'Failed to express interest' });
    }

    res.json({
      id: signal.id,
      interestedCount: signal.interested_count,
    });
  } catch (error) {
    console.error('Express interest error:', error);
    res.status(500).json({ error: 'Failed to express interest' });
  }
}

// Helper function
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

