/*
  # Fix newsletter subscribers RLS policies

  1. Security Changes
    - Drop existing conflicting policies
    - Create a simple policy that allows anonymous users to subscribe
    - Keep authenticated users' full access policy
    - Ensure proper separation between insert and select permissions

  This migration resolves the "new row violates row-level security policy" error
  by creating clear, non-conflicting RLS policies for the newsletter_subscribers table.
*/

-- Drop existing policies that might be conflicting
DROP POLICY IF EXISTS "Allow newsletter subscription for all users" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON newsletter_subscribers;

-- Create a clear policy for anonymous users to subscribe
CREATE POLICY "Allow anonymous newsletter subscription"
  ON newsletter_subscribers
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create a policy for authenticated users to subscribe
CREATE POLICY "Allow authenticated newsletter subscription"
  ON newsletter_subscribers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users full access for admin purposes
CREATE POLICY "Allow authenticated users full access"
  ON newsletter_subscribers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow public read access for admin dashboard
CREATE POLICY "Allow authenticated users to read subscribers"
  ON newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING (true);