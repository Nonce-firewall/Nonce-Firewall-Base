import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowDown, Github, Linkedin, Twitter } from 'lucide-react'
import { useTypingAnimation } from '../hooks/useTypingAnimation'

// Lazy load non-critical components
const AnimatedStats = React.lazy(() => import('./AnimatedStats'))

import { db, subscribeToTable, unsubscribeFromTable } from '../lib/supabase'
import type { SiteSettings } from '../types'

interface HeroProps {
}

const Hero: React.FC<HeroProps> = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const roles = ['Front-end Developer', 'Full-Stack Developer', 'Prototype Designer']
  const currentRole = useTypingAnimation(roles, 70, 50, 1500)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await db.getSiteSettings()
      if (data) setSettings(data)
    }
    fetchSettings()
    
    // Subscribe to real-time changes
    subscribeToTable('site_settings', () => {
      fetchSettings()
    })
    
    return () => {
      unsubscribeFromTable('site_settings')
    }
  }, [])

  const scrollToNext = () => {
    const nextSection = document.getElementById('about-section')
    nextSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="min-h-[calc(100vh-64px)] pt-16 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      </div>

      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="space-y-8 animate-slide-up">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900">
              <span className="text-gray-600 font-medium text-2xl sm:text-4xl lg:text-5xl block mb-2">Hello, I'm</span>
              <span className="gradient-text">{settings?.hero_title || 'Nonce Firewall'}</span>
            </h1>
            <h2 className="text-xl sm:text-2xl lg:text-3xl text-gray-600 h-12 flex items-center justify-center">
              <span className="typing-cursor">{currentRole}</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {settings?.hero_subtitle || 'Crafting exceptional digital experiences with modern web technologies. Specialized in React, Node.js, and full-stack development.'}
            </p>
          </div>

          <div className="flex flex-row sm:flex-row gap-4 justify-center items-center">
  <button
    onClick={() => navigate('/projects')}
    className="py-2 px-4 bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-300 rounded-md transform hover:scale-105 active:scale-95 hover:shadow-lg"
  >
    View My Work
  </button>
  <button
    onClick={() => navigate('/contact')}
    className="py-2 px-4 border border-solid border-blue-700 text-blue-900 hover:bg-blue-500 hover:text-white transition-all duration-300 rounded-md transform hover:scale-105 active:scale-95 hover:shadow-lg"
  >
    Get In Touch
  </button>
</div>

          {/* Social Links */}
          <div className="flex justify-center space-x-6 animate-slide-up" style={{ animationDelay: '0.8s' }}>
            {settings?.github_url && (
              <a
                href={settings.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
                title="GitHub"
              >
                <Github size={24} />
              </a>
            )}
            {settings?.linkedin_url && (
              <a
                href={settings.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
                title="LinkedIn"
              >
                <Linkedin size={24} />
              </a>
            )}
            {settings?.twitter_url && (
              <a
                href={settings.twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
                title="Twitter"
              >
                <Twitter size={24} />
              </a>
            )}
            {settings?.discord_url && (
              <a
                href={settings.discord_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
                title="Discord"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
            )}
            {settings?.tiktok_url && (
              <a
                href={settings.tiktok_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
                title="TikTok"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            )}
            {settings?.youtube_url && (
              <a
                href={settings.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
                title="YouTube"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            )}
          </div>

          {/* Stats */}
          {settings && (
            <React.Suspense fallback={
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-slide-up">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="text-center">
                    <div className="h-12 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            }>
              <AnimatedStats
                yearsExperience={settings.years_experience}
                projectsCompleted={settings.projects_completed}
                happyClients={settings.happy_clients}
                commitsCount={settings.commits_count}
              />
            </React.Suspense>
          )}
        </div>

        {/* Scroll indicator */}
        <button
          onClick={scrollToNext}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-600 hover:text-gray-900 transition-colors duration-300 animate-bounce opacity-0 animate-fade-in"
          style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}
        >
          <ArrowDown size={24} />
        </button>
      </header>
    </section>
  )
}

export default Hero
