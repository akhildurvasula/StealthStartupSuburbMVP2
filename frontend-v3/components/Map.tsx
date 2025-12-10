'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { Event, InterestSignal } from '@/lib/types';

// Set your Mapbox token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface MapProps {
  center: [number, number]; // [lng, lat]
  events: Event[];
  interestSignals: InterestSignal[];
  onEventClick: (eventId: string) => void;
  onSignalClick: (signalId: string) => void;
}

export function Map({ center, events, interestSignals, onEventClick, onSignalClick }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center,
      zoom: 13,
    });

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update center when location changes
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    map.current.flyTo({ center, zoom: 13 });
  }, [center, mapLoaded]);

  // Add user location marker
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    new mapboxgl.Marker({ color: '#3b82f6' })
      .setLngLat(center)
      .addTo(map.current);
  }, [center, mapLoaded]);

  // Add event markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remove existing markers (simple approach for Alpha)
    const markers = document.querySelectorAll('.event-marker');
    markers.forEach(m => m.remove());

    events.forEach((event) => {
      const el = document.createElement('div');
      el.className = 'event-marker cursor-pointer';
      el.innerHTML = `
        <div class="bg-emerald-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
        </div>
      `;
      
      el.addEventListener('click', () => {
        onEventClick(event.id);
      });

      new mapboxgl.Marker({ element: el })
        .setLngLat([event.lon, event.lat])
        .addTo(map.current!);
    });
  }, [events, mapLoaded, onEventClick]);

  // Add interest signal markers (ghost pins)
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remove existing ghost markers
    const markers = document.querySelectorAll('.ghost-marker');
    markers.forEach(m => m.remove());

    interestSignals.forEach((signal) => {
      const el = document.createElement('div');
      el.className = 'ghost-marker cursor-pointer';
      el.innerHTML = `
        <div class="bg-gray-400 bg-opacity-40 text-gray-600 w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform border-2 border-dashed border-gray-400">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </div>
      `;
      
      el.addEventListener('click', () => {
        onSignalClick(signal.id);
      });

      new mapboxgl.Marker({ element: el })
        .setLngLat([signal.lon, signal.lat])
        .addTo(map.current!);
    });
  }, [interestSignals, mapLoaded, onSignalClick]);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    />
  );
}

