'use client';

import { useState } from 'react';
import { OnboardingWelcome } from './OnboardingWelcome';
import { OnboardingLocation } from './OnboardingLocation';
import { SuburbIdentified } from './SuburbIdentified';
import { HomeScreen } from './HomeScreen';
import { EventCreation } from './EventCreation';
import { HOADashboard } from './HOADashboard';
import { ArtistDashboard } from './ArtistDashboard';
import { EventDetails } from './EventDetails';
import { ProfileScreen } from './ProfileScreen';
import type { Screen, UserRole } from '@/types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding-welcome');
  const [userRole, setUserRole] = useState<UserRole>('resident');
  const [suburb, setSuburb] = useState('Inner-Ring Raleigh');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const navigateTo = (screen: Screen, eventId?: string) => {
    if (eventId) setSelectedEventId(eventId);
    setCurrentScreen(screen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Mobile Frame */}
      <div className="w-full max-w-[390px] h-[844px] bg-white rounded-3xl shadow-2xl overflow-hidden relative">
        {currentScreen === 'onboarding-welcome' && (
          <OnboardingWelcome onNext={() => navigateTo('onboarding-location')} />
        )}
        
        {currentScreen === 'onboarding-location' && (
          <OnboardingLocation 
            onNext={(suburbName) => {
              setSuburb(suburbName);
              navigateTo('suburb-identified');
            }} 
          />
        )}
        
        {currentScreen === 'suburb-identified' && (
          <SuburbIdentified 
            suburb={suburb}
            onContinue={() => navigateTo('home')} 
          />
        )}
        
        {currentScreen === 'home' && (
          <HomeScreen 
            navigateTo={navigateTo}
            suburb={suburb}
            userRole={userRole}
          />
        )}
        
        {currentScreen === 'event-creation' && (
          <EventCreation 
            onBack={() => navigateTo('home')}
            suburb={suburb}
          />
        )}
        
        {currentScreen === 'hoa-dashboard' && (
          <HOADashboard 
            onBack={() => navigateTo('home')}
            suburb={suburb}
          />
        )}
        
        {currentScreen === 'artist-dashboard' && (
          <ArtistDashboard 
            onBack={() => navigateTo('home')}
          />
        )}
        
        {currentScreen === 'event-details' && (
          <EventDetails 
            onBack={() => navigateTo('home')}
            eventId={selectedEventId}
            suburb={suburb}
          />
        )}
        
        {currentScreen === 'profile' && (
          <ProfileScreen 
            onBack={() => navigateTo('home')}
            userRole={userRole}
            onRoleChange={setUserRole}
            suburb={suburb}
          />
        )}
      </div>
    </div>
  );
}

