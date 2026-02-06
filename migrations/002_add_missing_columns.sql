-- First, create the enum type if it doesn't exist
CREATE TYPE user_role AS ENUM ('ADMIN', 'USER');

-- Add missing columns to users table if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'users' AND column_name = 'is_admin') THEN
        ALTER TABLE users ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT false;
    END IF;
    
    -- Add password_hash column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'users' AND column_name = 'password_hash') THEN
        ALTER TABLE users ADD COLUMN password_hash TEXT;
    END IF;
    
    -- Add first_name column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'users' AND column_name = 'first_name') THEN
        ALTER TABLE users ADD COLUMN first_name TEXT;
    END IF;
    
    -- Add last_name column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'users' AND column_name = 'last_name') THEN
        ALTER TABLE users ADD COLUMN last_name TEXT;
    END IF;
    
    -- Add is_verified column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'users' AND column_name = 'is_verified') THEN
        ALTER TABLE users ADD COLUMN is_verified BOOLEAN NOT NULL DEFAULT false;
    END IF;
    
    -- Add verification_token column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'users' AND column_name = 'verification_token') THEN
        ALTER TABLE users ADD COLUMN verification_token TEXT;
    END IF;
    
    -- Add verification_token_expires column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'users' AND column_name = 'verification_token_expires') THEN
        ALTER TABLE users ADD COLUMN verification_token_expires TIMESTAMP;
    END IF;
    
    -- Add reset_password_token column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'users' AND column_name = 'reset_password_token') THEN
        ALTER TABLE users ADD COLUMN reset_password_token TEXT;
    END IF;
    
    -- Add reset_password_expires column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'users' AND column_name = 'reset_password_expires') THEN
        ALTER TABLE users ADD COLUMN reset_password_expires TIMESTAMP;
    END IF;
    
    -- Add role column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'users' AND column_name = 'role') THEN
        -- Add the column with the enum type
        ALTER TABLE users ADD COLUMN role user_role DEFAULT 'USER';
    END IF;
    
    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'users' AND column_name = 'updated_at') THEN
        ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
    END IF;
    
    -- First, update all existing users with default values for required fields
    -- For role, we'll set it to 'USER' if it's NULL
    UPDATE users SET 
        is_admin = COALESCE(is_admin, false),
        is_verified = COALESCE(is_verified, false),
        role = 'USER'::user_role,
        updated_at = COALESCE(updated_at, NOW()),
        first_name = COALESCE(first_name, ''),
        last_name = COALESCE(last_name, '');
    
    -- Now add NOT NULL constraints
    ALTER TABLE users ALTER COLUMN is_admin SET NOT NULL;
    ALTER TABLE users ALTER COLUMN is_verified SET NOT NULL;
    ALTER TABLE users ALTER COLUMN role SET NOT NULL;
    ALTER TABLE users ALTER COLUMN updated_at SET NOT NULL;
    ALTER TABLE users ALTER COLUMN first_name SET NOT NULL;
    ALTER TABLE users ALTER COLUMN last_name SET NOT NULL;
    
    RAISE NOTICE 'Successfully updated users table with all required columns';
END $$;
