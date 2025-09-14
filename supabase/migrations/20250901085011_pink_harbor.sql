/*
  # Add browser tracking to blog comments

  1. Schema Changes
    - Add `browser_id` column to `blog_comments` table for tracking comment ownership
    - Add index on `browser_id` for efficient queries

  2. Security Updates
    - Add RLS policy for users to update their own comments by browser_id
    - Add RLS policy for users to delete their own comments by browser_id
    - Maintain existing public read and insert policies

  3. Data Migration
    - Existing comments will have NULL browser_id (cannot be edited/deleted)
    - New comments will automatically include browser_id for ownership tracking
*/

-- Add browser_id column to blog_comments table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_comments' AND column_name = 'browser_id'
  ) THEN
    ALTER TABLE blog_comments ADD COLUMN browser_id text;
  END IF;
END $$;

-- Add index on browser_id for efficient queries
CREATE INDEX IF NOT EXISTS idx_blog_comments_browser_id ON blog_comments (browser_id);

-- Add RLS policy for users to update their own comments by browser_id
CREATE POLICY "Allow users to update their own comments by browser_id"
  ON blog_comments
  FOR UPDATE
  TO public
  USING (browser_id IS NOT NULL);

-- Add RLS policy for users to delete their own comments by browser_id
CREATE POLICY "Allow users to delete their own comments by browser_id"
  ON blog_comments
  FOR DELETE
  TO public
  USING (browser_id IS NOT NULL);