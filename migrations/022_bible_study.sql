-- Migration: Create Bible Study tables
-- For issue #20: Interactive Bible & Study Tools

-- User Highlights
CREATE TABLE IF NOT EXISTS user_highlights (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    book TEXT NOT NULL,
    chapter INTEGER NOT NULL,
    verse INTEGER NOT NULL,
    color TEXT DEFAULT '#FFEB3B',
    note TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- User Notes
CREATE TABLE IF NOT EXISTS user_notes (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    book TEXT NOT NULL,
    chapter INTEGER NOT NULL,
    verse INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Verse Discussions
CREATE TABLE IF NOT EXISTS verse_discussions (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    book TEXT NOT NULL,
    chapter INTEGER NOT NULL,
    verse INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Group Annotations
CREATE TABLE IF NOT EXISTS group_annotations (
    id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES groups(id) NOT NULL,
    book TEXT NOT NULL,
    chapter INTEGER NOT NULL,
    verse INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_by UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_highlights_user_id ON user_highlights(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_user_id ON user_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_verse_discussions ON verse_discussions(book, chapter, verse);
CREATE INDEX IF NOT EXISTS idx_group_annotations_group_id ON group_annotations(group_id);
