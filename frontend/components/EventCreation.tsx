'use client';

import { useState } from 'react';
import { ArrowLeft, Home, MapPin, Calendar, Users, Tag, CheckCircle2 } from 'lucide-react';

interface EventCreationProps {
  onBack: () => void;
  suburb: string;
}

type CreationStep = 'choose-type' | 'map-placement' | 'details' | 'success';

export function EventCreation({ onBack, suburb }: EventCreationProps) {
  const [step, setStep] = useState<CreationStep>('choose-type');
  const [hostType, setHostType] = useState<'home' | 'hoa' | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    expectedAttendance: '',
    category: 'Music',
  });

  const categories = ['Music', 'Games', 'Workshop', 'Fitness', 'Family', 'Food', 'Arts'];

  const handleChooseType = (type: 'home' | 'hoa') => {
    setHostType(type);
    setStep('map-placement');
  };

  const handleCreateEvent = () => {
    setStep('success');
    setTimeout(() => {
      onBack();
    }, 2000);
  };

  if (step === 'success') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-emerald-50 to-sky-50">
        <div className="w-24 h-24 mx-auto mb-6 bg-emerald-500 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-14 h-14 text-white" />
        </div>
        <h2 className="text-slate-900 mb-2">Your event is live!</h2>
        <p className="text-slate-600 text-center">Neighbors can now discover and join your event.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-white border-b border-slate-200">
        <button
          onClick={() => step === 'choose-type' ? onBack() : setStep('choose-type')}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <h3 className="text-slate-900">Create Event</h3>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {step === 'choose-type' && (
          <div className="p-6 space-y-4">
            <h4 className="text-slate-900 mb-6">Choose Hosting Type</h4>
            
            <button
              onClick={() => handleChooseType('home')}
              className="w-full p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl hover:shadow-md transition-shadow border-2 border-blue-200"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center">
                  <Home className="w-7 h-7 text-white" />
                </div>
                <div className="text-left">
                  <h5 className="text-slate-900 mb-1">Host at My House</h5>
                  <p className="text-slate-600 text-sm">Invite neighbors to your home</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleChooseType('hoa')}
              className="w-full p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl hover:shadow-md transition-shadow border-2 border-emerald-200"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <div className="text-left">
                  <h5 className="text-slate-900 mb-1">Host in HOA Zone</h5>
                  <p className="text-slate-600 text-sm">Use a community space</p>
                </div>
              </div>
            </button>
          </div>
        )}

        {step === 'map-placement' && (
          <div className="h-full flex flex-col">
            <div className="flex-1 bg-gradient-to-br from-sky-100 to-emerald-100 relative">
              {/* Map Pin */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className={`w-12 h-12 ${hostType === 'home' ? 'bg-blue-500' : 'bg-emerald-500'} rounded-full flex items-center justify-center shadow-lg border-2 border-white`}>
                  {hostType === 'home' ? (
                    <Home className="w-6 h-6 text-white" />
                  ) : (
                    <MapPin className="w-6 h-6 text-white" />
                  )}
                </div>
              </div>
              
              {/* Suburb Badge */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2">
                <div className="px-4 py-2 bg-white rounded-full shadow-md">
                  <span className="text-sm text-slate-700">{suburb}</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white">
              <p className="text-slate-600 text-sm mb-4 text-center">
                {hostType === 'home' ? 'Pin is placed at your home location' : 'Choose a community zone on the map'}
              </p>
              <button
                onClick={() => setStep('details')}
                className="w-full bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 'details' && (
          <div className="p-6">
            <h4 className="text-slate-900 mb-6">Event Details</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-700 mb-2">Event Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Backyard Jazz Night"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Tell neighbors about your event..."
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">Time</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Expected Attendance
                </label>
                <input
                  type="number"
                  value={formData.expectedAttendance}
                  onChange={(e) => setFormData({...formData, expectedAttendance: e.target.value})}
                  placeholder="e.g., 25"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-2">
                  <Tag className="w-4 h-4 inline mr-1" />
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setStep('map-placement')}
                className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateEvent}
                className="flex-1 bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Create Event
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

