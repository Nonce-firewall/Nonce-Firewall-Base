import React, { useState } from 'react'
import { Mail, CheckCircle, AlertCircle } from 'lucide-react'
import { db } from '../lib/supabase'

interface NewsletterSignupProps {
  className?: string
  variant?: 'default' | 'footer' | 'inline'
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ 
  className = '', 
  variant = 'default' 
}) => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    
    try {
      const { error } = await db.subscribeToNewsletter(email)
      
      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          setStatus('error')
          setMessage('You are already subscribed to our newsletter!')
        } else {
          throw error
        }
      } else {
        setStatus('success')
        setMessage('Thank you for subscribing! You\'ll receive updates about new blog posts and projects.')
        setEmail('')
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      setStatus('error')
      setMessage('Something went wrong. Please try again later.')
    }

    // Reset status after 5 seconds
    setTimeout(() => {
      setStatus('idle')
      setMessage('')
    }, 5000)
  }

  if (variant === 'footer') {
    return (
      <div className={`${className}`}>
        <h4 className="text-lg font-semibold mb-4 text-white">Stay Updated</h4>
        <p className="text-gray-400 mb-4 text-sm">
          Get notified about new blog posts and projects.
        </p>
        
        {status === 'success' ? (
          <div className="flex items-center space-x-2 text-green-400">
            <CheckCircle size={16} />
            <span className="text-sm">Subscribed successfully!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={status === 'loading'}
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === 'loading' || !email}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Mail size={16} />
                )}
              </button>
            </div>
            
            {status === 'error' && (
              <div className="flex items-center space-x-2 text-red-400">
                <AlertCircle size={14} />
                <span className="text-xs">{message}</span>
              </div>
            )}
          </form>
        )}
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg p-4 sm:p-6 ${className}`}>
      <div className="text-center mb-4 sm:mb-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Stay in the Loop</h3>
        <p className="text-gray-600 text-sm sm:text-base">
          Subscribe to get notified about new posts, projects, and updates.
        </p>
      </div>

      {status === 'success' ? (
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
          </div>
          <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Thank You!</h4>
          <p className="text-gray-600 text-xs sm:text-sm">{message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              disabled={status === 'loading'}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 disabled:opacity-50 text-sm sm:text-base"
            />
          </div>
          
          {status === 'error' && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-2 sm:p-3 rounded-lg">
              <AlertCircle size={14} className="sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm">{message}</span>
            </div>
          )}
          
          <button
            type="submit"
            disabled={status === 'loading' || !email}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base"
          >
            {status === 'loading' ? (
              <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
            ) : (
              <>
                Subscribe
                <Mail size={16} className="ml-2 sm:w-5 sm:h-5" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  )
}

export default NewsletterSignup
