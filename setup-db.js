import pkg from "pg";
const { Pool } = pkg;
import "dotenv/config";

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// SQL to create only the Community Hub tables if they don't exist
const createTables = `
-- Create branding table
CREATE TABLE IF NOT EXISTS branding (
  id SERIAL PRIMARY KEY,
  colors JSONB DEFAULT '{"primary": "#000000", "secondary": "#ffffff", "accent": "#3b82f6"}',
  logo_url TEXT,
  fonts JSONB DEFAULT '{"heading": "Inter", "body": "Inter"}'
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMP NOT NULL,
  location TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create sermons table
CREATE TABLE IF NOT EXISTS sermons (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  speaker TEXT NOT NULL,
  date TIMESTAMP NOT NULL,
  video_url TEXT,
  audio_url TEXT,
  series TEXT,
  description TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create users table if it doesn't exist (for auth)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create prayer_requests table
CREATE TABLE IF NOT EXISTS prayer_requests (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  author_name TEXT,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  pray_count INTEGER DEFAULT 0
);

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create sessions table for authentication
CREATE TABLE IF NOT EXISTS sessions (
  sid VARCHAR NOT NULL COLLATE "default",
  sess JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS session_pkey ON sessions (sid);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_sermons_date ON sermons(date);
CREATE INDEX IF NOT EXISTS idx_sermons_series ON sermons(series);
CREATE INDEX IF NOT EXISTS idx_prayer_requests_created_at ON prayer_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at);
`;

async function setupDatabase() {
  try {
    console.log("🔄 Setting up Community Hub database tables...");

    // Execute the table creation script
    await pool.query(createTables);

    console.log("✅ Database tables created successfully!");
    console.log(
      "📋 Created tables: branding, events, sermons, prayer_requests, donations, users, sessions",
    );

    // Insert default branding if none exists
    const brandingResult = await pool.query("SELECT COUNT(*) FROM branding");
    if (parseInt(brandingResult.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO branding (colors, fonts)
        VALUES (
          '{"primary": "#1e40af", "secondary": "#f8fafc", "accent": "#3b82f6"}',
          '{"heading": "Inter", "body": "Inter"}'
        )
      `);
      console.log("✅ Default branding configuration added");
    }

    console.log("🎉 Database setup complete!");
  } catch (error) {
    console.error("❌ Error setting up database:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the setup
setupDatabase();
