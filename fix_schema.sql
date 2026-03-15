-- Robust SQL patch to stabilize the database and align with standard schema
BEGIN;

-- 1. Organizations Table
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    logo_url TEXT,
    favicon_url TEXT,
    colors TEXT DEFAULT '{"primary":"#3b82f6","secondary":"#ffffff","accent":"#10b981"}',
    fonts TEXT DEFAULT '{"heading":"Inter","body":"Inter"}',
    church_name TEXT,
    church_address TEXT,
    church_city TEXT,
    church_state TEXT,
    church_country TEXT,
    church_zip_code TEXT,
    church_phone TEXT,
    church_email TEXT,
    church_latitude TEXT,
    church_longitude TEXT,
    service_times TEXT DEFAULT '{"sunday":"7:00 AM & 9:00 AM","wednesday":"6:00 PM","friday":"7:00 PM"}',
    youtube_url TEXT,
    instagram_url TEXT,
    facebook_url TEXT,
    twitter_url TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- 2. Users Table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN DEFAULT false NOT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false NOT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);

-- 3. Branding Table (Recreate to match schema.ts)
DROP TABLE IF EXISTS branding;
CREATE TABLE branding (
    id SERIAL PRIMARY KEY,
    colors JSONB DEFAULT '{"primary": "#000000", "secondary": "#ffffff", "accent": "#3b82f6"}',
    logo_url TEXT,
    favicon_url TEXT,
    fonts JSONB DEFAULT '{"heading": "Inter", "body": "Inter"}',
    church_name TEXT,
    church_address TEXT,
    church_city TEXT,
    church_state TEXT,
    church_country TEXT,
    church_zip_code TEXT,
    church_phone TEXT,
    church_email TEXT,
    church_latitude TEXT,
    church_longitude TEXT,
    service_times JSONB DEFAULT '{"sunday": "7:00 AM & 9:00 AM", "wednesday": "6:00 PM", "friday": "7:00 PM"}',
    youtube_url TEXT,
    instagram_url TEXT,
    facebook_url TEXT,
    twitter_url TEXT,
    organization_id UUID REFERENCES organizations(id),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Create other tables if they don't exist
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    location TEXT NOT NULL,
    image_url TEXT,
    creator_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    is_recurring BOOLEAN DEFAULT false,
    recurrence_rule VARCHAR(50),
    recurrence_end_date TIMESTAMP,
    category VARCHAR(100),
    tags TEXT[],
    allow_feedback BOOLEAN DEFAULT true,
    is_virtual BOOLEAN DEFAULT false,
    virtual_link VARCHAR(500),
    capacity INTEGER,
    organization_id UUID REFERENCES organizations(id)
);

CREATE TABLE IF NOT EXISTS event_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    color VARCHAR(20) DEFAULT '#3B82F6',
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    organization_id UUID REFERENCES organizations(id)
);

CREATE TABLE IF NOT EXISTS sermons (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    speaker TEXT NOT NULL,
    date TIMESTAMP NOT NULL,
    topic TEXT,
    video_url TEXT,
    video_file_path TEXT,
    audio_url TEXT,
    audio_file_path TEXT,
    series TEXT,
    description TEXT,
    thumbnail_url TEXT,
    is_upcoming BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    organization_id UUID REFERENCES organizations(id)
);

CREATE TABLE IF NOT EXISTS prayer_requests (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    author_name TEXT,
    content TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT false,
    is_answered BOOLEAN DEFAULT false,
    answered_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    pray_count INTEGER DEFAULT 0,
    organization_id UUID REFERENCES organizations(id)
);

CREATE TABLE IF NOT EXISTS donations (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'usd',
    status TEXT NOT NULL,
    campaign_id INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    organization_id UUID REFERENCES organizations(id)
);

-- Add column to tables that might already exist
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'events') THEN
        ALTER TABLE events ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);
    END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'sermons') THEN
        ALTER TABLE sermons ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);
    END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'prayer_requests') THEN
        ALTER TABLE prayer_requests ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);
    END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'donations') THEN
        ALTER TABLE donations ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations(id);
    END IF;
END $$;

COMMIT;
