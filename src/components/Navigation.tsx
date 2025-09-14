import React, { useState, useEffect, memo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Home, User, Briefcase, MessageSquare, Star, Package, BookOpen } from 'lucide-react'
import OptimizedImage from './OptimizedImage'

interface NavigationProps {
}

const Navigation: React.FC<NavigationProps> = memo(() => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/projects', label: 'Projects', icon: Briefcase },
    { path: '/about', label: 'About', icon: User },
    { path: '/blog', label: 'Blog', icon: BookOpen },
    { path: '/reviews', label: 'Reviews', icon: Star },
    { path: '/contact', label: 'Contact', icon: MessageSquare },
    { path: '/products', label: 'Products', icon: Package }
  ]

  const handleNavigation = (path: string) => {
    navigate(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setIsOpen(false)
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-lg' : 'bg-white shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-3">
              <OptimizedImage
                src="/logo.png"
                alt="Nonce Firewall - Full-Stack Developer Logo"
                className="h-10 w-10 object-contain"
                width={40}
                height={40}
                priority={true}
                loading="eager"
              />
              <h1 className="text-2xl font-bold gradient-text">Nonce Firewall</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 active:scale-95 ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-300"
              aria-label={isOpen ? 'Close mobile menu' : 'Open mobile menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-y-0' : '-translate-y-4'
        }`}>
          {navItems.map((item, index) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => {
                  handleNavigation(item.path)
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-base font-medium transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 active:scale-95 ${
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                } ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}
                style={{
                  transitionDelay: isOpen ? `${index * 50}ms` : '0ms'
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
})

Navigation.displayName = 'Navigation'

export default Navigation