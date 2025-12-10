'use client';

import { Event } from '@/lib/types';
import { formatEventTime, getSuburbTypeColor } from '@/lib/utils';

interface EventCardProps {
  event: Event;
  onClick: () => void;
}

export function EventCard({ event, onClick }: EventCardProps) {
  const template = event.templateKey.replace(/_/g, ' ');
  
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{event.title}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {formatEventTime(event.startTime)}
          </p>
          {event.description && (
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">
              {event.description}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-3">
        <span className={`text-xs px-2 py-1 rounded-full ${getSuburbTypeColor(event.suburbType)}`}>
          {event.suburbType}
        </span>
        {event.attendeeCount !== undefined && (
          <span className="text-xs text-gray-600">
            {event.attendeeCount} {event.attendeeCount === 1 ? 'person' : 'people'} attending
          </span>
        )}
      </div>
    </div>
  );
}

