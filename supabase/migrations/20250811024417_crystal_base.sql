/*
  # Reset and fix newsletter subscribers RLS policies

  1. Security Changes
    - Drop all existing conflicting RLS policies on newsletter_subscribers table
    - Create a simple, clear policy that allows anonymous users to insert subscriptions
    - Maintain admin access for authenticated users
    - Allow public read access for admin dashboard

  2. Policy Structure
    - Anonymous users: Can insert new subscriptions
    - Authenticated users: Full access (admin functionality)
    - Public read access: For admin dashboard to display subscriber counts
*/

-- Drop all existing policies on newsletter_subscribers table
DROP POLICY IF EXISTS "Allow anonymous newsletter subscription" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Allow authenticated newsletter subscription" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Allow authenticated users to read subscribers" ON newsletter_subscribers;

-- Create a simple policy for anonymous users to insert newsletter subscriptions
CREATE POLICY "Enable insert for anonymous users" ON newsletter_subscribers
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create a policy for authenticated users to have full access (admin functionality)
CREATE POLICY "Enable all operations for authenticated users" ON newsletter_subscribers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create a policy for public read access (for displaying subscriber counts)
CREATE POLICY "Enable read access for all users" ON newsletter_subscribers
  FOR SELECT
  TO anon, authenticated
  USING (true);