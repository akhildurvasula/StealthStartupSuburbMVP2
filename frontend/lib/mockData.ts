export interface Event {
  id: string;
  title: string;
  time: string;
  hostType: 'Resident' | 'HOA';
  suburbType: string;
  description: string;
  category: string;
  expectedAttendance: number;
  attendees: number;
}

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Backyard Jazz Night',
    time: 'Friday, 7:00 PM',
    hostType: 'Resident',
    suburbType: 'Inner-Ring Raleigh',
    description: 'Join us for an evening of smooth jazz in our backyard. Local artists will be performing. Bring your own drinks!',
    category: 'Music',
    expectedAttendance: 25,
    attendees: 12,
  },
  {
    id: '2',
    title: 'Community Yoga Session',
    time: 'Saturday, 9:00 AM',
    hostType: 'HOA',
    suburbType: 'Inner-Ring Raleigh',
    description: 'Morning yoga session at the community park. All levels welcome. Bring your own mat.',
    category: 'Fitness',
    expectedAttendance: 30,
    attendees: 18,
  },
  {
    id: '3',
    title: 'Kids Art Workshop',
    time: 'Sunday, 2:00 PM',
    hostType: 'Resident',
    suburbType: 'Inner-Ring Raleigh',
    description: 'Fun art activities for kids aged 5-12. All supplies provided. Parents welcome to stay.',
    category: 'Workshop',
    expectedAttendance: 15,
    attendees: 8,
  },
  {
    id: '4',
    title: 'Neighborhood Game Night',
    time: 'Thursday, 6:30 PM',
    hostType: 'HOA',
    suburbType: 'Inner-Ring Raleigh',
    description: 'Board games and card games at the community center. Snacks and drinks provided.',
    category: 'Games',
    expectedAttendance: 40,
    attendees: 22,
  },
  {
    id: '5',
    title: 'Garden Party & Plant Swap',
    time: 'Saturday, 3:00 PM',
    hostType: 'Resident',
    suburbType: 'Inner-Ring Raleigh',
    description: 'Bring plants to swap and enjoy refreshments in our garden. Expert gardeners on hand for advice.',
    category: 'Workshop',
    expectedAttendance: 20,
    attendees: 15,
  },
];

export interface HOAZone {
  id: string;
  name: string;
  preferredEventTypes: string[];
  maxCapacity: number;
  availableTimes: string;
}

export const mockHOAZones: HOAZone[] = [
  {
    id: 'z1',
    name: 'Community Park Pavilion',
    preferredEventTypes: ['Music', 'Fitness', 'Family'],
    maxCapacity: 50,
    availableTimes: 'Weekends 9 AM - 9 PM',
  },
  {
    id: 'z2',
    name: 'Neighborhood Green Space',
    preferredEventTypes: ['Fitness', 'Workshop', 'Family'],
    maxCapacity: 30,
    availableTimes: 'Daily 6 AM - 8 PM',
  },
];

