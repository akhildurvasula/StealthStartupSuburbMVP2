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
        className="backdrop-blur-xl bg-white/90 rounded-t-3xl shadow-2xl cursor-pointer border-t border-gray-200/50 transition-all duration-300 ease-in-out"
        style={{ 
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)'
        }}
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className={`w-12 h-1.5 rounded-full transition-colors duration-200 ${isExpanded ? 'bg-[#F6C56A]' : 'bg-gray-300'}`} />
        </div>
        <div className="px-6 pb-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#1C1C1E]">
              Events Near You
            </h3>
            <span className="text-sm font-semibold text-[#E8A34A] bg-[#F6C56A] bg-opacity-20 px-3 py-1 rounded-full">
              {events.length} {events.length === 1 ? 'event' : 'events'}
            </span>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div 
          className="backdrop-blur-xl bg-white/95 max-h-[60vh] overflow-y-auto transition-all duration-300 ease-in-out"
          style={{ 
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)'
          }}
        >
          <div className="px-6 pb-8 space-y-3">
            {events.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🌱</div>
                <p className="text-lg font-semibold text-gray-700">No events yet</p>
                <p className="text-sm text-gray-500 mt-2">
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
