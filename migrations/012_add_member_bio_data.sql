-- Issue #42: Add more bio data to members profile
ALTER TABLE users ADD COLUMN career TEXT;
ALTER TABLE users ADD COLUMN state_of_origin TEXT;
ALTER TABLE users ADD COLUMN birthday DATE;
ALTER TABLE users ADD COLUMN twitter_handle TEXT;
ALTER TABLE users ADD COLUMN instagram_handle TEXT;
ALTER TABLE users ADD COLUMN facebook_handle TEXT;
ALTER TABLE users ADD COLUMN linkedin_handle TEXT;
