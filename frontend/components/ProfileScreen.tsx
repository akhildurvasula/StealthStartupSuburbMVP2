'use client';

import { ArrowLeft, User, MapPin, Bell, LogOut, Briefcase, Building2, Settings } from 'lucide-react';
import type { UserRole } from '@/types';

interface ProfileScreenProps {
  onBack: () => void;
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  suburb: string;
}

export function ProfileScreen({ onBack, userRole, onRoleChange, suburb }: ProfileScreenProps) {
  const getRoleBadge = () => {
    switch (userRole) {
      case 'resident':
        return { label: 'Resident', color: 'bg-blue-100 text-blue-700' };
      case 'artist':
        return { label: 'Artist', color: 'bg-amber-100 text-amber-700' };
      case 'hoa_admin':
        return { label: 'HOA Admin', color: 'bg-emerald-100 text-emerald-700' };
    }
  };

  const badge = getRoleBadge();

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-white border-b border-slate-200">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <h3 className="text-slate-900">Profile</h3>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-emerald-200 to-sky-200 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-slate-700" />
          </div>
          <h3 className="text-slate-900 mb-2">Alex Johnson</h3>
          <div className={`inline-block px-4 py-1 ${badge.color} rounded-full text-sm mb-2`}>
            {badge.label}
          </div>
          {userRole === 'resident' && (
            <div className="flex items-center justify-center gap-2 text-slate-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{suburb}</span>
            </div>
          )}
        </div>

        {/* Role Switcher (Demo purposes) */}
        <div className="mb-6 p-4 bg-slate-50 rounded-xl">
          <p className="text-sm text-slate-600 mb-3">Switch Role (Demo):</p>
          <div className="flex gap-2">
            <button
              onClick={() => onRoleChange('resident')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                userRole === 'resident'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              Resident
            </button>
            <button
              onClick={() => onRoleChange('artist')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                userRole === 'artist'
                  ? 'bg-amber-500 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              Artist
            </button>
            <button
              onClick={() => onRoleChange('hoa_admin')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                userRole === 'hoa_admin'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              HOA
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          <button className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 rounded-xl transition-colors text-left">
            <Settings className="w-5 h-5 text-slate-500" />
            <span className="text-slate-700">Edit Profile</span>
          </button>

          {userRole === 'hoa_admin' && (
            <button className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 rounded-xl transition-colors text-left">
              <Building2 className="w-5 h-5 text-slate-500" />
              <span className="text-slate-700">Manage HOA Zones</span>
            </button>
          )}

          {userRole === 'artist' && (
            <button className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 rounded-xl transition-colors text-left">
              <Briefcase className="w-5 h-5 text-slate-500" />
              <span className="text-slate-700">Artist Preferences</span>
            </button>
          )}

          <button className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 rounded-xl transition-colors text-left">
            <Bell className="w-5 h-5 text-slate-500" />
            <span className="text-slate-700">Notifications</span>
          </button>

          <button className="w-full flex items-center gap-3 p-4 hover:bg-red-50 rounded-xl transition-colors text-left">
            <LogOut className="w-5 h-5 text-red-500" />
            <span className="text-red-600">Log Out</span>
          </button>
        </div>

        {/* App Info */}
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>Suburb Events v1.0</p>
          <p className="mt-1">Building culture in your neighborhood</p>
        </div>
      </div>
    </div>
  );
}

