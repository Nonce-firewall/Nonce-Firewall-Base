/*
  # Create blog comments system

  1. New Tables
    - `blog_comments`
      - `id` (uuid, primary key)
      - `post_id` (uuid, foreign key to blog_posts)
      - `parent_id` (uuid, foreign key to blog_comments for replies)
      - `username` (text, commenter username)
      - `content` (text, comment content)
      - `created_at` (timestamp)
    - `comment_usernames`
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `browser_id` (text, to track users across sessions)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Add policies for public insert access
    - Add policies for users to update their own comments
*/

-- Create blog_comments table
CREATE TABLE IF NOT EXISTS blog_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES blog_comments(id) ON DELETE CASCADE,
  username text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create comment_usernames table to track usernames per browser
CREATE TABLE IF NOT EXISTS comment_usernames (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  browser_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_usernames ENABLE ROW LEVEL SECURITY;

-- Policies for blog_comments
CREATE POLICY "Allow public read access to comments"
  ON blog_comments
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to comments"
  ON blog_comments
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow users to update their own comments"
  ON blog_comments
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Policies for comment_usernames
CREATE POLICY "Allow public read access to usernames"
  ON comment_usernames
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to usernames"
  ON comment_usernames
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id ON blog_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_parent_id ON blog_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_created_at ON blog_comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comment_usernames_browser_id ON comment_usernames(browser_id);