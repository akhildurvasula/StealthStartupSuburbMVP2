-- Suburb Events Database Schema for Supabase
-- This version is safe to run multiple times

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing constraints if they exist (to avoid conflicts)
ALTER TABLE IF EXISTS events DROP CONSTRAINT IF EXISTS fk_events_hoa_location;
ALTER TABLE IF EXISTS users DROP CONSTRAINT IF EXISTS fk_users_suburb;

-- ===== USERS & AUTHENTICATION =====

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255),
  role VARCHAR(20) NOT NULL DEFAULT 'RESIDENT' CHECK(role IN ('RESIDENT', 'ARTIST', 'HOA_ADMIN')),
  suburb_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== SUBURBS & INTELLIGENCE =====

CREATE TABLE IF NOT EXISTS suburbs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK(type IN ('STARTER', 'ESTABLISHED', 'TIER_3')),
  lat DOUBLE PRECISION NOT NULL,
  lon DOUBLE PRECISION NOT NULL,
  population INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS suburb_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  suburb_id UUID UNIQUE NOT NULL REFERENCES suburbs(id) ON DELETE CASCADE,
  event_density DOUBLE PRECISION DEFAULT 0,
  artist_interest_score DOUBLE PRECISION DEFAULT 0,
  average_attendance DOUBLE PRECISION DEFAULT 0,
  last_calculated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== EVENTS =====

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  host_id UUID NOT NULL REFERENCES users(id),
  host_type VARCHAR(20) NOT NULL CHECK(host_type IN ('RESIDENT', 'ARTIST', 'HOA')),
  suburb_id UUID NOT NULL REFERENCES suburbs(id),
  location_lat DOUBLE PRECISION NOT NULL,
  location_lon DOUBLE PRECISION NOT NULL,
  date_time TIMESTAMP WITH TIME ZONE NOT NULL,
  category VARCHAR(100) NOT NULL,
  expected_capacity INTEGER,
  actual_attendance INTEGER DEFAULT 0,
  hoa_location_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_attendances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'JOINED' CHECK(status IN ('JOINED', 'LEFT')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- ===== HOA INTEGRATION =====

CREATE TABLE IF NOT EXISTS hoas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  admin_id UUID NOT NULL REFERENCES users(id),
  suburb_id UUID NOT NULL REFERENCES suburbs(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hoa_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hoa_id UUID NOT NULL REFERENCES hoas(id) ON DELETE CASCADE,
  suburb_id UUID NOT NULL REFERENCES suburbs(id),
  lat DOUBLE PRECISION NOT NULL,
  lon DOUBLE PRECISION NOT NULL,
  description TEXT,
  preferred_types TEXT[] DEFAULT '{}',
  max_capacity INTEGER,
  available_times TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===== RESIDENT HOME HOSTING =====

CREATE TABLE IF NOT EXISTS user_home_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lat DOUBLE PRECISION NOT NULL,
  lon DOUBLE PRECISION NOT NULL,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraints (safe to run multiple times now)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_events_hoa_location'
  ) THEN
    ALTER TABLE events 
      ADD CONSTRAINT fk_events_hoa_location 
      FOREIGN KEY (hoa_location_id) 
      REFERENCES hoa_locations(id) 
      ON DELETE SET NULL;
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_users_suburb'
  ) THEN
    ALTER TABLE users 
      ADD CONSTRAINT fk_users_suburb 
      FOREIGN KEY (suburb_id) 
      REFERENCES suburbs(id) 
      ON DELETE SET NULL;
  END IF;
END $$;

-- ===== INDEXES FOR PERFORMANCE =====

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_suburb_id ON users(suburb_id);

CREATE INDEX IF NOT EXISTS idx_events_suburb_id ON events(suburb_id);
CREATE INDEX IF NOT EXISTS idx_events_host_id ON events(host_id);
CREATE INDEX IF NOT EXISTS idx_events_date_time ON events(date_time);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);

CREATE INDEX IF NOT EXISTS idx_event_attendances_event_id ON event_attendances(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendances_user_id ON event_attendances(user_id);

CREATE INDEX IF NOT EXISTS idx_hoa_locations_suburb_id ON hoa_locations(suburb_id);
CREATE INDEX IF NOT EXISTS idx_hoa_locations_hoa_id ON hoa_locations(hoa_id);

-- ===== FUNCTIONS FOR AUTO-UPDATED TIMESTAMPS =====

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_suburbs_updated_at ON suburbs;
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
DROP TRIGGER IF EXISTS update_event_attendances_updated_at ON event_attendances;
DROP TRIGGER IF EXISTS update_hoas_updated_at ON hoas;
DROP TRIGGER IF EXISTS update_hoa_locations_updated_at ON hoa_locations;
DROP TRIGGER IF EXISTS update_user_home_locations_updated_at ON user_home_locations;

-- Create triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suburbs_updated_at BEFORE UPDATE ON suburbs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_attendances_updated_at BEFORE UPDATE ON event_attendances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hoas_updated_at BEFORE UPDATE ON hoas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hoa_locations_updated_at BEFORE UPDATE ON hoa_locations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_home_locations_updated_at BEFORE UPDATE ON user_home_locations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
SELECT 'Database setup complete! ✅' as status;
