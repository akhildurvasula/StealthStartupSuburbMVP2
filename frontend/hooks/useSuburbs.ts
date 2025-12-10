'use client';

import { useState, useEffect } from 'react';
import * as api from '@/lib/apiClient';
import type { Suburb } from '@/lib/apiClient';

export function useSuburbs() {
  const [suburbs, setSuburbs] = useState<Suburb[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuburbs = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.getSuburbs();
      setSuburbs(response.suburbs);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch suburbs';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuburbs();
  }, []);

  return {
    suburbs,
    isLoading,
    error,
    refetch: fetchSuburbs,
  };
}

export function useSuburb(id: string | null) {
  const [suburb, setSuburb] = useState<Suburb | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchSuburb = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await api.getSuburb(id);
        setSuburb(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch suburb';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuburb();
  }, [id]);

  return {
    suburb,
    isLoading,
    error,
  };
}

