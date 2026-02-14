-- Migration: Add creator_id to events table
-- Date: 2026-02-14

ALTER TABLE events ADD COLUMN IF NOT EXISTS creator_id UUID REFERENCES users(id);
