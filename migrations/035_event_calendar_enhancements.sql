-- Event Calendar Enhancements: Recurring Events, Categories, Tags, Feedback

-- Add new columns to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS end_date TIMESTAMP;
ALTER TABLE events ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT FALSE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS recurrence_rule VARCHAR(50); -- FREQ=WEEKLY;FREQ=MONTHLY;FREQ=YEARLY
ALTER TABLE events ADD COLUMN IF NOT EXISTS recurrence_end_date TIMESTAMP;
ALTER TABLE events ADD COLUMN IF NOT EXISTS category VARCHAR(100);
ALTER TABLE events ADD COLUMN IF NOT EXISTS tags TEXT[]; -- Array of tags
ALTER TABLE events ADD COLUMN IF NOT EXISTS allow_feedback BOOLEAN DEFAULT TRUE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS is_virtual BOOLEAN DEFAULT FALSE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS virtual_link VARCHAR(500);
ALTER TABLE events ADD COLUMN IF NOT EXISTS capacity INTEGER;

-- Create event categories table
CREATE TABLE IF NOT EXISTS event_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  color VARCHAR(20) DEFAULT '#3B82F6',
  icon VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create event feedback table
CREATE TABLE IF NOT EXISTS event_feedback (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  would_recommend BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for event feedback
CREATE INDEX IF NOT EXISTS idx_event_feedback_event_id ON event_feedback(event_id);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);

-- Insert default event categories
INSERT INTO event_categories (name, color, icon) VALUES
  ('Sunday Service', '#3B82F6', 'church'),
  ('Bible Study', '#8B5CF6', 'book-open'),
  ('Youth', '#EC4899', 'users'),
  ('Children', '#F59E0B', 'baby'),
  ('Prayer', '#10B981', 'heart'),
  ('Fellowship', '#F97316', 'coffee'),
  ('Outreach', '#06B6D4', 'globe'),
  ('Music', '#EF4444', 'music'),
  ('Training', '#6366F1', 'graduation-cap'),
  ('Other', '#6B7280', 'calendar')
ON CONFLICT (name) DO NOTHING;

-- Add columns to event_rsvps for tracking virtual events
ALTER TABLE event_rsvps ADD COLUMN IF NOT EXISTS attended BOOLEAN DEFAULT FALSE;
ALTER TABLE event_rsvps ADD COLUMN IF NOT EXISTS checked_in_at TIMESTAMP;
