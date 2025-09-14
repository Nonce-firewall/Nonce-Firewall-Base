/*
  # Add Blog and Newsletter Features

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `slug` (text, unique, not null)
      - `excerpt` (text)
      - `content` (text, not null)
      - `featured_image_url` (text)
      - `published` (boolean, default false)
      - `published_at` (timestamptz)
      - `meta_title` (text)
      - `meta_description` (text)
      - `tags` (text array)
      - `reading_time` (integer)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

    - `newsletter_subscribers`
      - `id` (uuid, primary key)
      - `email` (text, unique, not null)
      - `subscribed_at` (timestamptz, default now())
      - `active` (boolean, default true)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access to published blog posts
    - Add policies for public insert to newsletter subscriptions
    - Add policies for authenticated users to manage content

  3. Functions
    - Add trigger to update `updated_at` timestamp
    - Add function to generate reading time
*/

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text NOT NULL,
  featured_image_url text,
  published boolean DEFAULT false,
  published_at timestamptz,
  meta_title text,
  meta_description text,
  tags text[] DEFAULT '{}',
  reading_time integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscribed_at timestamptz DEFAULT now(),
  active boolean DEFAULT true
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Blog posts policies
CREATE POLICY "Allow public read access to published blog posts"
  ON blog_posts
  FOR SELECT
  TO public
  USING (published = true);

CREATE POLICY "Allow authenticated users full access to blog posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Newsletter subscribers policies
CREATE POLICY "Allow public insert to newsletter subscribers"
  ON newsletter_subscribers
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to newsletter subscribers"
  ON newsletter_subscribers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add updated_at trigger for blog_posts
CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Function to estimate reading time (assuming 200 words per minute)
CREATE OR REPLACE FUNCTION calculate_reading_time(content_text text)
RETURNS integer AS $$
BEGIN
  RETURN GREATEST(1, ROUND(array_length(string_to_array(content_text, ' '), 1) / 200.0));
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically calculate reading time
CREATE OR REPLACE FUNCTION update_reading_time()
RETURNS trigger AS $$
BEGIN
  NEW.reading_time = calculate_reading_time(NEW.content);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_posts_reading_time
  BEFORE INSERT OR UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_reading_time();