'use client';

import { SuburbInfo } from '@/lib/types';
import { getSuburbTypeColor } from '@/lib/utils';

interface SuburbBannerProps {
  suburbInfo: SuburbInfo | null;
}

export function SuburbBanner({ suburbInfo }: SuburbBannerProps) {
  if (!suburbInfo) {
    return (
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4">
        <div className="text-center">
          <p className="text-sm opacity-90">Loading your suburb...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 shadow-md">
      <div className="max-w-screen-xl mx-auto">
        <p className="text-xs uppercase tracking-wide opacity-90 mb-1">
          Your Community
        </p>
        <h1 className="text-lg font-semibold">
          {suburbInfo.suburbType} of {suburbInfo.dominantCity}
        </h1>
        <p className="text-sm opacity-90 mt-1">
          Bring your suburb to life
        </p>
      </div>
    </div>
  );
}

