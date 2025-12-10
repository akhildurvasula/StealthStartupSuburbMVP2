'use client';

import { useState } from 'react';
import { ArrowLeft, Plus, MapPin, Users, Clock, Tag, CheckCircle2 } from 'lucide-react';
import { mockHOAZones } from '@/lib/mockData';

interface HOADashboardProps {
  onBack: () => void;
  suburb: string;
}

type DashboardView = 'list' | 'create-map' | 'create-form' | 'success';

export function HOADashboard({ onBack, suburb }: HOADashboardProps) {
  const [view, setView] = useState<DashboardView>('list');
  const [radius, setRadius] = useState(100);
  const [formData, setFormData] = useState({
    zoneName: '',
    eventTypes: [] as string[],
    maxCapacity: '',
    availableTimes: '',
  });

  const eventTypes = ['Music', 'Games', 'Workshop', 'Fitness', 'Family', 'Food', 'Arts'];

  const toggleEventType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      eventTypes: prev.eventTypes.includes(type)
        ? prev.eventTypes.filter(t => t !== type)
        : [...prev.eventTypes, type]
    }));
  };

  const handleSaveZone = () => {
    setView('success');
    setTimeout(() => {
      setView('list');
    }, 2000);
  };

  if (view === 'success') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-emerald-50 to-sky-50">
        <div className="w-24 h-24 mx-auto mb-6 bg-emerald-500 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-14 h-14 text-white" />
        </div>
        <h2 className="text-slate-900 mb-2">Zone Created!</h2>
        <p className="text-slate-600 text-center">Your event zone is now available for residents and artists.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-white border-b border-slate-200">
        <button
          onClick={() => view === 'list' ? onBack() : setView('list')}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <h3 className="text-slate-900">HOA Dashboard</h3>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {view === 'list' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-slate-900">Event Zones</h4>
              <button
                onClick={() => setView('create-map')}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Zone
              </button>
            </div>

            <div className="space-y-3">
              {mockHOAZones.map((zone) => (
                <div
                  key={zone.id}
                  className="bg-slate-50 rounded-2xl p-4 border border-slate-200"
                >
                  <h5 className="text-slate-900 mb-3">{zone.name}</h5>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Tag className="w-4 h-4" />
                      <span>{zone.preferredEventTypes.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Users className="w-4 h-4" />
                      <span>Max {zone.maxCapacity} people</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-4 h-4" />
                      <span>{zone.availableTimes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'create-map' && (
          <div className="h-full flex flex-col">
            <div className="flex-1 bg-gradient-to-br from-sky-100 to-emerald-100 relative">
              {/* Zone Circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div 
                  className="bg-emerald-500/20 rounded-full flex items-center justify-center border-2 border-emerald-500"
                  style={{ width: `${radius}px`, height: `${radius}px` }}
                >
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white space-y-4">
              <div>
                <label className="block text-sm text-slate-700 mb-2">Zone Radius: {radius}m</label>
                <input
                  type="range"
                  min="50"
                  max="300"
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>50m</span>
                  <span>300m</span>
                </div>
              </div>

              <button
                onClick={() => setView('create-form')}
                className="w-full bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {view === 'create-form' && (
          <div className="p-6">
            <h4 className="text-slate-900 mb-6">Zone Preferences</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-700 mb-2">Zone Name</label>
                <input
                  type="text"
                  value={formData.zoneName}
                  onChange={(e) => setFormData({...formData, zoneName: e.target.value})}
                  placeholder="e.g., Community Park Pavilion"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-3">Preferred Event Types</label>
                <div className="flex flex-wrap gap-2">
                  {eventTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => toggleEventType(type)}
                      className={`px-4 py-2 rounded-full transition-colors ${
                        formData.eventTypes.includes(type)
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Max Capacity
                </label>
                <input
                  type="number"
                  value={formData.maxCapacity}
                  onChange={(e) => setFormData({...formData, maxCapacity: e.target.value})}
                  placeholder="e.g., 50"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Available Times
                </label>
                <input
                  type="text"
                  value={formData.availableTimes}
                  onChange={(e) => setFormData({...formData, availableTimes: e.target.value})}
                  placeholder="e.g., Weekends 9 AM - 9 PM"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setView('create-map')}
                className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl hover:bg-slate-200 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSaveZone}
                className="flex-1 bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Save Zone
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

