-- Issue #7: Prayer Requests and Prayer Wall enhancement
ALTER TABLE prayer_requests ADD COLUMN is_answered BOOLEAN DEFAULT FALSE;
ALTER TABLE prayer_requests ADD COLUMN answered_at TIMESTAMP;
