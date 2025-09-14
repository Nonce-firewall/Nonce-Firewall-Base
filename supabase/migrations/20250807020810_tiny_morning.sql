/*
  # Fix Authentication and Permissions

  1. Database Changes
    - Update RLS policies to allow public review submissions
    - Ensure contact form submissions work for unauthenticated users
    - Allow public read access to all necessary tables

  2. Security Updates
    - Reviews submitted by public users are set to unapproved by default
    - Maintain admin-only access for management functions
*/

-- Update reviews table policies
DROP POLICY IF EXISTS "Allow public insert to reviews" ON reviews;
DROP POLICY IF EXISTS "Allow authenticated users full access to reviews" ON reviews;
DROP POLICY IF EXISTS "Allow public read access to approved reviews" ON reviews;

-- Allow public users to submit reviews (they will be unapproved by default)
CREATE POLICY "Allow public insert to reviews"
  ON reviews
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow public to read approved reviews
CREATE POLICY "Allow public read access to approved reviews"
  ON reviews
  FOR SELECT
  TO public
  USING (approved = true);

-- Allow authenticated users full access to reviews
CREATE POLICY "Allow authenticated users full access to reviews"
  ON reviews
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Ensure contacts table allows public submissions
DROP POLICY IF EXISTS "Allow public insert to contacts" ON contacts;
DROP POLICY IF EXISTS "Allow authenticated users full access to contacts" ON contacts;

-- Allow public users to submit contact forms
CREATE POLICY "Allow public insert to contacts"
  ON contacts
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow authenticated users full access to contacts
CREATE POLICY "Allow authenticated users full access to contacts"
  ON contacts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Ensure all other tables have proper public read access
-- Projects
DROP POLICY IF EXISTS "Allow public read access to projects" ON projects;
CREATE POLICY "Allow public read access to projects"
  ON projects
  FOR SELECT
  TO public
  USING (true);

-- Skills
DROP POLICY IF EXISTS "Allow public read access to skills" ON skills;
CREATE POLICY "Allow public read access to skills"
  ON skills
  FOR SELECT
  TO public
  USING (true);

-- Products
DROP POLICY IF EXISTS "Allow public read access to products" ON products;
CREATE POLICY "Allow public read access to products"
  ON products
  FOR SELECT
  TO public
  USING (true);

-- Site Settings
DROP POLICY IF EXISTS "Allow public read access to site_settings" ON site_settings;
CREATE POLICY "Allow public read access to site_settings"
  ON site_settings
  FOR SELECT
  TO public
  USING (true);