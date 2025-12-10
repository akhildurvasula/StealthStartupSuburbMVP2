'use client';

import { useState, useEffect } from 'react';
import * as api from '@/lib/apiClient';
import type { HomeLocation } from '@/lib/apiClient';

export function useHomeLocation(userId: string | null) {
  const [location, setLocation] = useState<HomeLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchLocation = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await api.getHomeLocation(userId);
        setLocation(data);
      } catch (err) {
        // Not found is expected if user hasn't set location
        if (err instanceof Error && err.message.includes('404')) {
          setLocation(null);
        } else {
          const errorMessage = err instanceof Error ? err.message : 'Failed to fetch home location';
          setError(errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocation();
  }, [userId]);

  const setHomeLocation = async (payload: {
    lat: number;
    lon: number;
    visible?: boolean;
  }) => {
    try {
      const newLocation = await api.setHomeLocation(payload);
      setLocation(newLocation);
      return newLocation;
    } catch (err) {
      throw err;
    }
  };

  const updateVisibility = async (visible: boolean) => {
    try {
      const updatedLocation = await api.updateHomeLocationVisibility(visible);
      setLocation(updatedLocation);
      return updatedLocation;
    } catch (err) {
      throw err;
    }
  };

  const deleteLocation = async () => {
    try {
      await api.deleteHomeLocation();
      setLocation(null);
    } catch (err) {
      throw err;
    }
  };

  return {
    location,
    isLoading,
    error,
    setHomeLocation,
    updateVisibility,
    deleteLocation,
  };
}

