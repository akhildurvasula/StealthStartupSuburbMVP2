import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.eventAttendance.deleteMany();
  await prisma.event.deleteMany();
  await prisma.userHomeLocation.deleteMany();
  await prisma.hOALocation.deleteMany();
  await prisma.hOA.deleteMany();
  await prisma.magicLink.deleteMany();
  await prisma.user.deleteMany();
  await prisma.suburbScore.deleteMany();
  await prisma.suburb.deleteMany();

  // Create suburbs (RTP region)
  console.log('Creating suburbs...');
  const raleigh = await prisma.suburb.create({
    data: {
      name: 'Inner-Ring Raleigh',
      type: 'ESTABLISHED',
      lat: 35.7796,
      lon: -78.6382,
      population: 45000,
      suburbScores: {
        create: {
          eventDensity: 12,
          artistInterestScore: 75,
          averageAttendance: 28,
        },
      },
    },
  });

  const durham = await prisma.suburb.create({
    data: {
      name: 'Downtown Durham',
      type: 'ESTABLISHED',
      lat: 35.9940,
      lon: -78.8986,
      population: 38000,
      suburbScores: {
        create: {
          eventDensity: 15,
          artistInterestScore: 82,
          averageAttendance: 32,
        },
      },
    },
  });

  const chapelHill = await prisma.suburb.create({
    data: {
      name: 'Chapel Hill',
      type: 'ESTABLISHED',
      lat: 35.9132,
      lon: -79.0558,
      population: 25000,
      suburbScores: {
        create: {
          eventDensity: 10,
          artistInterestScore: 68,
          averageAttendance: 24,
        },
      },
    },
  });

  const cary = await prisma.suburb.create({
    data: {
      name: 'Downtown Cary',
      type: 'STARTER',
      lat: 35.7915,
      lon: -78.7811,
      population: 52000,
      suburbScores: {
        create: {
          eventDensity: 8,
          artistInterestScore: 55,
          averageAttendance: 22,
        },
      },
    },
  });

  const apex = await prisma.suburb.create({
    data: {
      name: 'Apex',
      type: 'STARTER',
      lat: 35.7327,
      lon: -78.8503,
      population: 32000,
      suburbScores: {
        create: {
          eventDensity: 5,
          artistInterestScore: 42,
          averageAttendance: 18,
        },
      },
    },
  });

  console.log(`✅ Created ${5} suburbs`);

  // Create users
  console.log('Creating users...');
  const hashedPassword = await hashPassword('password123');

  const resident1 = await prisma.user.create({
    data: {
      email: 'alex@example.com',
      password: hashedPassword,
      name: 'Alex Johnson',
      role: 'RESIDENT',
      suburbId: raleigh.id,
    },
  });

  const resident2 = await prisma.user.create({
    data: {
      email: 'sam@example.com',
      password: hashedPassword,
      name: 'Sam Martinez',
      role: 'RESIDENT',
      suburbId: durham.id,
    },
  });

  const artist1 = await prisma.user.create({
    data: {
      email: 'jamie@example.com',
      password: hashedPassword,
      name: 'Jamie Chen',
      role: 'ARTIST',
      suburbId: raleigh.id,
    },
  });

  const artist2 = await prisma.user.create({
    data: {
      email: 'taylor@example.com',
      password: hashedPassword,
      name: 'Taylor Swift',
      role: 'ARTIST',
      suburbId: durham.id,
    },
  });

  const hoaAdmin1 = await prisma.user.create({
    data: {
      email: 'admin@maplewood.com',
      password: hashedPassword,
      name: 'Morgan Williams',
      role: 'HOA_ADMIN',
      suburbId: raleigh.id,
    },
  });

  const hoaAdmin2 = await prisma.user.create({
    data: {
      email: 'admin@brightwater.com',
      password: hashedPassword,
      name: 'Casey Brown',
      role: 'HOA_ADMIN',
      suburbId: durham.id,
    },
  });

  console.log(`✅ Created ${6} users`);

  // Create home locations
  await prisma.userHomeLocation.createMany({
    data: [
      { userId: resident1.id, lat: 35.7800, lon: -78.6400, visible: true },
      { userId: resident2.id, lat: 35.9950, lon: -78.9000, visible: true },
      { userId: artist1.id, lat: 35.7750, lon: -78.6350, visible: true },
    ],
  });

  console.log(`✅ Created home locations`);

  // Create HOAs and HOA locations
  console.log('Creating HOA locations...');
  const hoa1 = await prisma.hOA.create({
    data: {
      name: 'Maplewood Community Association',
      adminId: hoaAdmin1.id,
      suburbId: raleigh.id,
    },
  });

  const hoa2 = await prisma.hOA.create({
    data: {
      name: 'Brightwater HOA',
      adminId: hoaAdmin2.id,
      suburbId: durham.id,
    },
  });

  await prisma.hOALocation.createMany({
    data: [
      {
        hoaId: hoa1.id,
        suburbId: raleigh.id,
        lat: 35.7810,
        lon: -78.6390,
        description: 'Community Park Pavilion',
        preferredTypes: ['music', 'fitness', 'family'],
        maxCapacity: 50,
        availableTimes: 'Weekends 9 AM - 9 PM',
      },
      {
        hoaId: hoa1.id,
        suburbId: raleigh.id,
        lat: 35.7790,
        lon: -78.6370,
        description: 'Green Space Near Pool',
        preferredTypes: ['fitness', 'workshop', 'family'],
        maxCapacity: 30,
        availableTimes: 'Daily 6 AM - 8 PM',
      },
      {
        hoaId: hoa2.id,
        suburbId: durham.id,
        lat: 35.9960,
        lon: -78.8990,
        description: 'Central Courtyard',
        preferredTypes: ['music', 'arts', 'food'],
        maxCapacity: 75,
        availableTimes: 'Fri-Sun 4 PM - 10 PM',
      },
    ],
  });

  console.log(`✅ Created HOA locations`);

  // Create events
  console.log('Creating events...');
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const event1 = await prisma.event.create({
    data: {
      title: 'Backyard Jazz Night',
      description: 'Join us for an evening of smooth jazz. Local artists performing!',
      hostId: resident1.id,
      hostType: 'RESIDENT',
      suburbId: raleigh.id,
      locationLat: 35.7800,
      locationLon: -78.6400,
      dateTime: tomorrow,
      category: 'music',
      expectedCapacity: 25,
      actualAttendance: 0,
    },
  });

  const event2 = await prisma.event.create({
    data: {
      title: 'Community Yoga Session',
      description: 'Morning yoga in the park. All levels welcome!',
      hostId: artist1.id,
      hostType: 'ARTIST',
      suburbId: raleigh.id,
      locationLat: 35.7810,
      locationLon: -78.6390,
      dateTime: nextWeek,
      category: 'fitness',
      expectedCapacity: 30,
      actualAttendance: 0,
    },
  });

  const event3 = await prisma.event.create({
    data: {
      title: 'Live Music & Food Trucks',
      description: 'Monthly community gathering with local bands and food.',
      hostId: hoaAdmin2.id,
      hostType: 'HOA',
      suburbId: durham.id,
      locationLat: 35.9960,
      locationLon: -78.8990,
      dateTime: nextWeek,
      category: 'music',
      expectedCapacity: 75,
      actualAttendance: 0,
    },
  });

  // Past event for scoring
  const pastEvent = await prisma.event.create({
    data: {
      title: 'Neighborhood Game Night',
      description: 'Board games and card games.',
      hostId: resident2.id,
      hostType: 'RESIDENT',
      suburbId: durham.id,
      locationLat: 35.9950,
      locationLon: -78.9000,
      dateTime: twoWeeksAgo,
      category: 'games',
      expectedCapacity: 40,
      actualAttendance: 28,
    },
  });

  console.log(`✅ Created events`);

  // Create event attendances for past event
  await prisma.eventAttendance.createMany({
    data: [
      { eventId: pastEvent.id, userId: resident1.id, status: 'JOINED' },
      { eventId: pastEvent.id, userId: artist1.id, status: 'JOINED' },
    ],
  });

  console.log('✅ Created event attendances');

  console.log('');
  console.log('🎉 Database seeded successfully!');
  console.log('');
  console.log('Test accounts:');
  console.log('  Resident: alex@example.com / password123');
  console.log('  Artist: jamie@example.com / password123');
  console.log('  HOA Admin: admin@maplewood.com / password123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

