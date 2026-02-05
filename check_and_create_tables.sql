-- Check and create missing tables for the church community platform
-- This script will NOT delete existing tables and will avoid conflicts

-- First, let's check what tables we need vs what exists
-- Required tables: users, sessions, branding, events, sermons, prayer_requests, donations

-- Create branding table if it doesn't exist
CREATE TABLE IF NOT EXISTS branding (
    id SERIAL PRIMARY KEY,
    colors JSONB DEFAULT '{"primary": "#000000", "secondary": "#ffffff", "accent": "#3b82f6"}',
    logo_url TEXT,
    fonts JSONB DEFAULT '{"heading": "Inter", "body": "Inter"}'
);

-- Create events table if it doesn't exist
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    date TIMESTAMP NOT NULL,
    location TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create sermons table if it doesn't exist
CREATE TABLE IF NOT EXISTS sermons (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    speaker TEXT NOT NULL,
    date TIMESTAMP NOT NULL,
    video_url TEXT,
    audio_url TEXT,
    series TEXT,
    description TEXT,
    thumbnail_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create prayer_requests table if it doesn't exist
CREATE TABLE IF NOT EXISTS prayer_requests (
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    author_name TEXT,
    content TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    pray_count INTEGER DEFAULT 0
);

-- Create donations table if it doesn't exist
CREATE TABLE IF NOT EXISTS donations (
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'usd',
    status TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create sessions table if it doesn't exist (for authentication)
CREATE TABLE IF NOT EXISTS sessions (
    sid VARCHAR PRIMARY KEY,
    sess JSONB NOT NULL,
    expire TIMESTAMP NOT NULL
);

-- Create index on sessions expire column if it doesn't exist
CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions(expire);

-- Insert default branding if none exists
INSERT INTO branding (colors, fonts) 
SELECT 
    '{"primary": "#3b82f6", "secondary": "#f8fafc", "accent": "#10b981"}',
    '{"heading": "Inter", "body": "Inter"}'
WHERE NOT EXISTS (SELECT 1 FROM branding);

-- Show all tables after creation
SELECT 
    table_name,
    CASE 
        WHEN table_name IN ('users', 'sessions', 'branding', 'events', 'sermons', 'prayer_requests', 'donations') 
        THEN '✓ Required for app'
        ELSE '- Legacy/Other'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY 
    CASE 
        WHEN table_name IN ('users', 'sessions', 'branding', 'events', 'sermons', 'prayer_requests', 'donations') 
        THEN 1 
        ELSE 2 
    END,
    table_name;