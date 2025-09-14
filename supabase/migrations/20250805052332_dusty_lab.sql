/*
  # Add social media fields to site settings

  1. Changes
    - Add Discord URL field to site_settings table
    - Add TikTok URL field to site_settings table  
    - Add YouTube URL field to site_settings table
    - All fields are optional (nullable)

  2. Security
    - No RLS changes needed as existing policies cover new fields
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'discord_url'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN discord_url text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'tiktok_url'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN tiktok_url text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'youtube_url'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN youtube_url text;
  END IF;
END $$;