# Nonce Firewall Portfolio

A modern, responsive portfolio website built with React, TypeScript, and Tailwind CSS. Features a complete admin dashboard for content management and integrates with Supabase for data storage.

## Features

- 🎨 Modern, responsive design
- 📱 Mobile-first approach
- 🔧 Admin dashboard for content management
- 💾 Supabase integration for data storage
- 🚀 Fast performance with Vite
- 📧 Contact form with email notifications
- ⭐ Client reviews system
- 🛠️ Skills showcase
- 📦 Products/tools section

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **Database**: Supabase
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd portfolio-website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Add your Supabase credentials to `.env`:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── admin/              # Admin dashboard components
├── components/         # Reusable UI components
├── hooks/             # Custom React hooks
├── lib/               # Utility libraries (Supabase client)
├── pages/             # Page components
├── types/             # TypeScript type definitions
├── App.tsx            # Main app component
├── main.tsx           # App entry point
└── index.css          # Global styles
```

## Admin Dashboard

Access the admin dashboard at `/admin` to manage:

- Site settings (hero text, social links, stats)
- Projects (add, edit, delete projects)
- Reviews (manage client testimonials)
- Skills (technical skills with proficiency levels)
- Products (tools and resources)
- Contacts (view and manage inquiries)
- Blogs (Create and manage blogs contents)

## Database Schema

The project uses Supabase with the following tables:

- `site_settings` - Site configuration and content
- `projects` - Portfolio projects
- `reviews` - Client testimonials
- `skills` - Technical skills
- `products` - Tools and products
- `contacts` - Contact form submissions
- `team_members` - Team member profiles and information
- `profiles` - User authentication profiles and roles
- `blogs` - Insights, tutorials, and thoughts

## Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting provider

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
