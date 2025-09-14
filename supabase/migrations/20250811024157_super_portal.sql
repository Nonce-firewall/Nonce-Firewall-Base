/*
  # Fix newsletter subscribers RLS policy

  1. Security Changes
    - Drop existing INSERT policy for newsletter_subscribers
    - Create new INSERT policy that properly allows anonymous users to subscribe
    - Ensure the policy allows both anonymous and authenticated users to insert

  This fixes the "new row violates row-level security policy" error when
  anonymous users try to subscribe to the newsletter.
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON newsletter_subscribers;

-- Create a new INSERT policy that allows both anonymous and authenticated users
CREATE POLICY "Allow newsletter subscription for all users"
  ON newsletter_subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);