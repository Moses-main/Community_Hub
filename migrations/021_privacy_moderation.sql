-- Migration: Create Privacy & Moderation tables
-- For issue #32: Privacy, Safety & Moderation Controls

-- Privacy Settings
CREATE TABLE IF NOT EXISTS privacy_settings (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL UNIQUE,
    show_profile BOOLEAN DEFAULT TRUE,
    show_attendance BOOLEAN DEFAULT TRUE,
    show_donations BOOLEAN DEFAULT FALSE,
    show_prayer_requests BOOLEAN DEFAULT TRUE,
    allow_messaging BOOLEAN DEFAULT TRUE,
    show_in_directory BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Content Flags
CREATE TABLE IF NOT EXISTS content_flags (
    id SERIAL PRIMARY KEY,
    content_type TEXT NOT NULL,
    content_id INTEGER NOT NULL,
    reporter_id UUID REFERENCES users(id),
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    reviewed_by UUID REFERENCES users(id),
    review_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Abuse Reports
CREATE TABLE IF NOT EXISTS abuse_reports (
    id SERIAL PRIMARY KEY,
    reporter_id UUID REFERENCES users(id) NOT NULL,
    reported_user_id UUID REFERENCES users(id),
    reported_content_id INTEGER,
    reported_content_type TEXT,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    evidence JSONB DEFAULT '[]',
    status TEXT DEFAULT 'pending',
    resolution TEXT,
    resolved_by UUID REFERENCES users(id),
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_privacy_settings_user_id ON privacy_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_content_flags_content_type ON content_flags(content_type);
CREATE INDEX IF NOT EXISTS idx_content_flags_status ON content_flags(status);
CREATE INDEX IF NOT EXISTS idx_abuse_reports_status ON abuse_reports(status);
CREATE INDEX IF NOT EXISTS idx_abuse_reports_reporter_id ON abuse_reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_abuse_reports_reported_user_id ON abuse_reports(reported_user_id);
