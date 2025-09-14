export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  tech_stack: string[];
  project_url?: string;
  github_url?: string;
  featured: boolean;
  created_at: string;
  challenge?: string;
  solution?: string;
  results?: string;
}

export interface BlogPost {
  id: string;
  created_at: string;
  updated_at: string | null;
  published_at: string | null;
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  featured_image_url: string | null;
  category: string | null;
  tags: string[];
  reading_time: number;
  published: boolean;
  meta_title: string | null;
  meta_description: string | null;
}

export interface Review {
  id: string;
  client_name: string;
  client_company?: string;
  rating: number;
  review_text: string;
  project_id?: string;
  approved: boolean;
  created_at: string;
  avatar_url?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  hero_title: string;
  hero_subtitle: string;
  about_text: string;
  years_experience: number;
  projects_completed: number;
  happy_clients: number;
  whatsapp_link: string;
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  discord_url?: string;
  tiktok_url?: string;
  youtube_url?: string;
  email: string;
  commits_count: number;
  updated_at: string;
}

export interface Product {
  id: string;
  title: string;
  url: string;
  image_url: string;
  description?: string;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  username?: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  profile_picture_url: string;
  twitter_url?: string;
  linkedin_url?: string;
  github_url?: string;
  display_order?: number;
  active?: boolean;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
  active: boolean;
}

export interface BlogComment {
  id: string;
  post_id: string;
  parent_id?: string;
  username: string;
  content: string;
  created_at: string;
  browser_id?: string;
  replies?: BlogComment[];
}

export interface CommentUsername {
  id: string;
  username: string;
  browser_id: string;
  created_at: string;
}