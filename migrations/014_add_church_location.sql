-- Issue #12: Google Map of District Fellowship
-- Add church location fields to branding table
ALTER TABLE branding ADD COLUMN church_name TEXT;
ALTER TABLE branding ADD COLUMN church_address TEXT;
ALTER TABLE branding ADD COLUMN church_city TEXT;
ALTER TABLE branding ADD COLUMN church_state TEXT;
ALTER TABLE branding ADD COLUMN church_country TEXT;
ALTER TABLE branding ADD COLUMN church_zip_code TEXT;
ALTER TABLE branding ADD COLUMN church_phone TEXT;
ALTER TABLE branding ADD COLUMN church_email TEXT;
ALTER TABLE branding ADD COLUMN church_latitude TEXT;
ALTER TABLE branding ADD COLUMN church_longitude TEXT;
