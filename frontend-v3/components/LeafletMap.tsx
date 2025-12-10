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
      
      {/* Event markers */}
      {events.map((event) => (
        <Marker
          key={event.id}
          position={[event.lat, event.lon]}
          eventHandlers={{
            click: () => onEventClick(event.id),
          }}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{event.title}</p>
              <p className="text-xs text-gray-600">{new Date(event.startTime).toLocaleString()}</p>
            </div>
          </Popup>
        </Marker>
      ))}
      
      {/* Interest signal markers (ghost pins) */}
      {interestSignals.map((signal) => (
        <Marker
          key={signal.id}
          position={[signal.lat, signal.lon]}
          opacity={0.6}
          eventHandlers={{
            click: () => onSignalClick(signal.id),
          }}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">💡 Interest Signal</p>
              <p className="text-xs text-gray-600">{signal.interestedCount} interested</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

