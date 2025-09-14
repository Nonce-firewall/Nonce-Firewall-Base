/*
  # Create team members table

  1. New Tables
    - `team_members`
      - `id` (uuid, primary key)
      - `name` (text, required) - Team member's full name
      - `role` (text, required) - Their job title/role
      - `bio` (text, optional) - Short biography
      - `profile_picture_url` (text, required) - URL to their profile image
      - `twitter_url` (text, optional) - Twitter profile URL
      - `linkedin_url` (text, optional) - LinkedIn profile URL
      - `github_url` (text, optional) - GitHub profile URL
      - `display_order` (integer, default 0) - Order for displaying team members
      - `active` (boolean, default true) - Whether to show this team member
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `team_members` table
    - Add policy for public read access to active team members
    - Add policy for authenticated users to manage team members
*/

CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  bio text,
  profile_picture_url text NOT NULL,
  twitter_url text,
  linkedin_url text,
  github_url text,
  display_order integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active team members
CREATE POLICY "Allow public read access to active team members"
  ON team_members
  FOR SELECT
  TO public
  USING (active = true);

-- Allow authenticated users full access to team members
CREATE POLICY "Allow authenticated users full access to team members"
  ON team_members
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_team_members_display_order 
  ON team_members (display_order, created_at);

-- Create index for active status
CREATE INDEX IF NOT EXISTS idx_team_members_active 
  ON team_members (active);