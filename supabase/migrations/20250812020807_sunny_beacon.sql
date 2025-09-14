/*
  # Add category column to blog_posts table

  1. Changes
    - Add `category` column to `blog_posts` table
    - Set default value to 'Tech'
    - Add check constraint for valid categories

  2. Security
    - No changes to RLS policies needed
*/

-- Add category column to blog_posts table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'blog_posts' AND column_name = 'category'
  ) THEN
    ALTER TABLE blog_posts ADD COLUMN category text DEFAULT 'Tech' NOT NULL;
  END IF;
END $$;

-- Add check constraint for valid categories
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'blog_posts_category_check'
  ) THEN
    ALTER TABLE blog_posts ADD CONSTRAINT blog_posts_category_check 
    CHECK (category IN ('Tech', 'Religion', 'News', 'Blockchain', 'Politics', 'Lifestyle', 'Tutorial', 'Opinion', 'Review'));
  END IF;
END $$;
