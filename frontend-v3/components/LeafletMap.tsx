'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Event, InterestSignal } from '@/lib/types';

// Fix Leaflet icon issue with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Porchlight event marker icon (Gold)
const createEventIcon = () => {
  return L.divIcon({
    className: 'custom-event-marker',
    html: `
      <div class="relative">
        <div class="w-10 h-10 bg-[#F6C56A] rounded-full shadow-lg border-3 border-white flex items-center justify-center animate-pulse">
          <svg class="w-5 h-5 text-[#0D0D0F]" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="absolute -inset-2 bg-[#F6C56A] opacity-20 rounded-full blur-md -z-10"></div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

// Custom ghost pin icon (Semi-transparent Amber)
const createGhostIcon = () => {
  return L.divIcon({
    className: 'custom-ghost-marker',
    html: `
      <div class="relative">
        <div class="w-10 h-10 bg-[#E8A34A] bg-opacity-30 rounded-full shadow-md border-2 border-[#E8A34A] border-dashed border-opacity-50 flex items-center justify-center hover:bg-opacity-40 transition-all">
          <svg class="w-5 h-5 text-[#E8A34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div class="absolute -inset-2 bg-[#E8A34A] opacity-10 rounded-full blur-lg -z-10"></div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

interface LeafletMapProps {
  center: [number, number]; // [lng, lat]
  events: Event[];
  interestSignals: InterestSignal[];
  onEventClick: (eventId: string) => void;
  onSignalClick: (signalId: string) => void;
}

// Component to update map center
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView([center[1], center[0]], 13);
  }, [center, map]);
  
  return null;
}

export function LeafletMap({ center, events, interestSignals, onEventClick, onSignalClick }: LeafletMapProps) {
  // Leaflet uses [lat, lng] but we have [lng, lat]
  const leafletCenter: [number, number] = [center[1], center[0]];

  return (
    <MapContainer
      center={leafletCenter}
      zoom={13}
      style={{ height: '100%', width: '100%', minHeight: '500px' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapUpdater center={center} />
      
      {/* User location marker */}
      <Marker position={leafletCenter}>
        <Popup>You are here</Popup>
      </Marker>
      
      {/* Event markers - Porchlight Gold */}
      {events.map((event) => (
        <Marker
          key={event.id}
          position={[event.lat, event.lon]}
          icon={createEventIcon()}
          eventHandlers={{
            click: () => onEventClick(event.id),
          }}
        >
          <Popup className="porchlight-popup">
            <div className="text-sm p-2">
              <p className="font-bold text-[#1C1C1E] mb-1">{event.title}</p>
              <p className="text-xs text-[#3A3A3C]">{new Date(event.startTime).toLocaleString()}</p>
            </div>
          </Popup>
        </Marker>
      ))}
      
      {/* Interest signal markers (ghost pins) - Amber Halo */}
      {interestSignals.map((signal) => (
        <Marker
          key={signal.id}
          position={[signal.lat, signal.lon]}
          icon={createGhostIcon()}
          eventHandlers={{
            click: () => onSignalClick(signal.id),
          }}
        >
          <Popup className="porchlight-popup">
            <div className="text-sm p-2">
              <p className="font-bold text-[#1C1C1E] mb-1">💡 Interest Signal</p>
              <p className="text-xs text-[#E8A34A] font-medium">{signal.interestedCount} interested</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

