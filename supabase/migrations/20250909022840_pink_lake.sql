/*
  # Add commits count to site settings

  1. Schema Changes
    - Add `commits_count` column to `site_settings` table
    - Set default value to 500 for existing records
  
  2. Security
    - No RLS changes needed (inherits existing policies)
*/

-- Add commits_count column to site_settings table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'commits_count'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN commits_count integer DEFAULT 500;
  END IF;
END $$;