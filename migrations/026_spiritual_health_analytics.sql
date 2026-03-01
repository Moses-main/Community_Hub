-- Migration: Create Spiritual Health & Engagement Analytics
-- For issue #29: Spiritual Health & Engagement Analytics

-- Engagement Metrics (tracked daily per user)
CREATE TABLE IF NOT EXISTS user_engagement_metrics (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    sermons_watched INTEGER DEFAULT 0,
    prayers_submitted INTEGER DEFAULT 0,
    events_attended INTEGER DEFAULT 0,
    devotionals_read INTEGER DEFAULT 0,
    group_messages INTEGER DEFAULT 0,
    login_count INTEGER DEFAULT 1,
    total_session_time INTEGER DEFAULT 0,
    UNIQUE(user_id, date)
);

-- Spiritual Health Scores
CREATE TABLE IF NOT EXISTS spiritual_health_scores (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    week_start DATE NOT NULL,
    attendance_score INTEGER DEFAULT 0,
    engagement_score INTEGER DEFAULT 0,
    growth_score INTEGER DEFAULT 0,
    overall_score INTEGER DEFAULT 0,
    calculated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, week_start)
);

-- Discipleship Progress Analytics
CREATE TABLE IF NOT EXISTS discipleship_analytics (
    id SERIAL PRIMARY KEY,
    track_id INTEGER,
    total_enrolled INTEGER DEFAULT 0,
    active_learners INTEGER DEFAULT 0,
    completed_count INTEGER DEFAULT 0,
    average_completion_time INTEGER,
    quiz_average_score INTEGER,
    week_start DATE NOT NULL,
    UNIQUE(track_id, week_start)
);

-- Group Participation Analytics
CREATE TABLE IF NOT EXISTS group_analytics (
    id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES groups(id),
    week_start DATE NOT NULL,
    active_members INTEGER DEFAULT 0,
    messages_count INTEGER DEFAULT 0,
    meetings_held INTEGER DEFAULT 0,
    new_members INTEGER DEFAULT 0,
    UNIQUE(group_id, week_start)
);

-- Exportable Reports
CREATE TABLE IF NOT EXISTS analytics_reports (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    report_type TEXT NOT NULL,
    filters JSONB DEFAULT '{}',
    generated_by UUID REFERENCES users(id),
    file_path TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_engagement_metrics_user_id ON user_engagement_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_engagement_metrics_date ON user_engagement_metrics(date);
CREATE INDEX IF NOT EXISTS idx_spiritual_health_scores_user_id ON spiritual_health_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_spiritual_health_scores_week_start ON spiritual_health_scores(week_start);
CREATE INDEX IF NOT EXISTS idx_discipleship_analytics_track_id ON discipleship_analytics(track_id);
CREATE INDEX IF NOT EXISTS idx_group_analytics_group_id ON group_analytics(group_id);
CREATE INDEX IF NOT EXISTS idx_analytics_reports_generated_by ON analytics_reports(generated_by);
