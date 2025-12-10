// Core Types for Frontend

export interface SuburbInfo {
  geoid: string;
  suburbType: 'Inner-Ring Suburb' | 'General Suburb' | 'Exurban Suburb';
  dominantCity: 'Raleigh' | 'Durham' | 'Chapel Hill';
  lat: number;
  lon: number;
}

export interface Event {
  id: string;
  hostId: string;
  templateKey: string;
  title: string;
  description?: string;
  startTime: string;
  endTime?: string;
  lat: number;
  lon: number;
  geoid: string;
  suburbType: string;
  dominantCity: string;
  attendeeCount?: number;
  isUserAttending?: boolean;
}

export interface InterestSignal {
  id: string;
  templateKey: string;
  lat: number;
  lon: number;
  suburbType: string;
  dominantCity: string;
  interestedCount: number;
  expiresAt: string;
}

export interface MicroEventTemplate {
  key: string;
  title: string;
  emoji: string;
  description: string;
  durationMinutes: number;
}

export const MICRO_EVENT_TEMPLATES: MicroEventTemplate[] = [
  {
    key: 'morning_walk',
    title: 'Morning Walk Meetup',
    emoji: '🚶',
    description: 'Join for a casual morning walk around the neighborhood',
    durationMinutes: 60,
  },
  {
    key: 'coffee_culdesac',
    title: 'Coffee in the Cul-de-Sac',
    emoji: '☕',
    description: 'Drop by with your mug for coffee and conversation',
    durationMinutes: 90,
  },
  {
    key: 'dog_play_hour',
    title: 'Dog Play Hour',
    emoji: '🐕',
    description: 'Let the dogs play and socialize while we chat',
    durationMinutes: 60,
  },
  {
    key: 'porch_music',
    title: 'Porch Music Jam',
    emoji: '🎶',
    description: 'Bring your instrument or just enjoy the music',
    durationMinutes: 120,
  },
];

