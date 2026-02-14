-- Migration: Create attendance tracking tables
-- Date: 2026-02-14

-- Attendance records table
CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    service_type VARCHAR(50) NOT NULL, -- 'SUNDAY_SERVICE', 'MIDWEEK_SERVICE', 'SPECIAL_EVENT', 'ONLINE_LIVE', 'ONLINE_REPLAY'
    service_id INTEGER, -- Links to sermon/event ID if applicable
    service_name VARCHAR(255) NOT NULL,
    service_date TIMESTAMP NOT NULL,
    attendance_type VARCHAR(50) NOT NULL, -- 'SELF_CHECKIN', 'MANUAL', 'ONLINE_AUTO', 'QR_CHECKIN'
    check_in_time TIMESTAMP,
    watch_duration INTEGER, -- Duration in seconds for online attendance
    is_online BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Unique attendance links per service
CREATE TABLE IF NOT EXISTS attendance_links (
    id SERIAL PRIMARY KEY,
    service_type VARCHAR(50) NOT NULL,
    service_id INTEGER,
    service_name VARCHAR(255) NOT NULL,
    service_date TIMESTAMP NOT NULL,
    unique_token VARCHAR(64) UNIQUE NOT NULL,
    qr_code_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- Attendance settings (for configurable thresholds)
CREATE TABLE IF NOT EXISTS attendance_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_service_date ON attendance(service_date);
CREATE INDEX IF NOT EXISTS idx_attendance_service_type ON attendance(service_type);
CREATE INDEX IF NOT EXISTS idx_attendance_links_token ON attendance_links(unique_token);
CREATE INDEX IF NOT EXISTS idx_attendance_links_service ON attendance_links(service_id, service_type);

-- Insert default attendance settings
INSERT INTO attendance_settings (key, value, description) VALUES
    ('online_watch_threshold_minutes', '10', 'Minimum watch time in minutes to auto-mark online attendance'),
    ('enable_online_detection', 'true', 'Enable automatic online attendance detection'),
    ('enable_self_checkin', 'true', 'Enable self check-in for members'),
    ('enable_qr_checkin', 'true', 'Enable QR code check-in')
ON CONFLICT (key) DO NOTHING;
