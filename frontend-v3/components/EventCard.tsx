'use client';

import { Event } from '@/lib/types';
import { formatEventTime } from '@/lib/utils';

interface EventCardProps {
  event: Event;
  onClick: () => void;
}

export function EventCard({ event, onClick }: EventCardProps) {
  const template = event.templateKey.replace(/_/g, ' ');
  
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-100 rounded-2xl p-5 cursor-pointer hover:shadow-xl hover:border-[#F6C56A] transition-all duration-200 group active:scale-[0.98]"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-[#1C1C1E] group-hover:text-[#E8A34A] transition-colors">
            {event.title}
          </h3>
          <p className="text-sm text-[#3A3A3C] mt-1 font-medium">
            {formatEventTime(event.startTime)}
          </p>
          {event.description && (
            <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">
              {event.description}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-3 mt-4">
        <span className="bg-[#F6C56A] bg-opacity-20 text-[#E8A34A] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#F6C56A] border-opacity-30 capitalize">
          {template}
        </span>
        {event.attendeeCount !== undefined && event.attendeeCount > 0 && (
          <span className="flex items-center gap-1.5 text-xs text-[#8BA989] font-medium">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {event.attendeeCount}
          </span>
        )}
      </div>
    </div>
  );
}
