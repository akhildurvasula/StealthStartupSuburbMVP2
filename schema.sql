-- MVP Database Schema
-- SQLite-compatible schema for the RTP neighborhood events platform

-- NeighborhoodSegment table (populated from rtp_suburb_types_v0.csv)
CREATE TABLE NeighborhoodSegment (
    geoid TEXT PRIMARY KEY,
    county TEXT NOT NULL,
    name TEXT NOT NULL,
    lat REAL NOT NULL,
    lon REAL NOT NULL,
    distToRaleighMi REAL NOT NULL,
    distToDurhamMi REAL NOT NULL,
    distToChapelHillMi REAL NOT NULL,
    dominantCity TEXT NOT NULL CHECK(dominantCity IN ('Raleigh', 'Durham', 'Chapel Hill')),
    popDensity REAL NOT NULL,
    suburbType TEXT NOT NULL CHECK(suburbType IN ('Inner-Ring Suburb', 'General Suburb', 'Exurban Suburb'))
);

-- User table
CREATE TABLE User (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('resident', 'artist', 'hoa_admin')),
    homeLat REAL,
    homeLon REAL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
);

-- HOAZone table
CREATE TABLE HOAZone (
    id TEXT PRIMARY KEY,
    hoaUserId TEXT NOT NULL,
    name TEXT NOT NULL,
    lat REAL NOT NULL,
    lon REAL NOT NULL,
    radiusMeters REAL NOT NULL,
    geoid TEXT NOT NULL,
    suburbType TEXT NOT NULL,
    dominantCity TEXT NOT NULL,
    preferredEventTypes TEXT, -- JSON array as text
    maxCapacity INTEGER,
    availableTimesJson TEXT, -- JSON blob
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (hoaUserId) REFERENCES User(id),
    FOREIGN KEY (geoid) REFERENCES NeighborhoodSegment(geoid)
);

-- Event table
CREATE TABLE Event (
    id TEXT PRIMARY KEY,
    hostId TEXT NOT NULL,
    hostType TEXT NOT NULL CHECK(hostType IN ('resident', 'hoa')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    startTime TEXT NOT NULL,
    endTime TEXT NOT NULL,
    lat REAL NOT NULL,
    lon REAL NOT NULL,
    geoid TEXT NOT NULL,
    suburbType TEXT NOT NULL,
    dominantCity TEXT NOT NULL,
    category TEXT NOT NULL,
    expectedAttendance INTEGER,
    hostedInHoaZone INTEGER NOT NULL CHECK(hostedInHoaZone IN (0, 1)), -- SQLite boolean
    hoaZoneId TEXT,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (hostId) REFERENCES User(id),
    FOREIGN KEY (geoid) REFERENCES NeighborhoodSegment(geoid),
    FOREIGN KEY (hoaZoneId) REFERENCES HOAZone(id)
);

-- EventAttendance table
CREATE TABLE EventAttendance (
    id TEXT PRIMARY KEY,
    eventId TEXT NOT NULL,
    userId TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('joined', 'left')),
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (eventId) REFERENCES Event(id),
    FOREIGN KEY (userId) REFERENCES User(id),
    UNIQUE(eventId, userId) -- Prevent duplicate attendance records
);

-- ArtistApplication table
CREATE TABLE ArtistApplication (
    id TEXT PRIMARY KEY,
    artistId TEXT NOT NULL,
    hoaZoneId TEXT NOT NULL,
    message TEXT,
    status TEXT NOT NULL CHECK(status IN ('pending', 'approved', 'rejected')),
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (artistId) REFERENCES User(id),
    FOREIGN KEY (hoaZoneId) REFERENCES HOAZone(id),
    UNIQUE(artistId, hoaZoneId) -- One application per artist per zone
);

-- Indexes for common queries
CREATE INDEX idx_user_email ON User(email);
CREATE INDEX idx_user_role ON User(role);
CREATE INDEX idx_event_geoid ON Event(geoid);
CREATE INDEX idx_event_hostId ON Event(hostId);
CREATE INDEX idx_event_startTime ON Event(startTime);
CREATE INDEX idx_eventAttendance_eventId ON EventAttendance(eventId);
CREATE INDEX idx_eventAttendance_userId ON EventAttendance(userId);
CREATE INDEX idx_hoaZone_hoaUserId ON HOAZone(hoaUserId);
CREATE INDEX idx_artistApplication_artistId ON ArtistApplication(artistId);
CREATE INDEX idx_artistApplication_hoaZoneId ON ArtistApplication(hoaZoneId);

