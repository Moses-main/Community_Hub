-- Sermon Clip Generator
CREATE TABLE sermon_clips (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  source_video_url TEXT,
  source_video_path TEXT,
  clip_start_time INTEGER NOT NULL,
  clip_end_time INTEGER NOT NULL,
  format TEXT NOT NULL DEFAULT 'landscape',
  overlay_text TEXT,
  verse_reference TEXT,
  output_url TEXT,
  output_path TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create directory for clips
-- mkdir -p uploads/clips
