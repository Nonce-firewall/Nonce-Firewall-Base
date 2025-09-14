/*
  # Add image_url column to products table

  1. Schema Changes
    - Add `image_url` column to `products` table (text, required)
    - This will store the URL of the product cover image

  2. Notes
    - All existing products will need to have an image_url added
    - New products must include an image_url
*/

-- Add image_url column to products table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE products ADD COLUMN image_url text NOT NULL DEFAULT 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg';
  END IF;
END $$;

-- Remove the default after adding the column
ALTER TABLE products ALTER COLUMN image_url DROP DEFAULT;