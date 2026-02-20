-- Create fundraising_campaigns table
CREATE TABLE IF NOT EXISTS fundraising_campaigns (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  goal_amount INTEGER NOT NULL,
  current_amount INTEGER DEFAULT 0,
  image_url TEXT,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Add campaign_id to donations table
ALTER TABLE donations ADD COLUMN IF NOT EXISTS campaign_id INTEGER REFERENCES fundraising_campaigns(id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_fundraising_campaigns_is_active ON fundraising_campaigns(is_active);
CREATE INDEX IF NOT EXISTS idx_donations_campaign_id ON donations(campaign_id);
