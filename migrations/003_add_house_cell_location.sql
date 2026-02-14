-- Migration: Add house_cell_location column to users table
-- Date: 2026-02-14

ALTER TABLE users ADD COLUMN IF NOT EXISTS house_cell_location TEXT;
