-- Add last_contacted_at to track when absent members were contacted
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMP;
