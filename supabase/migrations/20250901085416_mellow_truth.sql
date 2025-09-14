/*
  # Update existing comments with browser ID

  1. Changes
    - Add browser_id to existing comments that don't have one
    - Use a placeholder browser_id for old comments to enable edit/delete functionality
    - This allows users to manage old comments through the admin panel

  2. Security
    - Maintains existing RLS policies
    - Only affects comments without browser_id
*/

-- Update existing comments that don't have a browser_id
UPDATE blog_comments 
SET browser_id = 'legacy_comment_' || id::text
WHERE browser_id IS NULL;