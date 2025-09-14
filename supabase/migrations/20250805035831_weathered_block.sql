/*
  # Portfolio Website Database Schema

  1. New Tables
    - `site_settings`
      - `id` (text, primary key)
      - `hero_title` (text)
      - `hero_subtitle` (text)
      - `about_text` (text)
      - `years_experience` (integer)
      - `projects_completed` (integer)
      - `happy_clients` (integer)
      - `whatsapp_link` (text)
      - `github_url` (text, optional)
      - `linkedin_url` (text, optional)
      - `twitter_url` (text, optional)
      - `email` (text)
      - `updated_at` (timestamp)

    - `projects`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `image_url` (text)
      - `tech_stack` (text array)
      - `project_url` (text, optional)
      - `github_url` (text, optional)
      - `featured` (boolean)
      - `created_at` (timestamp)

    - `reviews`
      - `id` (uuid, primary key)
      - `client_name` (text)
      - `client_company` (text, optional)
      - `rating` (integer)
      - `review_text` (text)
      - `project_id` (uuid, optional, foreign key)
      - `approved` (boolean)
      - `created_at` (timestamp)

    - `skills`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text)
      - `proficiency` (integer)
      - `created_at` (timestamp)

    - `products`
      - `id` (uuid, primary key)
      - `title` (text)
      - `url` (text)
      - `description` (text, optional)
      - `created_at` (timestamp)

    - `contacts`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `budget` (text)
      - `message` (text)
      - `status` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access where appropriate
    - Add policies for authenticated admin access for modifications
*/

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id text PRIMARY KEY DEFAULT '1',
  hero_title text NOT NULL DEFAULT 'Nonce Firewall',
  hero_subtitle text NOT NULL DEFAULT 'Crafting exceptional digital experiences with modern web technologies.',
  about_text text NOT NULL DEFAULT 'Passionate full-stack developer with expertise in modern web technologies.',
  years_experience integer NOT NULL DEFAULT 5,
  projects_completed integer NOT NULL DEFAULT 50,
  happy_clients integer NOT NULL DEFAULT 25,
  whatsapp_link text NOT NULL DEFAULT 'https://wa.me/1234567890',
  github_url text,
  linkedin_url text,
  twitter_url text,
  email text NOT NULL DEFAULT 'hello@noncefirewall.dev',
  updated_at timestamptz DEFAULT now()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  tech_stack text[] NOT NULL DEFAULT '{}',
  project_url text,
  github_url text,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  client_company text,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text NOT NULL,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  approved boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  proficiency integer NOT NULL CHECK (proficiency >= 0 AND proficiency <= 100),
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  url text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  budget text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'completed')),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to site_settings"
  ON site_settings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to projects"
  ON projects
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to approved reviews"
  ON reviews
  FOR SELECT
  TO public
  USING (approved = true);

CREATE POLICY "Allow public read access to skills"
  ON skills
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to products"
  ON products
  FOR SELECT
  TO public
  USING (true);

-- Create policies for public insert on contacts
CREATE POLICY "Allow public insert to contacts"
  ON contacts
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policies for authenticated admin access
CREATE POLICY "Allow authenticated users full access to site_settings"
  ON site_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to reviews"
  ON reviews
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to skills"
  ON skills
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to products"
  ON products
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to contacts"
  ON contacts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default site settings
INSERT INTO site_settings (id) VALUES ('1') ON CONFLICT (id) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (title, description, image_url, tech_stack, featured, project_url, github_url) VALUES
('E-Commerce Platform', 'A full-stack e-commerce solution with React, Node.js, and Stripe integration. Features include user authentication, product catalog, shopping cart, and payment processing.', 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800', ARRAY['React', 'Node.js', 'MongoDB', 'Stripe', 'Express'], true, 'https://example.com', 'https://github.com'),
('Task Management App', 'A collaborative task management application built with Vue.js and Firebase. Includes real-time updates, team collaboration, and project tracking features.', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800', ARRAY['Vue.js', 'Firebase', 'Vuetify', 'JavaScript'], true, 'https://example.com', 'https://github.com'),
('Portfolio Website', 'A responsive portfolio website showcasing modern web design principles. Built with Next.js and styled with Tailwind CSS for optimal performance.', 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800', ARRAY['Next.js', 'Tailwind CSS', 'TypeScript', 'Vercel'], true, 'https://example.com', 'https://github.com'),
('Weather Dashboard', 'A real-time weather dashboard with location-based forecasts and interactive maps. Integrates with multiple weather APIs for accurate data.', 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=800', ARRAY['React', 'Chart.js', 'Weather API', 'CSS3'], false, 'https://example.com', 'https://github.com'),
('Blog Platform', 'A content management system for bloggers with markdown support, SEO optimization, and social media integration.', 'https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?auto=compress&cs=tinysrgb&w=800', ARRAY['Django', 'Python', 'PostgreSQL', 'Bootstrap'], false, 'https://example.com', 'https://github.com'),
('Chat Application', 'Real-time chat application with WebSocket support, file sharing, and group messaging capabilities.', 'https://images.pexels.com/photos/1591061/pexels-photo-1591061.jpeg?auto=compress&cs=tinysrgb&w=800', ARRAY['Socket.io', 'Node.js', 'React', 'MongoDB'], false, 'https://example.com', 'https://github.com');

-- Insert sample reviews
INSERT INTO reviews (client_name, client_company, rating, review_text, approved) VALUES
('Sarah Johnson', 'TechStart Inc.', 5, 'Nonce delivered an exceptional e-commerce platform that exceeded our expectations. The attention to detail and technical expertise was outstanding. Our sales increased by 40% within the first month!', true),
('Michael Chen', 'Digital Solutions', 5, 'Working with Nonce was a pleasure. The project was delivered on time, within budget, and the code quality was excellent. Highly recommend for any web development needs.', true),
('Emily Rodriguez', 'Creative Agency', 4, 'Great communication throughout the project and delivered a beautiful, responsive website. The performance optimizations made a significant difference to our user experience.', true),
('David Thompson', 'StartupXYZ', 5, 'Nonce transformed our outdated website into a modern, fast, and user-friendly platform. The technical knowledge and problem-solving skills are top-notch.', true),
('Lisa Wang', 'E-Commerce Co.', 5, 'The custom features and integrations were implemented flawlessly. Nonce understood our business needs and delivered a solution that perfectly fits our workflow.', true);

-- Insert sample skills
INSERT INTO skills (name, category, proficiency) VALUES
('React', 'Frontend', 95),
('Vue.js', 'Frontend', 90),
('Angular', 'Frontend', 85),
('JavaScript', 'Frontend', 95),
('TypeScript', 'Frontend', 90),
('HTML5', 'Frontend', 95),
('CSS3', 'Frontend', 95),
('Tailwind CSS', 'Frontend', 90),
('Node.js', 'Backend', 90),
('Express', 'Backend', 90),
('Python', 'Backend', 85),
('Django', 'Backend', 80),
('PHP', 'Backend', 75),
('MongoDB', 'Database', 85),
('PostgreSQL', 'Database', 85),
('MySQL', 'Database', 80),
('Redis', 'Database', 75),
('Git', 'Tools', 95),
('Docker', 'Tools', 80),
('AWS', 'Tools', 75),
('Figma', 'Tools', 85);

-- Insert sample products
INSERT INTO products (title, url, description) VALUES
('React Component Library', 'https://github.com/noncefirewall/react-components', 'A collection of reusable React components with TypeScript support and comprehensive documentation.'),
('API Boilerplate', 'https://github.com/noncefirewall/api-boilerplate', 'A Node.js API boilerplate with authentication, validation, and database integration ready to use.'),
('CSS Framework', 'https://github.com/noncefirewall/css-framework', 'A lightweight CSS framework focused on modern web design and responsive layouts.');