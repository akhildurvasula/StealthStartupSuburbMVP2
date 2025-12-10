'use client';

import { useState, useEffect, useCallback } from 'react';
import * as api from '@/lib/apiClient';
import type { HOALocation } from '@/lib/apiClient';

export function useHOALocations(suburbId?: string) {
  const [locations, setLocations] = useState<HOALocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.getHOALocations(suburbId);
      setLocations(response.locations);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch HOA locations';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [suburbId]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const createLocation = async (payload: {
    hoaName?: string;
    suburbId: string;
    lat: number;
    lon: number;
    description?: string;
    preferredTypes: string[];
    maxCapacity?: number;
    availableTimes?: string;
  }) => {
    try {
      const newLocation = await api.createHOALocation(payload);
      setLocations((prev) => [...prev, newLocation]);
      return newLocation;
    } catch (err) {
      throw err;
    }
  };

  const updateLocation = async (
    id: string,
    payload: {
      description?: string;
      preferredTypes?: string[];
      maxCapacity?: number;
      availableTimes?: string;
    }
  ) => {
    try {
      const updatedLocation = await api.updateHOALocation(id, payload);
      setLocations((prev) => prev.map((l) => (l.id === id ? updatedLocation : l)));
      return updatedLocation;
    } catch (err) {
      throw err;
    }
  };

  const deleteLocation = async (id: string) => {
    try {
      await api.deleteHOALocation(id);
      setLocations((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      throw err;
    }
  };

  return {
    locations,
    isLoading,
    error,
    refetch: fetchLocations,
    createLocation,
    updateLocation,
    deleteLocation,
  };
}

