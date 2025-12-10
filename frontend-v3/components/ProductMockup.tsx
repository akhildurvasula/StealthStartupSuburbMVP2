'use client';

interface ProductMockupProps {
  type: 'map' | 'event-card' | 'host-modal' | 'event-list';
}

export function ProductMockup({ type }: ProductMockupProps) {
  if (type === 'map') {
    return (
      <svg viewBox="0 0 400 600" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Phone frame */}
        <rect width="400" height="600" rx="40" fill="#1C1C1E"/>
        <rect x="20" y="20" width="360" height="560" rx="30" fill="#F5F5F7"/>
        
        {/* Header */}
        <rect x="20" y="20" width="360" height="80" fill="#1C1C1E"/>
        <circle cx="60" cy="60" r="8" fill="#F6C56A"/>
        <rect x="80" y="52" width="120" height="16" rx="8" fill="#F5F5F7" opacity="0.9"/>
        
        {/* Map background */}
        <defs>
          <pattern id="map-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M0 20 L40 20 M20 0 L20 40" stroke="#E5E7EB" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect x="20" y="100" width="360" height="480" fill="url(#map-pattern)"/>
        
        {/* Map streets */}
        <path d="M 50 200 L 350 200" stroke="#D1D5DB" strokeWidth="3"/>
        <path d="M 200 120 L 200 560" stroke="#D1D5DB" strokeWidth="3"/>
        <path d="M 100 350 L 320 350" stroke="#D1D5DB" strokeWidth="2"/>
        
        {/* Event pins (gold) */}
        <g>
          <circle cx="180" cy="250" r="20" fill="#F6C56A" opacity="0.3"/>
          <circle cx="180" cy="250" r="12" fill="#F6C56A"/>
          <text x="180" y="255" fontSize="14" textAnchor="middle" fill="#0D0D0F">👥</text>
        </g>
        
        <g>
          <circle cx="260" cy="320" r="20" fill="#F6C56A" opacity="0.3"/>
          <circle cx="260" cy="320" r="12" fill="#F6C56A"/>
          <text x="260" y="325" fontSize="14" textAnchor="middle" fill="#0D0D0F">🎵</text>
        </g>
        
        {/* Ghost pin */}
        <g opacity="0.6">
          <circle cx="140" cy="400" r="20" fill="#E8A34A" opacity="0.2"/>
          <circle cx="140" cy="400" r="12" fill="none" stroke="#E8A34A" strokeWidth="2" strokeDasharray="4 2"/>
          <text x="140" y="405" fontSize="14" textAnchor="middle" fill="#E8A34A">💡</text>
        </g>
        
        {/* Bottom drawer peek */}
        <rect x="20" y="500" width="360" height="80" rx="30" fill="white" opacity="0.95"/>
        <rect x="180" y="510" width="40" height="4" rx="2" fill="#D1D5DB"/>
        <text x="200" y="545" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#1C1C1E">Events Near You</text>
        <text x="200" y="565" fontSize="12" textAnchor="middle" fill="#6B7280">3 events</text>
        
        {/* FAB */}
        <circle cx="330" cy="460" r="28" fill="#F6C56A"/>
        <text x="330" y="468" fontSize="24" textAnchor="middle" fill="#0D0D0F" fontWeight="bold">+</text>
      </svg>
    );
  }

  if (type === 'event-card') {
    return (
      <svg viewBox="0 0 400 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="200" rx="24" fill="white"/>
        <rect width="400" height="200" rx="24" fill="none" stroke="#E5E7EB" strokeWidth="2"/>
        
        {/* Event emoji */}
        <text x="30" y="60" fontSize="40">☕</text>
        
        {/* Event title */}
        <rect x="90" y="30" width="200" height="20" rx="4" fill="#1C1C1E"/>
        
        {/* Time */}
        <circle cx="100" cy="80" r="8" fill="#E8A34A"/>
        <rect x="115" y="72" width="120" height="16" rx="4" fill="#3A3A3C"/>
        
        {/* Attendees */}
        <circle cx="100" cy="120" r="8" fill="#8BA989"/>
        <rect x="115" y="112" width="80" height="16" rx="4" fill="#3A3A3C"/>
        
        {/* Badge */}
        <rect x="270" y="30" width="100" height="28" rx="14" fill="#F6C56A" opacity="0.2"/>
        <rect x="280" y="36" width="80" height="16" rx="8" fill="#F6C56A"/>
      </svg>
    );
  }

  if (type === 'host-modal') {
    return (
      <svg viewBox="0 0 400 500" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="500" rx="32" fill="white" opacity="0.95"/>
        <rect width="400" height="4" rx="2" fill="#F6C56A"/>
        
        {/* Header */}
        <rect x="30" y="30" width="200" height="24" rx="4" fill="#1C1C1E"/>
        <circle cx="370" cy="42" r="12" fill="#E5E7EB"/>
        
        {/* Template grid */}
        {[0, 1, 2, 3].map((i) => {
          const x = 30 + (i % 2) * 180;
          const y = 80 + Math.floor(i / 2) * 140;
          return (
            <g key={i}>
              <rect x={x} y={y} width="160" height="120" rx="16" fill="#F5F5F7" stroke="#E5E7EB" strokeWidth="2"/>
              <text x={x + 80} y={y + 50} fontSize="32" textAnchor="middle">
                {['☕', '🐕', '🎵', '🚶'][i]}
              </text>
              <rect x={x + 20} y={y + 75} width="120" height="12" rx="6" fill="#1C1C1E"/>
              <rect x={x + 20} y={y + 95} width="80" height="8" rx="4" fill="#3A3A3C"/>
            </g>
          );
        })}
      </svg>
    );
  }

  // event-list
  return (
    <svg viewBox="0 0 400 500" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="500" rx="24" fill="#F5F5F7"/>
      
      {/* Event cards */}
      {[0, 1, 2].map((i) => {
        const y = 20 + i * 160;
        return (
          <g key={i}>
            <rect x="20" y={y} width="360" height="140" rx="20" fill="white"/>
            <text x="40" y={y + 50} fontSize="36">{['🎯', '🗺️', '🤝'][i]}</text>
            <rect x="100" y={y + 30} width="200" height="20" rx="4" fill="#1C1C1E"/>
            <rect x="100" y={y + 60} width="240" height="12" rx="4" fill="#3A3A3C"/>
            <rect x="100" y={y + 80} width="200" height="12" rx="4" fill="#3A3A3C"/>
            <rect x="100" y={y + 105} width="100" height="24" rx="12" fill="#F6C56A" opacity="0.3"/>
          </g>
        );
      })}
    </svg>
  );
}

