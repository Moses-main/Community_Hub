-- Migration: Create Volunteer Management tables
-- For issue #27: Volunteer & Service Team Management

-- Volunteer Skills
CREATE TABLE IF NOT EXISTS volunteer_skills (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT
);

-- Volunteer Profiles
CREATE TABLE IF NOT EXISTS volunteer_profiles (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL UNIQUE,
    skills JSONB DEFAULT '[]',
    availability JSONB DEFAULT '{}',
    total_hours INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    joined_at TIMESTAMP DEFAULT NOW()
);

-- Volunteer Opportunities
CREATE TABLE IF NOT EXISTS volunteer_opportunities (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    required_skills JSONB DEFAULT '[]',
    date TIMESTAMP NOT NULL,
    duration INTEGER,
    location TEXT,
    spots_available INTEGER,
    spots_filled INTEGER DEFAULT 0,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Volunteer Assignments
CREATE TABLE IF NOT EXISTS volunteer_assignments (
    id SERIAL PRIMARY KEY,
    volunteer_id UUID REFERENCES users(id) NOT NULL,
    opportunity_id INTEGER REFERENCES volunteer_opportunities(id) NOT NULL,
    status TEXT DEFAULT 'pending',
    check_in_at TIMESTAMP,
    check_out_at TIMESTAMP,
    hours_worked INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Volunteer Badges
CREATE TABLE IF NOT EXISTS volunteer_badges (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    criteria TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- User Badges
CREATE TABLE IF NOT EXISTS user_badges (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    badge_id INTEGER REFERENCES volunteer_badges(id) NOT NULL,
    earned_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_volunteer_profiles_user_id ON volunteer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_opportunities_date ON volunteer_opportunities(date);
CREATE INDEX IF NOT EXISTS idx_volunteer_opportunities_is_active ON volunteer_opportunities(is_active);
CREATE INDEX IF NOT EXISTS idx_volunteer_assignments_volunteer_id ON volunteer_assignments(volunteer_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_assignments_opportunity_id ON volunteer_assignments(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
