'use client';

import { useState } from 'react';
import { ArrowLeft, MapPin, Music, Filter, CheckCircle2 } from 'lucide-react';
import { mockHOAZones } from '@/lib/mockData';

interface ArtistDashboardProps {
  onBack: () => void;
}

type ArtistView = 'dashboard' | 'map' | 'apply-success';

export function ArtistDashboard({ onBack }: ArtistDashboardProps) {
  const [view, setView] = useState<ArtistView>('dashboard');
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    suburbType: 'All',
    city: 'Raleigh',
    hoaOnly: true,
  });

  const suburbTypes = ['All', 'Inner-Ring', 'Outer-Ring', 'Downtown'];

  const handleApply = () => {
    setView('apply-success');
    setTimeout(() => {
      onBack();
    }, 2000);
  };

  if (view === 'apply-success') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="w-24 h-24 mx-auto mb-6 bg-amber-500 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-14 h-14 text-white" />
        </div>
        <h2 className="text-slate-900 mb-2">Application Submitted!</h2>
        <p className="text-slate-600 text-center">The zone organizer will review your request.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-white border-b border-slate-200">
        <button
          onClick={() => view === 'dashboard' ? onBack() : setView('dashboard')}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <h3 className="text-slate-900">Artist View</h3>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {view === 'dashboard' && (
          <div className="p-6">
            <div className="mb-6">
              <h4 className="text-slate-900 mb-2">Where do you want to perform?</h4>
              <p className="text-slate-600 text-sm">Find venues and event spaces in your area</p>
            </div>

            {/* Filters */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-slate-700 mb-2">Suburb Type</label>
                <div className="flex gap-2 overflow-x-auto">
                  {suburbTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilters({...filters, suburbType: type})}
                      className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                        filters.suburbType === type
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">City</label>
                <select
                  value={filters.city}
                  onChange={(e) => setFilters({...filters, city: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option>Raleigh</option>
                  <option>Durham</option>
                  <option>Chapel Hill</option>
                  <option>Cary</option>
                </select>
              </div>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={filters.hoaOnly}
                  onChange={(e) => setFilters({...filters, hoaOnly: e.target.checked})}
                  className="w-5 h-5 text-amber-500 rounded focus:ring-amber-500"
                />
                <span className="text-sm text-slate-700">HOA Zones Only</span>
              </label>
            </div>

            <button
              onClick={() => setView('map')}
              className="w-full bg-amber-500 text-white py-4 rounded-xl hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
            >
              <MapPin className="w-5 h-5" />
              Explore Map
            </button>
          </div>
        )}

        {view === 'map' && (
          <div className="h-full flex flex-col">
            {/* Map */}
            <div className="flex-1 bg-gradient-to-br from-sky-100 to-emerald-100 relative">
              {/* HOA Zones highlighted */}
              <div className="absolute top-1/4 left-1/3">
                <button
                  onClick={() => setSelectedZone('z1')}
                  className={`transition-all ${
                    selectedZone === 'z1' ? 'scale-110' : ''
                  }`}
                >
                  <div className="w-20 h-20 bg-emerald-500/30 rounded-full flex items-center justify-center border-3 border-emerald-600">
                    <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </button>
              </div>

              <div className="absolute bottom-1/3 right-1/4">
                <button
                  onClick={() => setSelectedZone('z2')}
                  className={`transition-all ${
                    selectedZone === 'z2' ? 'scale-110' : ''
                  }`}
                >
                  <div className="w-20 h-20 bg-emerald-500/30 rounded-full flex items-center justify-center border-3 border-emerald-600">
                    <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </button>
              </div>

              {/* Smaller home-host pins */}
              <div className="absolute top-1/2 left-1/4">
                <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center shadow-md opacity-50">
                  <Music className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* Zone Details Panel */}
            {selectedZone && (
              <div className="bg-white p-6 border-t border-slate-200">
                {mockHOAZones
                  .filter(zone => zone.id === selectedZone)
                  .map((zone) => (
                    <div key={zone.id}>
                      <h4 className="text-slate-900 mb-3">{zone.name}</h4>
                      
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex items-start gap-2">
                          <Filter className="w-4 h-4 text-slate-500 mt-0.5" />
                          <div>
                            <span className="text-slate-500">Preferred Types: </span>
                            <span className="text-slate-700">{zone.preferredEventTypes.join(', ')}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-slate-500 mt-0.5" />
                          <div>
                            <span className="text-slate-500">Available: </span>
                            <span className="text-slate-700">{zone.availableTimes}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleApply}
                        className="w-full bg-amber-500 text-white py-3 rounded-xl hover:bg-amber-600 transition-colors"
                      >
                        Apply to Perform
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

