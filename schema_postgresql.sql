-- MVP Database Schema (PostgreSQL version)
-- PostgreSQL-compatible schema for the RTP neighborhood events platform

-- NeighborhoodSegment table (populated from rtp_suburb_types_v0.csv)
CREATE TABLE NeighborhoodSegment (
    geoid VARCHAR(20) PRIMARY KEY,
    county VARCHAR(100) NOT NULL,
    name TEXT NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lon DOUBLE PRECISION NOT NULL,
    distToRaleighMi DOUBLE PRECISION NOT NULL,
    distToDurhamMi DOUBLE PRECISION NOT NULL,
    distToChapelHillMi DOUBLE PRECISION NOT NULL,
    dominantCity VARCHAR(20) NOT NULL CHECK(dominantCity IN ('Raleigh', 'Durham', 'Chapel Hill')),
    popDensity DOUBLE PRECISION NOT NULL,
    suburbType VARCHAR(30) NOT NULL CHECK(suburbType IN ('Inner-Ring Suburb', 'General Suburb', 'Exurban Suburb'))
);

-- User table
CREATE TABLE "User" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK(role IN ('resident', 'artist', 'hoa_admin')),
    homeLat DOUBLE PRECISION,
    homeLon DOUBLE PRECISION,
    createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- HOAZone table
CREATE TABLE HOAZone (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hoaUserId UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lon DOUBLE PRECISION NOT NULL,
    radiusMeters DOUBLE PRECISION NOT NULL,
    geoid VARCHAR(20) NOT NULL,
    suburbType VARCHAR(30) NOT NULL,
    dominantCity VARCHAR(20) NOT NULL,
    preferredEventTypes JSONB, -- JSON array
    maxCapacity INTEGER,
    availableTimesJson JSONB, -- JSON blob
    createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    FOREIGN KEY (hoaUserId) REFERENCES "User"(id),
    FOREIGN KEY (geoid) REFERENCES NeighborhoodSegment(geoid)
);

-- Event table
CREATE TABLE Event (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hostId UUID NOT NULL,
    hostType VARCHAR(20) NOT NULL CHECK(hostType IN ('resident', 'hoa')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    startTime TIMESTAMP WITH TIME ZONE NOT NULL,
    endTime TIMESTAMP WITH TIME ZONE NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lon DOUBLE PRECISION NOT NULL,
    geoid VARCHAR(20) NOT NULL,
    suburbType VARCHAR(30) NOT NULL,
    dominantCity VARCHAR(20) NOT NULL,
    category VARCHAR(50) NOT NULL,
    expectedAttendance INTEGER,
    hostedInHoaZone BOOLEAN NOT NULL DEFAULT FALSE,
    hoaZoneId UUID,
    createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    FOREIGN KEY (hostId) REFERENCES "User"(id),
    FOREIGN KEY (geoid) REFERENCES NeighborhoodSegment(geoid),
    FOREIGN KEY (hoaZoneId) REFERENCES HOAZone(id)
);

-- EventAttendance table
CREATE TABLE EventAttendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    eventId UUID NOT NULL,
    userId UUID NOT NULL,
    status VARCHAR(10) NOT NULL CHECK(status IN ('joined', 'left')),
    createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    FOREIGN KEY (eventId) REFERENCES Event(id),
    FOREIGN KEY (userId) REFERENCES "User"(id),
    UNIQUE(eventId, userId) -- Prevent duplicate attendance records
);

-- ArtistApplication table
CREATE TABLE ArtistApplication (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artistId UUID NOT NULL,
    hoaZoneId UUID NOT NULL,
    message TEXT,
    status VARCHAR(20) NOT NULL CHECK(status IN ('pending', 'approved', 'rejected')),
    createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    FOREIGN KEY (artistId) REFERENCES "User"(id),
    FOREIGN KEY (hoaZoneId) REFERENCES HOAZone(id),
    UNIQUE(artistId, hoaZoneId) -- One application per artist per zone
);

-- Indexes for common queries
CREATE INDEX idx_user_email ON "User"(email);
CREATE INDEX idx_user_role ON "User"(role);
CREATE INDEX idx_event_geoid ON Event(geoid);
CREATE INDEX idx_event_hostId ON Event(hostId);
CREATE INDEX idx_event_startTime ON Event(startTime);
CREATE INDEX idx_eventAttendance_eventId ON EventAttendance(eventId);
CREATE INDEX idx_eventAttendance_userId ON EventAttendance(userId);
CREATE INDEX idx_hoaZone_hoaUserId ON HOAZone(hoaUserId);
CREATE INDEX idx_artistApplication_artistId ON ArtistApplication(artistId);
CREATE INDEX idx_artistApplication_hoaZoneId ON ArtistApplication(hoaZoneId);

