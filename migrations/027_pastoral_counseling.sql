-- Migration: Create Pastoral Care & Counseling System
-- For issue #23: Pastoral Care & Counseling System

-- Counseling Requests
CREATE TABLE IF NOT EXISTS counseling_requests (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    request_type TEXT NOT NULL, -- counseling, prayer, visit, other
    urgency TEXT DEFAULT 'normal', -- low, normal, high, urgent
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, assigned, in_progress, completed, cancelled
    assigned_to UUID REFERENCES users(id),
    assigned_at TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Counseling Notes (confidential)
CREATE TABLE IF NOT EXISTS counseling_notes (
    id SERIAL PRIMARY KEY,
    request_id INTEGER REFERENCES counseling_requests(id) NOT NULL,
    author_id UUID REFERENCES users(id) NOT NULL,
    content TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Follow-up Reminders
CREATE TABLE IF NOT EXISTS counseling_followups (
    id SERIAL PRIMARY KEY,
    request_id INTEGER REFERENCES counseling_requests(id) NOT NULL,
    scheduled_date DATE NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Pastoral Visit Records
CREATE TABLE IF NOT EXISTS pastoral_visits (
    id SERIAL PRIMARY KEY,
    request_id INTEGER REFERENCES counseling_requests(id),
    visitor_id UUID REFERENCES users(id) NOT NULL,
    visited_user_id UUID REFERENCES users(id),
    visit_date DATE NOT NULL,
    location TEXT,
    notes TEXT,
    follow_up_needed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_counseling_requests_user_id ON counseling_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_counseling_requests_assigned_to ON counseling_requests(assigned_to);
CREATE INDEX IF NOT EXISTS idx_counseling_requests_status ON counseling_requests(status);
CREATE INDEX IF NOT EXISTS idx_counseling_notes_request_id ON counseling_notes(request_id);
CREATE INDEX IF NOT EXISTS idx_counseling_followups_request_id ON counseling_followups(request_id);
CREATE INDEX IF NOT EXISTS idx_pastoral_visits_request_id ON pastoral_visits(request_id);
CREATE INDEX IF NOT EXISTS idx_pastoral_visits_visited_user_id ON pastoral_visits(visited_user_id);
