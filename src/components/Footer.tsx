import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { Github, Linkedin, Mail, MessageCircle, Twitter } from 'lucide-react'
import NewsletterSignup from './NewsletterSignup'
import OptimizedImage from './OptimizedImage'
import { db, subscribeToTable, unsubscribeFromTable } from '../lib/supabase'
import type { SiteSettings, Product } from '../types'

interface FooterProps {
}

const Footer: React.FC<FooterProps> = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const [settingsResult, productsResult] = await Promise.all([
        db.getSiteSettings(),
        db.getProducts()
      ])
      
      if (settingsResult.data) setSettings(settingsResult.data)
      if (productsResult.data) setProducts(productsResult.data)
    }
    fetchData()
    
    // Subscribe to real-time changes
    subscribeToTable('site_settings', () => {
      fetchData()
    })
    
    subscribeToTable('products', () => {
      fetchData()
    })
    
    return () => {
      unsubscribeFromTable('site_settings')
      unsubscribeFromTable('products')
    }
  }, [])

  const currentYear = new Date().getFullYear()
  
  const handleNavigation = (path: string) => {
    navigate(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <OptimizedImage
                src="/logo.png" 
                alt="Nonce Firewall - Full-Stack Developer Logo" 
                className="h-8 w-8 object-contain"
                width={32}
                height={32}
                loading="lazy"
              />
              <h3 className="text-2xl font-bold gradient-text">Nonce Firewall</h3>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Full-stack developer specializing in modern web technologies. 
              Creating exceptional digital experiences with clean code and innovative solutions.
            </p>
            <div className="flex space-x-4">
              {settings?.github_url && (
                <a
                  href={settings.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                  title="GitHub"
                  aria-label="Visit Nonce Firewall on GitHub"
                >
                  <Github size={24} />
                </a>
              )}
              {settings?.linkedin_url && (
                <a
                  href={settings.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                  title="LinkedIn"
                  aria-label="Visit Nonce Firewall on LinkedIn"
                >
                  <Linkedin size={24} />
                </a>
              )}
              {settings?.twitter_url && (
                <a
                  href={settings.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                  title="Twitter"
                  aria-label="Visit Nonce Firewall on Twitter"
                >
                  <Twitter size={24} />
                </a>
              )}
              {settings?.discord_url && (
                <a
                  href={settings.discord_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                  title="Discord"
                  aria-label="Join Nonce Firewall on Discord"
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
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                  title="TikTok"
                  aria-label="Follow Nonce Firewall on TikTok"
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
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                  title="YouTube"
                  aria-label="Subscribe to Nonce Firewall on YouTube"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              )}
              {settings?.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                  title="Email"
                  aria-label="Send email to Nonce Firewall"
                >
                  <Mail size={24} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { path: '/', label: 'home' },
                { path: '/projects', label: 'projects' },
                { path: '/about', label: 'about' },
                { path: '/reviews', label: 'reviews' },
                { path: '/blog', label: 'blog' },
                { path: '/contact', label: 'contact' }
              ].map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className="text-gray-400 hover:text-white transition-all duration-300 capitalize transform hover:scale-105 active:scale-95"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Products</h4>
            <ul className="space-y-2">
              {products.slice(0, 3).map((product) => (
                <li key={product.id}>
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {product.title}
                  </a>
                </li>
              ))}
              {products.length > 3 && (
                <li>
                  <button
                    onClick={() => handleNavigation('/products')}
                    className="text-blue-400 hover:text-blue-300 transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    View All Products
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <NewsletterSignup variant="footer" />
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {currentYear} Nonce Firewall. All rights reserved.
          </p>
        </div>
      </div>

      {/* WhatsApp Float Button */}
      {settings?.whatsapp_link && !location.pathname.startsWith('/blog') && (
        <a
          href={settings.whatsapp_link}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 z-40 hover:from-blue-700 hover:to-purple-700 animate-bounce"
          title="WhatsApp"
        >
          <MessageCircle size={13} />
        </a>
      )}
    </footer>
  )
}

export default Footer