'use client';

import { useState } from 'react';
import { Home, MapPin, Music, ChevronUp } from 'lucide-react';
import { mockEvents } from '@/lib/mockData';
import type { Screen, UserRole } from '@/types';

interface MapViewProps {
  navigateTo: (screen: Screen, eventId?: string) => void;
  suburb: string;
  userRole: UserRole;
}

export function MapView({ navigateTo, suburb, userRole }: MapViewProps) {
  const [drawerOpen, setDrawerOpen] = useState(true);

  return (
    <div className="relative h-full">
      {/* Map */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-100 to-emerald-100">
        {/* Map Pins */}
        <div className="absolute top-1/4 left-1/3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <Home className="w-5 h-5 text-white" />
          </div>
        </div>
        
        <div className="absolute top-1/2 right-1/4">
          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <MapPin className="w-5 h-5 text-white" />
          </div>
        </div>
        
        <div className="absolute bottom-1/3 left-1/4">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <Music className="w-5 h-5 text-white" />
          </div>
        </div>
        
        <div className="absolute top-1/3 right-1/3">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center border-2 border-emerald-500">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* User Location */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
        </div>
      </div>

      {/* Bottom Drawer */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl transition-transform duration-300 ${
          drawerOpen ? 'translate-y-0' : 'translate-y-[calc(100%-60px)]'
        }`}
      >
        {/* Drawer Handle */}
        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="w-full py-3 flex justify-center"
        >
          <div className={`w-12 h-1 bg-slate-300 rounded-full transition-transform ${drawerOpen ? '' : 'rotate-180'}`}></div>
        </button>

        {/* Drawer Content */}
        <div className="px-5 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900">Events Near You</h3>
            <ChevronUp
              className={`w-5 h-5 text-slate-400 transition-transform ${
                drawerOpen ? '' : 'rotate-180'
              }`}
            />
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {mockEvents.slice(0, 4).map((event) => (
              <button
                key={event.id}
                onClick={() => navigateTo('event-details', event.id)}
                className="w-full bg-slate-50 rounded-2xl p-4 hover:bg-slate-100 transition-colors text-left"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-slate-900">{event.title}</h4>
                  <span className="text-xs px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full shrink-0 ml-2">
                    {event.suburbType}
                  </span>
                </div>
                <p className="text-slate-600 text-sm mb-2">{event.time}</p>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    event.hostType === 'Resident' ? 'bg-blue-500' : 'bg-emerald-500'
                  }`}></div>
                  <span className="text-xs text-slate-500">{event.hostType}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

