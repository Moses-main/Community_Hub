-- Migration: Create Privacy, Safety & Moderation Controls
-- For issue #32: Privacy, Safety & Moderation Controls

-- Privacy Settings
CREATE TABLE IF NOT EXISTS privacy_settings (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL UNIQUE,
    profile_visibility VARCHAR(50) DEFAULT 'members',
    show_email BOOLEAN DEFAULT FALSE,
    show_phone BOOLEAN DEFAULT FALSE,
    show_birthday BOOLEAN DEFAULT TRUE,
    show_social_links BOOLEAN DEFAULT TRUE,
    allow_messages BOOLEAN DEFAULT TRUE,
    allow_group_invites BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Report Categories
CREATE TABLE IF NOT EXISTS report_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    severity_level INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE
);

-- User Reports
CREATE TABLE IF NOT EXISTS user_reports (
    id SERIAL PRIMARY KEY,
    reporter_id UUID REFERENCES users(id) NOT NULL,
    reported_user_id UUID REFERENCES users(id),
    reported_content_id INTEGER,
    reported_content_type VARCHAR(50),
    category_id INTEGER REFERENCES report_categories(id),
    reason TEXT NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    resolved_by UUID REFERENCES users(id),
    resolved_at TIMESTAMP,
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Content Moderation Queue
CREATE TABLE IF NOT EXISTS moderation_queue (
    id SERIAL PRIMARY KEY,
    content_type VARCHAR(50) NOT NULL,
    content_id INTEGER NOT NULL,
    content_data JSONB,
    flagged_by UUID REFERENCES users(id),
    flag_reason VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending',
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP,
    action VARCHAR(50),
    action_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Blocked Users
CREATE TABLE IF NOT EXISTS user_blocks (
    id SERIAL PRIMARY KEY,
    blocker_id UUID REFERENCES users(id) NOT NULL,
    blocked_id UUID REFERENCES users(id) NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(blocker_id, blocked_id)
);

-- Hidden Content
CREATE TABLE IF NOT EXISTS user_hidden_content (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    content_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, content_type, content_id)
);

-- Session Management
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    session_token VARCHAR(255) NOT NULL,
    device_info VARCHAR(500),
    ip_address VARCHAR(50),
    last_active TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Login History
CREATE TABLE IF NOT EXISTS login_history (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    ip_address VARCHAR(50),
    device_info VARCHAR(500),
    location VARCHAR(255),
    success BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Two-Factor Authentication
CREATE TABLE IF NOT EXISTS user_2fa (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL UNIQUE,
    secret VARCHAR(255) NOT NULL,
    enabled BOOLEAN DEFAULT FALSE,
    backup_codes TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Data Export Requests
CREATE TABLE IF NOT EXISTS data_export_requests (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    export_data JSONB DEFAULT '[]',
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Data Deletion Requests
CREATE TABLE IF NOT EXISTS data_deletion_requests (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    scheduled_deletion DATE,
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_privacy_settings_user_id ON privacy_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_reports_reporter_id ON user_reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_user_reports_reported_user_id ON user_reports(reported_user_id);
CREATE INDEX IF NOT EXISTS idx_user_reports_status ON user_reports(status);
CREATE INDEX IF NOT EXISTS idx_moderation_queue_status ON moderation_queue(status);
CREATE INDEX IF NOT EXISTS idx_user_blocks_blocker_id ON user_blocks(blocker_id);
CREATE INDEX IF NOT EXISTS idx_user_hidden_content_user_id ON user_hidden_content(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_login_history_user_id ON login_history(user_id);
CREATE INDEX IF NOT EXISTS idx_data_export_requests_user_id ON data_export_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_data_deletion_requests_user_id ON data_deletion_requests(user_id);

-- Default report categories
INSERT INTO report_categories (name, description, severity_level) VALUES
('spam', 'Spam or irrelevant content', 1),
('harassment', 'Harassment or bullying', 3),
('inappropriate_content', 'Inappropriate or offensive content', 2),
('fake_account', 'Fake or impersonation account', 3),
('privacy_violation', 'Privacy violation', 2),
('violence', 'Violent or harmful content', 3),
('misinformation', 'False or misleading information', 2)
ON CONFLICT DO NOTHING;
