-- Suburb Events V3 - Alpha Database Schema
-- Simplified for resident-only core loop with micro-events and interest signals

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables to recreate with correct schema
DROP TABLE IF EXISTS interest_signal_users CASCADE;
DROP TABLE IF EXISTS interest_signals CASCADE;
DROP TABLE IF EXISTS event_attendance CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS neighborhood_segments CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ===== USERS =====

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== NEIGHBORHOOD SEGMENTS (Import from CSV) =====

CREATE TABLE IF NOT EXISTS neighborhood_segments (
  geoid VARCHAR(20) PRIMARY KEY,
  county VARCHAR(100) NOT NULL,
  name TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lon DOUBLE PRECISION NOT NULL,
  dist_to_raleigh_mi DOUBLE PRECISION NOT NULL,
  dist_to_durham_mi DOUBLE PRECISION NOT NULL,
  dist_to_chapelhill_mi DOUBLE PRECISION NOT NULL,
  dominant_city VARCHAR(20) NOT NULL CHECK(dominant_city IN ('Raleigh', 'Durham', 'Chapel Hill')),
  pop_density DOUBLE PRECISION NOT NULL,
  suburb_type VARCHAR(30) NOT NULL CHECK(suburb_type IN ('Inner-Ring Suburb', 'General Suburb', 'Exurban Suburb'))
);

-- ===== EVENTS (Micro-Events with Templates) =====

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_id UUID NOT NULL REFERENCES users(id),
  template_key VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  lat DOUBLE PRECISION NOT NULL,
  lon DOUBLE PRECISION NOT NULL,
  geoid VARCHAR(20) NOT NULL REFERENCES neighborhood_segments(geoid),
  suburb_type VARCHAR(30) NOT NULL,
  dominant_city VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== EVENT ATTENDANCE =====

CREATE TABLE IF NOT EXISTS event_attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'joined' CHECK(status IN ('joined')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- ===== INTEREST SIGNALS (Ghost Pins) =====

CREATE TABLE IF NOT EXISTS interest_signals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  template_key VARCHAR(50) NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lon DOUBLE PRECISION NOT NULL,
  geoid VARCHAR(20) NOT NULL REFERENCES neighborhood_segments(geoid),
  suburb_type VARCHAR(30) NOT NULL,
  dominant_city VARCHAR(20) NOT NULL,
  interested_count INTEGER DEFAULT 1,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== INTEREST SIGNAL USERS (Track who expressed interest) =====

CREATE TABLE IF NOT EXISTS interest_signal_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  signal_id UUID NOT NULL REFERENCES interest_signals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(signal_id, user_id)
);

-- ===== INDEXES FOR PERFORMANCE =====

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_events_geoid ON events(geoid);
CREATE INDEX IF NOT EXISTS idx_events_start_time ON events(start_time);
CREATE INDEX IF NOT EXISTS idx_events_template_key ON events(template_key);
CREATE INDEX IF NOT EXISTS idx_event_attendance_event_id ON event_attendance(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendance_user_id ON event_attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_interest_signals_geoid ON interest_signals(geoid);
CREATE INDEX IF NOT EXISTS idx_interest_signals_expires_at ON interest_signals(expires_at);

-- ===== AUTO-UPDATE TIMESTAMPS =====

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
SELECT 'V3 Database setup complete! ✅' as status;

