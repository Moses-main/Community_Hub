-- Migration: Create AI Sermon Search & Smart Recommendations
-- For issue #18: AI Sermon Search & Smart Recommendations

-- Sermon Embeddings (for semantic search)
CREATE TABLE IF NOT EXISTS sermon_embeddings (
    id SERIAL PRIMARY KEY,
    sermon_id INTEGER REFERENCES sermons(id) NOT NULL,
    embedding vector(1536),
    summary TEXT,
    key_topics TEXT[],
    created_at TIMESTAMP DEFAULT NOW()
);

-- Sermon Views (for recommendations)
CREATE TABLE IF NOT EXISTS sermon_views (
    id SERIAL PRIMARY KEY,
    sermon_id INTEGER REFERENCES sermons(id) NOT NULL,
    user_id UUID REFERENCES users(id),
    watch_duration INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    viewed_at TIMESTAMP DEFAULT NOW()
);

-- User Sermon Preferences
CREATE TABLE IF NOT EXISTS user_sermon_preferences (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL UNIQUE,
    favorite_speakers TEXT[],
    favorite_topics TEXT[],
    favorite_series TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Sermon Recommendations Cache
CREATE TABLE IF NOT EXISTS sermon_recommendations (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    recommended_sermons JSONB DEFAULT '[]',
    based_on TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sermon_views_sermon_id ON sermon_views(sermon_id);
CREATE INDEX IF NOT EXISTS idx_sermon_views_user_id ON sermon_views(user_id);
CREATE INDEX IF NOT EXISTS idx_sermon_embeddings_sermon_id ON sermon_embeddings(sermon_id);
CREATE INDEX IF NOT EXISTS idx_user_sermon_preferences_user_id ON user_sermon_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_sermon_recommendations_user_id ON sermon_recommendations(user_id);

-- Note: vector extension needs to be enabled for embedding search
-- CREATE EXTENSION IF NOT EXISTS vector;
