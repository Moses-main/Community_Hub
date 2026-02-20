-- Create daily_devotionals table
CREATE TABLE IF NOT EXISTS daily_devotionals (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT,
  bible_verse TEXT,
  theme TEXT,
  image_url TEXT,
  publish_date TIMESTAMP NOT NULL,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Create bible_reading_plans table
CREATE TABLE IF NOT EXISTS bible_reading_plans (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Create bible_reading_progress table
CREATE TABLE IF NOT EXISTS bible_reading_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  plan_id INTEGER REFERENCES bible_reading_plans(id) NOT NULL,
  day_number INTEGER NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  UNIQUE(user_id, plan_id, day_number)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_daily_devotionals_publish_date ON daily_devotionals(publish_date);
CREATE INDEX IF NOT EXISTS idx_daily_devotionals_is_published ON daily_devotionals(is_published);
CREATE INDEX IF NOT EXISTS idx_bible_reading_plans_is_active ON bible_reading_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_bible_reading_progress_user_plan ON bible_reading_progress(user_id, plan_id);
