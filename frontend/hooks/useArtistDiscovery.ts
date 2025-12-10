'use client';

import { useState, useEffect } from 'react';
import * as api from '@/lib/apiClient';
import type { ArtistDiscoveryItem } from '@/lib/apiClient';

export function useArtistDiscovery() {
  const [heatmap, setHeatmap] = useState<ArtistDiscoveryItem[]>([]);
  const [summary, setSummary] = useState({
    totalSuburbs: 0,
    highOpportunitySuburbs: 0,
    totalHOALocations: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDiscovery = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.getArtistDiscovery();
      setHeatmap(response.heatmap);
      setSummary(response.summary);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch discovery data';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscovery();
  }, []);

  return {
    heatmap,
    summary,
    isLoading,
    error,
    refetch: fetchDiscovery,
  };
}

