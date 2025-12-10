// Micro-Event Templates for Alpha
// These are the pre-defined templates users can select from

export interface MicroEventTemplate {
  key: string;
  defaultTitle: string;
  defaultDurationMinutes: number;
  emoji: string;
  description: string;
}

export const MICRO_EVENT_TEMPLATES: MicroEventTemplate[] = [
  {
    key: 'morning_walk',
    defaultTitle: 'Morning Walk Meetup',
    defaultDurationMinutes: 60,
    emoji: '🚶',
    description: 'Join for a casual morning walk around the neighborhood'
  },
  {
    key: 'coffee_culdesac',
    defaultTitle: 'Coffee in the Cul-de-Sac',
    defaultDurationMinutes: 90,
    emoji: '☕',
    description: 'Drop by with your mug for coffee and conversation'
  },
  {
    key: 'dog_play_hour',
    defaultTitle: 'Dog Play Hour',
    defaultDurationMinutes: 60,
    emoji: '🐕',
    description: 'Let the dogs play and socialize while we chat'
  },
  {
    key: 'porch_music',
    defaultTitle: 'Porch Music Jam',
    defaultDurationMinutes: 120,
    emoji: '🎶',
    description: 'Bring your instrument or just enjoy the music'
  }
];

export function getTemplateByKey(key: string): MicroEventTemplate | undefined {
  return MICRO_EVENT_TEMPLATES.find(t => t.key === key);
}

export function calculateEndTime(startTime: Date, templateKey: string): Date {
  const template = getTemplateByKey(templateKey);
  const durationMinutes = template?.defaultDurationMinutes || 60;
  return new Date(startTime.getTime() + durationMinutes * 60 * 1000);
}

