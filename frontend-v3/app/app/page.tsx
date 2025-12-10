'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { SuburbBanner } from '@/components/SuburbBanner';

// Load Leaflet Map component only on client side
const LeafletMap = dynamic(() => import('@/components/LeafletMap').then(mod => ({ default: mod.LeafletMap })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="text-4xl mb-2">🗺️</div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
});
import { EventDrawer } from '@/components/EventDrawer';
import { HostEventModal } from '@/components/HostEventModal';
import { InterestSignalModal } from '@/components/InterestSignalModal';
import { GhostPinPopover } from '@/components/GhostPinPopover';
import { Toast } from '@/components/Toast';
import { SuburbInfo, Event, InterestSignal } from '@/lib/types';
import * as api from '@/lib/api';
import { getUserId } from '@/lib/storage';

export default function Home() {
  const router = useRouter();
  
  // Location state
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [suburbInfo, setSuburbInfo] = useState<SuburbInfo | null>(null);
  
  // Data state
  const [events, setEvents] = useState<Event[]>([]);
  const [interestSignals, setInterestSignals] = useState<InterestSignal[]>([]);
  
  // UI state
  const [hostModalOpen, setHostModalOpen] = useState(false);
  const [interestModalOpen, setInterestModalOpen] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState<InterestSignal | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Request geolocation on mount
  useEffect(() => {
    // Set default location immediately (Chapel Hill)
    const defaultLocation: [number, number] = [-79.0558, 35.9132];
    setUserLocation(defaultLocation);
    
    // Then try to get actual location with timeout
    if ('geolocation' in navigator) {
      const timeoutId = setTimeout(() => {
        console.log('Geolocation timeout, using default location');
      }, 5000);
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeoutId);
          const { latitude, longitude } = position.coords;
          setUserLocation([longitude, latitude]);
          console.log('Got actual location:', longitude, latitude);
        },
        (error) => {
          clearTimeout(timeoutId);
          console.error('Geolocation error:', error);
        },
        { timeout: 5000, enableHighAccuracy: false }
      );
    }
  }, []);

  // Fetch suburb info when location is available
  useEffect(() => {
    if (!userLocation) return;

    const fetchSuburbInfo = async () => {
      try {
        const info = await api.getSuburbInfo(userLocation[1], userLocation[0]);
        setSuburbInfo(info);
      } catch (error) {
        console.error('Failed to fetch suburb info:', error);
        setToast({ message: 'Could not identify suburb', type: 'error' });
      }
    };

    fetchSuburbInfo();
  }, [userLocation]);

  // Fetch events and signals
  useEffect(() => {
    if (!userLocation) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [eventsData, signalsData] = await Promise.all([
          api.getEvents(userLocation[1], userLocation[0], 10),
          api.getInterestSignals(userLocation[1], userLocation[0], 10),
        ]);
        
        setEvents(eventsData);
        setInterestSignals(signalsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userLocation]);

  // Handle host event submission
  const handleHostEvent = async (data: {
    templateKey: string;
    title: string;
    description: string;
    startTime: string;
  }) => {
    if (!userLocation) return;

    try {
      const userId = getUserId();
      const newEvent = await api.createEvent({
        hostId: userId,
        templateKey: data.templateKey,
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        lat: userLocation[1],
        lon: userLocation[0],
      });

      // Optimistically add to events
      setEvents(prev => [...prev, newEvent]);
      setHostModalOpen(false);
      setToast({ message: 'Your event is live! 🎉', type: 'success' });
    } catch (error) {
      console.error('Failed to create event:', error);
      setToast({ message: 'Failed to create event', type: 'error' });
    }
  };

  // Handle interest signal creation
  const handleCreateSignal = async (templateKey: string) => {
    if (!userLocation) return;

    try {
      const userId = getUserId();
      const newSignal = await api.createInterestSignal({
        userId,
        templateKey,
        lat: userLocation[1],
        lon: userLocation[0],
      });

      // Add to signals
      setInterestSignals(prev => [...prev, newSignal]);
      setInterestModalOpen(false);
      setToast({ message: 'Interest signal created! 👻', type: 'success' });
    } catch (error) {
      console.error('Failed to create signal:', error);
      setToast({ message: 'Failed to create signal', type: 'error' });
    }
  };

  // Handle expressing interest in a signal
  const handleExpressInterest = async () => {
    if (!selectedSignal) return;

    try {
      const userId = getUserId();
      await api.expressInterest(selectedSignal.id, userId);

      // Update signal count
      setInterestSignals(prev =>
        prev.map(s =>
          s.id === selectedSignal.id
            ? { ...s, interestedCount: s.interestedCount + 1 }
            : s
        )
      );

      setSelectedSignal(null);
      setToast({ message: "Interest noted! We'll let others know.", type: 'success' });
    } catch (error) {
      console.error('Failed to express interest:', error);
      setToast({ message: 'Failed to express interest', type: 'error' });
    }
  };

  // Handle signal click
  const handleSignalClick = (signalId: string) => {
    const signal = interestSignals.find(s => s.id === signalId);
    if (signal) {
      setSelectedSignal(signal);
    }
  };

  if (!userLocation) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">🏡</div>
          <p className="text-gray-600">Getting your location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Suburb Banner */}
      <SuburbBanner suburbInfo={suburbInfo} />

      {/* Map */}
      <div className="flex-1 relative">
        <LeafletMap
          center={userLocation}
          events={events}
          interestSignals={interestSignals}
          onEventClick={(id) => router.push(`/event/${id}`)}
          onSignalClick={handleSignalClick}
        />

        {/* Floating Action Buttons - Porchlight Brand */}
        <div className="absolute bottom-32 right-6 flex flex-col gap-4">
          {/* Suggest Idea Button (Ghost Pin) */}
          <button
            onClick={() => setInterestModalOpen(true)}
            className="backdrop-blur-md bg-white/90 text-[#3A3A3C] w-16 h-16 rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-center border-2 border-[#E8A34A] border-opacity-40 border-dashed hover:border-solid hover:bg-[#F6C56A]/20 active:scale-95 group"
            title="Suggest an idea"
            style={{ 
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)'
            }}
          >
            <svg className="w-7 h-7 group-hover:text-[#E8A34A] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </button>

          {/* Host Event Button - Primary Gold */}
          <button
            onClick={() => setHostModalOpen(true)}
            className="bg-[#F6C56A] text-[#0D0D0F] w-16 h-16 rounded-full shadow-xl hover:shadow-2xl hover:bg-[#E8A34A] transition-all duration-200 flex items-center justify-center font-bold active:scale-95 animate-pulse hover:animate-none"
            title="Host event"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Event Drawer */}
      <EventDrawer
        events={events}
        onEventClick={(id) => router.push(`/event/${id}`)}
      />

      {/* Modals */}
      <HostEventModal
        isOpen={hostModalOpen}
        onClose={() => setHostModalOpen(false)}
        onSubmit={handleHostEvent}
      />

      <InterestSignalModal
        isOpen={interestModalOpen}
        onClose={() => setInterestModalOpen(false)}
        onSubmit={handleCreateSignal}
      />

      <GhostPinPopover
        signal={selectedSignal}
        onClose={() => setSelectedSignal(null)}
        onExpressInterest={handleExpressInterest}
      />

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

