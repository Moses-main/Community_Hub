-- Drop existing users table if it exists
DROP TABLE IF EXISTS users CASCADE;

-- Create the users table with all required columns
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  verification_token TEXT,
  verification_token_expires TIMESTAMP,
  reset_password_token TEXT,
  reset_password_expires TIMESTAMP,
  role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('ADMIN', 'USER')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Recreate any dependent tables with the correct foreign key
DROP TABLE IF EXISTS prayer_requests CASCADE;
CREATE TABLE prayer_requests (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  author_name TEXT,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  pray_count INTEGER DEFAULT 0
);

-- Recreate donations table with correct foreign key
DROP TABLE IF EXISTS donations CASCADE;
CREATE TABLE donations (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Recreate indexes
CREATE INDEX IF NOT EXISTS idx_prayer_requests_created_at ON prayer_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at);
