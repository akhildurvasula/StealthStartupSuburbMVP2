import { Request, Response } from 'express';
import supabase from '../utils/supabase';

/**
 * GET /api/artist/discovery
 * Returns heatmap data for artist discovery
 * Shows which suburbs have high demand for artists
 */
export async function getArtistDiscovery(req: Request, res: Response) {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // Get all suburbs
    const { data: suburbs, error: suburbsError } = await supabase
      .from('suburbs')
      .select(`
        *,
        suburb_scores(*)
      `);

    if (suburbsError || !suburbs) {
      console.error('Artist discovery error:', suburbsError);
      return res.status(500).json({ error: 'Failed to generate artist discovery data' });
    }

    // Process each suburb
    const discoveryData = await Promise.all(suburbs.map(async (suburb) => {
      // Get recent events
      const { data: recentEvents } = await supabase
        .from('events')
        .select('id, title, date_time, category, actual_attendance, host_type')
        .eq('suburb_id', suburb.id)
        .gte('date_time', thirtyDaysAgo);

      // Get HOA locations
      const { data: hoaLocations } = await supabase
        .from('hoa_locations')
        .select('id, lat, lon, description, preferred_types, max_capacity')
        .eq('suburb_id', suburb.id);

      // Get user count
      const { count: usersCount } = await supabase
        .from('users')
        .select('id', { count: 'exact', head: true })
        .eq('suburb_id', suburb.id);

      const events = recentEvents || [];
      const hoas = hoaLocations || [];
      const artistEvents = events.filter(e => e.host_type === 'ARTIST').length;
      const totalEvents = events.length;
      const hoaSuggestedLocations = hoas.length;

      // Calculate engagement score (0-100)
      const eventActivityScore = Math.min((totalEvents / 10) * 40, 40);
      const scores = suburb.suburb_scores?.[0] || {};
      const attendanceScore = Math.min(
        ((scores.average_attendance || 0) / 50) * 30,
        30
      );
      const hoaScore = Math.min((hoaSuggestedLocations / 3) * 20, 20);
      const populationScore = Math.min(((usersCount || 0) / 100) * 10, 10);

      const engagementScore = eventActivityScore + attendanceScore + hoaScore + populationScore;

      // Calculate category popularity
      const categoryBreakdown = events.reduce((acc, event) => {
        acc[event.category] = (acc[event.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        suburbId: suburb.id,
        suburbName: suburb.name,
        suburbType: suburb.type,
        coordinates: {
          lat: suburb.lat,
          lon: suburb.lon,
        },
        metrics: {
          totalEventsLast30Days: totalEvents,
          artistEventsLast30Days: artistEvents,
          artistEventPercentage: totalEvents > 0 ? (artistEvents / totalEvents) * 100 : 0,
          averageAttendance: scores.average_attendance || 0,
          engagementScore: Math.round(engagementScore),
        },
        hoaSuggestedLocations: hoas.map(loc => ({
          id: loc.id,
          coordinates: { lat: loc.lat, lon: loc.lon },
          description: loc.description,
          preferredTypes: loc.preferred_types,
          maxCapacity: loc.max_capacity,
        })),
        popularCategories: Object.entries(categoryBreakdown)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([category, count]) => ({ category, count })),
        recentEventsSample: events
          .slice(0, 3)
          .map(e => ({
            title: e.title,
            dateTime: e.date_time,
            category: e.category,
            attendance: e.actual_attendance,
          })),
      };
    }));

    // Sort by engagement score (highest first)
    const sortedData = discoveryData.sort((a, b) => 
      b.metrics.engagementScore - a.metrics.engagementScore
    );

    res.json({
      heatmap: sortedData,
      summary: {
        totalSuburbs: sortedData.length,
        highOpportunitySuburbs: sortedData.filter(s => s.metrics.engagementScore >= 60).length,
        totalHOALocations: sortedData.reduce((sum, s) => sum + s.hoaSuggestedLocations.length, 0),
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Artist discovery error:', error);
    res.status(500).json({ error: 'Failed to generate artist discovery data' });
  }
}
