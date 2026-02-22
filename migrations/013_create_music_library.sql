-- Issue #9: Worship Music Library
CREATE TABLE music_genres (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE music (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT,
  genre_id INTEGER REFERENCES music_genres(id),
  duration INTEGER,
  audio_url TEXT,
  audio_file_path TEXT,
  cover_image_url TEXT,
  lyrics TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  play_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

CREATE TABLE music_playlists (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  user_id UUID REFERENCES users(id),
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE playlist_music (
  id SERIAL PRIMARY KEY,
  playlist_id INTEGER NOT NULL REFERENCES music_playlists(id) ON DELETE CASCADE,
  music_id INTEGER NOT NULL REFERENCES music(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  added_at TIMESTAMP DEFAULT NOW()
);
