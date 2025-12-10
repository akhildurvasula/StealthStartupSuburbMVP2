'use client';

import { CheckCircle2 } from 'lucide-react';

interface SuburbIdentifiedProps {
  suburb: string;
  onContinue: () => void;
}

export function SuburbIdentified({ suburb, onContinue }: SuburbIdentifiedProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-emerald-50 to-sky-50">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-emerald-500 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-14 h-14 text-white" />
        </div>
        
        <h1 className="text-slate-900 mb-4">
          You&apos;re in the <br />
          <span className="text-emerald-600">{suburb}</span>!
        </h1>
        
        <div className="inline-block px-6 py-2 bg-emerald-100 text-emerald-700 rounded-full mb-12">
          {suburb}
        </div>
        
        <button
          onClick={onContinue}
          className="w-full max-w-xs bg-emerald-600 text-white py-4 rounded-2xl hover:bg-emerald-700 transition-colors shadow-lg"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

