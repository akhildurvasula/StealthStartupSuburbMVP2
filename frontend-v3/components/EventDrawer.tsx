'use client';

import { useState } from 'react';
import { Event } from '@/lib/types';
import { EventCard } from './EventCard';

interface EventDrawerProps {
  events: Event[];
  onEventClick: (eventId: string) => void;
}

export function EventDrawer({ events, onEventClick }: EventDrawerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      {/* Handle */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-white rounded-t-3xl shadow-2xl cursor-pointer"
      >
        <div className="flex justify-center pt-2 pb-3">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Events Near You
            </h3>
            <span className="text-sm text-gray-600">
              {events.length} {events.length === 1 ? 'event' : 'events'}
            </span>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="bg-white max-h-[60vh] overflow-y-auto">
          <div className="px-6 pb-6 space-y-3">
            {events.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">🌱</div>
                <p className="text-gray-600">No events yet</p>
                <p className="text-sm text-gray-500 mt-1">
                  Be the first to bring your suburb to life!
                </p>
              </div>
            ) : (
              events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={() => onEventClick(event.id)}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

