'use client';

import { useState } from 'react';
import { User, Plus, Map as MapIcon, List } from 'lucide-react';
import { MapView } from './MapView';
import { FeedView } from './FeedView';
import type { Screen, UserRole } from '@/types';

interface HomeScreenProps {
  navigateTo: (screen: Screen, eventId?: string) => void;
  suburb: string;
  userRole: UserRole;
}

export function HomeScreen({ navigateTo, suburb, userRole }: HomeScreenProps) {
  const [activeTab, setActiveTab] = useState<'map' | 'feed'>('map');

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-slate-200">
        <button
          onClick={() => navigateTo('profile')}
          className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
        >
          <User className="w-5 h-5 text-slate-700" />
        </button>
        
        <h3 className="text-slate-900">Explore</h3>
        
        <button
          onClick={() => navigateTo('event-creation')}
          className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-700 transition-colors shadow-md"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-white border-b border-slate-200">
        <button
          onClick={() => setActiveTab('map')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 border-b-2 transition-colors ${
            activeTab === 'map'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500'
          }`}
        >
          <MapIcon className="w-4 h-4" />
          Map
        </button>
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 border-b-2 transition-colors ${
            activeTab === 'feed'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500'
          }`}
        >
          <List className="w-4 h-4" />
          Feed
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'map' ? (
          <MapView navigateTo={navigateTo} suburb={suburb} userRole={userRole} />
        ) : (
          <FeedView navigateTo={navigateTo} suburb={suburb} />
        )}
      </div>
    </div>
  );
}

