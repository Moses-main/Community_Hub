-- Migration: Create member messages table
-- Date: 2026-02-14

CREATE TABLE IF NOT EXISTS member_messages (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    type VARCHAR(50) NOT NULL, -- 'ABSENCE_ALERT', 'GENERAL', 'PASTORAL', 'ANNOUNCEMENT'
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    priority VARCHAR(20) DEFAULT 'normal', -- 'high', 'normal', 'low'
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_member_messages_user_id ON member_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_member_messages_created_at ON member_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_member_messages_is_read ON member_messages(is_read);
