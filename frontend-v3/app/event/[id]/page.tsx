'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Event, MICRO_EVENT_TEMPLATES } from '@/lib/types';
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <button
          onClick={() => router.push('/')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Map
        </button>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        {/* Event Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="text-5xl">{template?.emoji || '📍'}</div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {event.title}
              </h1>
              <p className="text-gray-600 mb-3">
                {formatEventTime(event.startTime)}
                {event.endTime && ` - ${formatEventTime(event.endTime)}`}
              </p>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-3 py-1 rounded-full ${getSuburbTypeColor(event.suburbType)}`}>
                  {event.suburbType}
                </span>
                <span className="text-xs text-gray-500">
                  {event.dominantCity}
                </span>
              </div>
            </div>
          </div>

          {event.description && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-gray-700">{event.description}</p>
            </div>
          )}
        </div>

        {/* Attendance Info */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Attendance
            </h2>
            <span className="text-2xl font-bold text-emerald-600">
              {attendeeCount}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {attendeeCount === 0 && "Be the first to join!"}
            {attendeeCount === 1 && "1 person attending"}
            {attendeeCount > 1 && `${attendeeCount} people attending`}
          </p>
        </div>

        {/* Mini Map */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Location
          </h2>
          <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl mb-2">📍</div>
              <p className="text-sm text-gray-600">
                {event.lat.toFixed(4)}, {event.lon.toFixed(4)}
              </p>
            </div>
          </div>
        </div>

        {/* Join/Leave Button */}
        <button
          onClick={handleAttendToggle}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-colors ${
            isAttending
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}
        >
          {isAttending ? "Leave Event" : "Join Event"}
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

