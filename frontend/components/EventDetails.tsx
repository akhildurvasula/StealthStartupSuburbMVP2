'use client';

import { useState } from 'react';
import { ArrowLeft, MapPin, Calendar, Users, Share2, Wallet, Image as ImageIcon } from 'lucide-react';
import { mockEvents } from '@/lib/mockData';

interface EventDetailsProps {
  onBack: () => void;
  eventId: string | null;
  suburb: string;
}

export function EventDetails({ onBack, eventId, suburb }: EventDetailsProps) {
  const [isJoined, setIsJoined] = useState(false);
  const [addedToWallet, setAddedToWallet] = useState(false);

  const event = mockEvents.find(e => e.id === eventId) || mockEvents[0];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-white border-b border-slate-200">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <h3 className="text-slate-900">Event Details</h3>
        <button className="ml-auto w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors">
          <Share2 className="w-5 h-5 text-slate-700" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Event Image */}
        <div className="w-full h-64 bg-gradient-to-br from-sky-200 to-emerald-200 flex items-center justify-center">
          <Calendar className="w-16 h-16 text-white" />
        </div>

        {/* Event Info */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-slate-900 flex-1">{event.title}</h2>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm shrink-0 ml-2">
              {event.suburbType}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <div className={`w-3 h-3 rounded-full ${
              event.hostType === 'Resident' ? 'bg-blue-500' : 'bg-emerald-500'
            }`}></div>
            <span className="text-slate-600">{event.hostType} Event</span>
          </div>

          {/* Details Grid */}
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-slate-600">{event.time}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-slate-600">{suburb}</p>
                <p className="text-slate-500 text-sm">Exact location shared with attendees</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-slate-600">{event.attendees} attending</p>
                <p className="text-slate-500 text-sm">Expected: {event.expectedAttendance} people</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h4 className="text-slate-900 mb-2">About</h4>
            <p className="text-slate-600">{event.description}</p>
          </div>

          {/* Mini Map */}
          <div className="mb-6">
            <h4 className="text-slate-900 mb-3">Location</h4>
            <div className="w-full h-40 bg-gradient-to-br from-sky-100 to-emerald-100 rounded-xl relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className={`w-10 h-10 ${
                  event.hostType === 'Resident' ? 'bg-blue-500' : 'bg-emerald-500'
                } rounded-full flex items-center justify-center shadow-lg border-2 border-white`}>
                  <MapPin className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Attendees Preview */}
          <div className="mb-6">
            <h4 className="text-slate-900 mb-3">Attendees</h4>
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-300 to-sky-300 border-2 border-white"
                ></div>
              ))}
              <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center">
                <span className="text-xs text-slate-600">+{event.attendees - 5}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => setIsJoined(!isJoined)}
              className={`w-full py-4 rounded-xl transition-colors ${
                isJoined
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {isJoined ? 'Leave Event' : 'Join Event'}
            </button>

            {isJoined && (
              <>
                <button
                  onClick={() => setAddedToWallet(!addedToWallet)}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-colors ${
                    addedToWallet
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Wallet className="w-5 h-5" />
                  {addedToWallet ? 'Added to Apple Wallet' : 'Add to Apple Wallet'}
                </button>

                <button className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors">
                  <ImageIcon className="w-5 h-5" />
                  Shared Photo Album
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

