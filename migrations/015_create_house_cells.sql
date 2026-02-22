-- Issue #14: House Cell Community
-- Create house cells table
CREATE TABLE house_cells (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  leader_id UUID REFERENCES users(id),
  leader_name TEXT,
  leader_phone TEXT,
  address TEXT NOT NULL,
  city TEXT,
  state TEXT,
  country TEXT,
  meeting_day TEXT,
  meeting_time TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Create house cell messages table for real-time chat
CREATE TABLE house_cell_messages (
  id SERIAL PRIMARY KEY,
  house_cell_id INTEGER NOT NULL REFERENCES house_cells(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add house_cell_id to users if not exists (we have house_cell_location but let's add a proper FK)
ALTER TABLE users ADD COLUMN IF NOT EXISTS house_cell_id INTEGER REFERENCES house_cells(id);
