'use client';

import { MapPin, Navigation } from 'lucide-react';
import { useState } from 'react';

interface OnboardingLocationProps {
  onNext: (suburb: string) => void;
}

export function OnboardingLocation({ onNext }: OnboardingLocationProps) {
  const [manualEntry, setManualEntry] = useState(false);
  const [address, setAddress] = useState('');

  const handleEnableLocation = () => {
    // Simulate location detection
    setTimeout(() => {
      onNext('Inner-Ring Raleigh');
    }, 500);
  };

  const handleManualSubmit = () => {
    if (address) {
      onNext('Inner-Ring Raleigh');
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-between p-8 bg-white">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center w-full">
          <div className="w-32 h-32 mx-auto mb-8 bg-sky-100 rounded-full flex items-center justify-center">
            <MapPin className="w-16 h-16 text-sky-600" />
          </div>
          
          <h2 className="text-slate-900 mb-3">Find Your Neighborhood</h2>
          <p className="text-slate-600 mb-8">We use your location to discover your suburb.</p>
          
          {manualEntry ? (
            <div className="space-y-4">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your address"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={handleManualSubmit}
                disabled={!address}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl hover:bg-emerald-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                Continue
              </button>
              <button
                onClick={() => setManualEntry(false)}
                className="w-full text-slate-600 py-2"
              >
                Back
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={handleEnableLocation}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl hover:bg-emerald-700 transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <Navigation className="w-5 h-5" />
                Enable Location
              </button>
              
              <button
                onClick={() => setManualEntry(true)}
                className="mt-4 text-sky-600 hover:text-sky-700"
              >
                Enter address manually
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

