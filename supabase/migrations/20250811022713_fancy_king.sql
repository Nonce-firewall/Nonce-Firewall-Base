/*
  # Fix Newsletter Subscription RLS Policy

  1. Security Updates
    - Drop existing problematic RLS policy for newsletter_subscribers
    - Create new RLS policy that properly allows public inserts
    - Ensure anon role has proper INSERT permissions
    - Add policy to allow public users to subscribe to newsletter

  2. Changes
    - Remove restrictive RLS policy
    - Add permissive INSERT policy for anonymous users
    - Maintain data security while allowing subscriptions
*/

-- Drop existing policies that might be causing issues
DROP POLICY IF EXISTS "Allow public insert to newsletter subscribers" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Allow authenticated users full access to newsletter subscribers" ON newsletter_subscribers;

-- Create a new policy that allows anyone to insert newsletter subscriptions
CREATE POLICY "Enable insert for anonymous users" ON newsletter_subscribers
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Create a policy for authenticated users to manage newsletter subscribers (admin access)
CREATE POLICY "Enable full access for authenticated users" ON newsletter_subscribers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Ensure RLS is enabled on the table
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions to anon role for inserting
GRANT INSERT ON newsletter_subscribers TO anon;
GRANT SELECT ON newsletter_subscribers TO authenticated;
GRANT UPDATE ON newsletter_subscribers TO authenticated;
GRANT DELETE ON newsletter_subscribers TO authenticated;