/*
  # Add username column to profiles table

  1. Changes
    - Add `username` column to `profiles` table
    - Column is nullable to allow gradual migration
    - Add unique constraint to prevent duplicate usernames

  2. Security
    - No changes to existing RLS policies needed
    - Username will be accessible through existing profile policies
*/

-- Add username column to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'username'
  ) THEN
    ALTER TABLE profiles ADD COLUMN username text;
  END IF;
END $$;

-- Add unique constraint for username (allowing nulls)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'profiles_username_key'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_username_key UNIQUE (username);
  END IF;
END $$;

-- Add index for better performance on username lookups
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE indexname = 'idx_profiles_username'
  ) THEN
    CREATE INDEX idx_profiles_username ON profiles(username) WHERE username IS NOT NULL;
  END IF;
END $$;