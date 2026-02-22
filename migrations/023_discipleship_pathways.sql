-- Discipleship Pathways
CREATE TYPE track_category AS ENUM ('new_believer', 'leadership', 'discipleship', 'ministry', 'theology', 'practical', 'other');

CREATE TABLE discipleship_tracks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category track_category DEFAULT 'other',
  image_url TEXT,
  estimated_weeks INTEGER,
  is_active BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  track_id INTEGER REFERENCES discipleship_tracks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  video_url TEXT,
  "order" INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE quizzes (
  id SERIAL PRIMARY KEY,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  "order" INTEGER DEFAULT 0
);

CREATE TABLE user_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  track_id INTEGER REFERENCES discipleship_tracks(id) ON DELETE CASCADE,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  quiz_score INTEGER,
  quiz_attempts INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, track_id, lesson_id)
);

CREATE TABLE reflections (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_private BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed some default tracks
INSERT INTO discipleship_tracks (title, description, category, estimated_weeks, "order") VALUES
('New Believer Basics', 'Foundational courses for new believers to grow in their faith journey.', 'new_believer', 8, 1),
('Leadership Development', 'Equip emerging leaders with biblical principles and practical skills.', 'leadership', 12, 2),
('Deep Discipleship', 'Advanced study for mature believers seeking deeper spiritual growth.', 'discipleship', 10, 3),
('Practical Ministry', 'Hands-on training for various ministry roles in the church.', 'ministry', 6, 4);

-- Seed some sample lessons for New Believer Basics
INSERT INTO lessons (track_id, title, description, content, "order", is_published) VALUES
(1, 'What it Means to Follow Christ', 'Understanding the basics of salvation and discipleship.', '<h2>What it Means to Follow Christ</h2><p>Being a follower of Christ means...</p>', 1, true),
(1, 'Reading Your Bible', 'How to effectively read and understand Scripture.', '<h2>Reading Your Bible</h2><p>The Bible is God''s Word to us...</p>', 2, true),
(1, 'Prayer Basics', 'Learning to communicate with God.', '<h2>Prayer Basics</h2><p>Prayer is our conversation with God...</p>', 3, true),
(1, 'Fellowship & Community', 'The importance of being part of a church family.', '<h2>Fellowship & Community</h2><p>We are not meant to walk alone...</p>', 4, true);

-- Seed quizzes for first lesson
INSERT INTO quizzes (lesson_id, question, options, correct_answer, explanation, "order") VALUES
(1, 'What is the first step to following Christ?', '["Accepting Jesus as Lord and Savior", "Reading the entire Bible", "Joining a church committee", "Being baptized"]', 0, 'Accepting Jesus as Lord and Savior is the first step in following Christ.', 1),
(1, 'Why is repentance important?', '["It makes us feel good", "It turns us away from sin and toward God", "It is required by law", "It impresses others"]', 1, 'Repentance means turning away from sin and toward God.', 2);
