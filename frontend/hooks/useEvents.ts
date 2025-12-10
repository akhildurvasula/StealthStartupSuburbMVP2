'use client';

import { useState, useEffect, useCallback } from 'react';
import * as api from '@/lib/apiClient';
import type { Event } from '@/lib/apiClient';

export function useEvents(suburbId?: string) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    if (!suburbId) {
      setEvents([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.listEvents({ suburbId });
      setEvents(response.events);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch events';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [suburbId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const createEvent = async (payload: {
    title: string;
    description: string;
    hostType: 'RESIDENT' | 'ARTIST' | 'HOA';
    suburbId: string;
    locationLat: number;
    locationLon: number;
    dateTime: string;
    category: string;
    expectedCapacity?: number;
    hoaLocationId?: string;
  }) => {
    try {
      const newEvent = await api.createEvent(payload);
      setEvents((prev) => [...prev, newEvent]);
      return newEvent;
    } catch (err) {
      throw err;
    }
  };

  const updateEvent = async (
    id: string,
    payload: {
      title?: string;
      description?: string;
      dateTime?: string;
      category?: string;
      expectedCapacity?: number;
    }
  ) => {
    try {
      const updatedEvent = await api.updateEvent(id, payload);
      setEvents((prev) => prev.map((e) => (e.id === id ? updatedEvent : e)));
      return updatedEvent;
    } catch (err) {
      throw err;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await api.deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      throw err;
    }
  };

  const attendEvent = async (eventId: string) => {
    try {
      await api.attendEvent(eventId);
      // Refresh events to get updated attendance
      await fetchEvents();
    } catch (err) {
      throw err;
    }
  };

  const leaveEvent = async (eventId: string) => {
    try {
      await api.leaveEvent(eventId);
      // Refresh events to get updated attendance
      await fetchEvents();
    } catch (err) {
      throw err;
    }
  };

  return {
    events,
    isLoading,
    error,
    refetch: fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    attendEvent,
    leaveEvent,
  };
}

export function useEvent(id: string | null) {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await api.getEvent(id);
        setEvent(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch event';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  return {
    event,
    isLoading,
    error,
  };
}

