'use client';

import { useState } from 'react';
import { Calendar, Wallet } from 'lucide-react';
import { mockEvents } from '@/lib/mockData';
import type { Screen } from '@/types';

interface FeedViewProps {
  navigateTo: (screen: Screen, eventId?: string) => void;
  suburb: string;
}

const filters = ['Today', 'This Weekend', 'Music', 'Fitness', 'Family', 'Workshop', 'Games'];

export function FeedView({ navigateTo, suburb }: FeedViewProps) {
  const [activeFilter, setActiveFilter] = useState('Today');
  const [addedEvents, setAddedEvents] = useState<string[]>([]);

  const toggleEventWallet = (eventId: string) => {
    setAddedEvents(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Filter Chips */}
      <div className="px-5 py-3 border-b border-slate-200 overflow-x-auto">
        <div className="flex gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                activeFilter === filter
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Event Feed */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="space-y-4">
          {mockEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-200"
            >
              {/* Event Image Placeholder */}
              <div className="w-full h-40 bg-gradient-to-br from-sky-200 to-emerald-200 flex items-center justify-center">
                <Calendar className="w-12 h-12 text-white" />
              </div>

              {/* Event Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-slate-900 flex-1">{event.title}</h4>
                  <span className="text-xs px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full shrink-0 ml-2">
                    {event.suburbType}
                  </span>
                </div>

                <p className="text-slate-600 text-sm mb-3">{event.time}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      event.hostType === 'Resident' ? 'bg-blue-500' : 'bg-emerald-500'
                    }`}></div>
                    <span className="text-xs text-slate-500">{event.hostType}</span>
                  </div>

                  <button
                    onClick={() => toggleEventWallet(event.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                      addedEvents.includes(event.id)
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Wallet className="w-4 h-4" />
                    <span className="text-sm">
                      {addedEvents.includes(event.id) ? 'Added' : 'Add to Wallet'}
                    </span>
                  </button>
                </div>

                <button
                  onClick={() => navigateTo('event-details', event.id)}
                  className="w-full mt-3 text-sky-600 hover:text-sky-700 text-sm"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

