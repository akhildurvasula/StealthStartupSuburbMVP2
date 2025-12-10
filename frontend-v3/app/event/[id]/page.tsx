'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Event, MICRO_EVENT_TEMPLATES } from '@/lib/types';
import { Toast } from '@/components/Toast';
import * as api from '@/lib/api';
import { getUserId } from '@/lib/storage';
import { formatEventTime, getSuburbTypeColor } from '@/lib/utils';

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAttending, setIsAttending] = useState(false);
  const [attendeeCount, setAttendeeCount] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await api.getEvent(eventId);
        setEvent(data);
        setIsAttending(data.isUserAttending || false);
        setAttendeeCount(data.attendeeCount || 0);
      } catch (error) {
        console.error('Failed to fetch event:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleAttendToggle = async () => {
    if (!event) return;

    const userId = getUserId();

    try {
      if (isAttending) {
        await api.leaveEvent(eventId, userId);
        setIsAttending(false);
        setAttendeeCount(prev => prev - 1);
      } else {
        await api.attendEvent(eventId, userId);
        setIsAttending(true);
        setAttendeeCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to update attendance:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-gray-600">Event not found</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 text-emerald-600 hover:text-emerald-700"
          >
            ← Back to Map
          </button>
        </div>
      </div>
    );
  }

  const template = MICRO_EVENT_TEMPLATES.find(t => t.key === event.templateKey);

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      {/* Header with Porchlight branding */}
      <div className="bg-[#1C1C1E] px-6 py-4 sticky top-0 z-10 shadow-lg">
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#F6C56A] to-transparent"></div>
        <button
          onClick={() => router.push('/app')}
          className="flex items-center text-[#F5F5F7] hover:text-[#F6C56A] transition-colors font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Map
        </button>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        {/* Event Header - Porchlight Brand */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-6 border border-gray-100">
          <div className="flex items-start gap-5">
            <div className="text-6xl">{template?.emoji || '📍'}</div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-[#1C1C1E] mb-3 leading-tight">
                {event.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-[#3A3A3C] mb-3">
                <svg className="w-5 h-5 text-[#E8A34A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">
                  {formatEventTime(event.startTime)}
                  {event.endTime && ` - ${formatEventTime(event.endTime)}`}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-[#F6C56A] bg-opacity-20 text-[#E8A34A] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#F6C56A] border-opacity-30">
                  {event.suburbType}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  {event.dominantCity}
                </span>
              </div>
            </div>
          </div>

          {event.description && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-[#3A3A3C] leading-relaxed">{event.description}</p>
            </div>
          )}
        </div>

        {/* Attendance Info - Porchlight Brand */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#1C1C1E]">
              Attendance
            </h2>
            <div className="bg-gradient-to-br from-[#8BA989]/10 to-[#8BA989]/5 px-5 py-2 rounded-full border border-[#8BA989]/20">
              <span className="text-2xl font-bold text-[#8BA989]">
                {attendeeCount}
              </span>
            </div>
          </div>
          <p className="text-sm text-[#3A3A3C] font-medium">
            {attendeeCount === 0 && "✨ Be the first to join!"}
            {attendeeCount === 1 && "1 neighbor attending"}
            {attendeeCount > 1 && `${attendeeCount} neighbors attending`}
          </p>
        </div>

        {/* Mini Map */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6 border border-gray-100">
          <h2 className="text-xl font-bold text-[#1C1C1E] mb-4">
            Location
          </h2>
          <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center border border-gray-200">
            <div className="text-center">
              <div className="text-4xl mb-2">📍</div>
              <p className="text-sm text-[#3A3A3C] font-medium">
                {event.lat.toFixed(4)}, {event.lon.toFixed(4)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Walking distance from you</p>
            </div>
          </div>
        </div>

        {/* Join/Leave Button - Porchlight Brand */}
        <button
          onClick={handleAttendToggle}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-200 active:scale-98 shadow-lg hover:shadow-xl ${
            isAttending
              ? 'bg-[#3A3A3C] text-white hover:bg-[#1C1C1E]'
              : 'bg-[#F6C56A] text-[#0D0D0F] hover:bg-[#E8A34A]'
          }`}
        >
          {isAttending ? "✓ Leave Event" : "Join Event"}
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

