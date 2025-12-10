'use client';

import { Home } from 'lucide-react';

interface OnboardingWelcomeProps {
  onNext: () => void;
}

export function OnboardingWelcome({ onNext }: OnboardingWelcomeProps) {
  return (
    <div className="h-full flex flex-col items-center justify-between p-8 bg-gradient-to-br from-emerald-50 to-sky-50">
      {/* Illustration Placeholder */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-48 h-48 mx-auto mb-8 bg-gradient-to-br from-emerald-100 to-sky-100 rounded-full flex items-center justify-center">
            <Home className="w-24 h-24 text-emerald-600" />
          </div>
          
          <h1 className="text-emerald-800 mb-3">Suburb Events</h1>
          <p className="text-slate-600">Build culture in your neighborhood.</p>
        </div>
      </div>
      
      {/* Button */}
      <button
        onClick={onNext}
        className="w-full bg-emerald-600 text-white py-4 rounded-2xl hover:bg-emerald-700 transition-colors shadow-lg"
      >
        Get Started
      </button>
    </div>
  );
}

