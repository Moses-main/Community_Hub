-- Add missing columns to sermons table for sermon archive feature

DO $$
BEGIN
    -- Add topic column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'sermons' AND column_name = 'topic') THEN
        ALTER TABLE sermons ADD COLUMN topic TEXT;
    END IF;
    
    -- Add video_file_path column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'sermons' AND column_name = 'video_file_path') THEN
        ALTER TABLE sermons ADD COLUMN video_file_path TEXT;
    END IF;
    
    -- Add audio_file_path column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'sermons' AND column_name = 'audio_file_path') THEN
        ALTER TABLE sermons ADD COLUMN audio_file_path TEXT;
    END IF;
    
    -- Add is_upcoming column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'sermons' AND column_name = 'is_upcoming') THEN
        ALTER TABLE sermons ADD COLUMN is_upcoming BOOLEAN NOT NULL DEFAULT false;
    END IF;
    
    RAISE NOTICE 'Successfully updated sermons table with all required columns';
END $$;
