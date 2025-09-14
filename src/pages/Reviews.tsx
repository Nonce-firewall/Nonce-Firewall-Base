import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, MessageSquare, TrendingUp, Award, Send, CheckCircle, User, Building } from 'lucide-react'
import ReviewCard from '../components/ReviewCard'
import ScrollToTopAndBottomButtons from '../components/ScrollToTopAndBottomButtons'
import SEOHead from '../components/SEOHead'
import { db } from '../lib/supabase'
import type { Review, Project } from '../types'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

const Reviews: React.FC = () => {
  const [allReviews, setAllReviews] = useState<Review[]>([])
  const [displayedReviews, setDisplayedReviews] = useState<Review[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([])
  const [filter, setFilter] = useState<'all' | '5-star' | '4-star'>('all')
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMoreToLoad, setHasMoreToLoad] = useState(false)
  const [reviewsLimit, setReviewsLimit] = useState(5)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showSubmissionForm, setShowSubmissionForm] = useState(false)
  const [submissionSuccess, setSubmissionSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [formData, setFormData] = useState({
    client_name: '',
    client_company: '',
    rating: 5,
    review_text: '',
    project_id: '',
    avatar_url: ''
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [isFormTransitioning, setIsFormTransitioning] = useState(false)
  const [selectedProjectTitle, setSelectedProjectTitle] = useState('')
  const navigate = useNavigate()

  // Set page title for SEO
  useEffect(() => {
    document.title = 'Client Reviews & Testimonials | 5-Star Rated Developer | Nonce Firewall'
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Read authentic client reviews and testimonials for my web development services. 5-star rated developer with 25+ happy clients. See what clients say about working with me on React, Next.js, Node.js, and full-stack projects.')
    }
    
    // Add structured data for reviews page
    const existingScript = document.querySelector('script[data-seo="reviews"]')
    if (!existingScript) {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-seo', 'reviews')
      script.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Client Reviews & Testimonials",
        "description": "Authentic client reviews and testimonials for Nonce Firewall's web development services",
        "url": "https://noncefirewall.dev/reviews",
        "author": {
          "@type": "Person",
          "name": "Nonce Firewall"
        },
        "mainEntity": {
          "@type": "ItemList",
          "name": "Client Reviews",
          "description": "Collection of client testimonials and reviews"
        }
      })
      document.head.appendChild(script)
    }
  }, [])

  // Set responsive reviews limit
  useEffect(() => {
    const updateReviewsLimit = () => {
      setReviewsLimit(window.innerWidth < 768 ? 3 : 5)
    }
    
    updateReviewsLimit()
    window.addEventListener('resize', updateReviewsLimit)
    
    return () => window.removeEventListener('resize', updateReviewsLimit)
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const [reviewsResult, projectsResult] = await Promise.all([
      db.getReviews(true), // Only approved reviews
      db.getProjects()
    ])
    
    if (reviewsResult.data) {
      setAllReviews(reviewsResult.data)
    }
    if (projectsResult.data) setProjects(projectsResult.data)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
    
    // Subscribe to real-time changes
    const setupSubscriptions = async () => {
      const { subscribeToTable } = await import('../lib/supabase')
      
      subscribeToTable('reviews', () => {
        fetchData()
      })
    }
    
    setupSubscriptions()
    
    return () => {
      const cleanup = async () => {
        const { unsubscribeFromTable } = await import('../lib/supabase')
        unsubscribeFromTable('reviews')
      }
      cleanup()
    }
  }, [])

  // Filter reviews and set initial display
  useEffect(() => {
    setIsTransitioning(true)
    
    // Add a small delay to show the transition effect
    setTimeout(() => {
    let filtered = allReviews
    
    if (filter === '5-star') {
      filtered = allReviews.filter(review => review.rating === 5)
    } else if (filter === '4-star') {
      filtered = allReviews.filter(review => review.rating === 4)
    }
    
    setFilteredReviews(filtered)
    setDisplayedReviews(filtered.slice(0, reviewsLimit))
    setHasMoreToLoad(filtered.length > reviewsLimit)
      
      // End transition after content is updated
      setTimeout(() => {
        setIsTransitioning(false)
      }, 150)
    }, 200)
  }, [allReviews, filter, reviewsLimit])

  const loadMoreReviews = async () => {
    if (loadingMore || !hasMoreToLoad) return
    
    setLoadingMore(true)
    setIsTransitioning(true)
    
    // Add delay for smooth animation
    setTimeout(() => {
      const currentLength = displayedReviews.length
      const nextReviews = filteredReviews.slice(currentLength, currentLength + reviewsLimit)
      
      setDisplayedReviews(prev => [...prev, ...nextReviews])
      setHasMoreToLoad(currentLength + nextReviews.length < filteredReviews.length)
      
      setTimeout(() => {
        setIsTransitioning(false)
        setLoadingMore(false)
      }, 300)
    }, 300)
  }

  const handleNavigation = (path: string) => {
    navigate(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleFormToggle = () => {
    if (showSubmissionForm) {
      // Hide form with same transition as filter tabs
      setIsFormTransitioning(true)
      setTimeout(() => {
        setShowSubmissionForm(false)
        setTimeout(() => {
          setIsFormTransitioning(false)
        }, 50)
      }, 200)
    } else {
      // Show form with same transition as filter tabs
      setIsFormTransitioning(true)
      setShowSubmissionForm(true)
      setTimeout(() => {
        setIsFormTransitioning(false)
      }, 50)
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseInt(value) : value
    })
  }

  const handleProjectChange = (projectTitle: string) => {
    if (projectTitle === 'No specific project') {
      setSelectedProjectTitle('')
      setFormData({
        ...formData,
        project_id: ''
      })
    } else {
      setSelectedProjectTitle(projectTitle)
      const selectedProject = projects.find(p => p.title === projectTitle)
      setFormData({
        ...formData,
        project_id: selectedProject?.id || ''
      })
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB')
        return
      }
      
      setAvatarFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile) return null
    
    setUploadingAvatar(true)
    try {
      const fileName = `review-avatar-${Date.now()}-${Math.random().toString(36).substring(2)}.${avatarFile.name.split('.').pop()}`
      const { error } = await db.uploadAvatar(avatarFile, fileName)
      
      if (error) throw error
      
      const { data } = db.getAvatarUrl(fileName)
      return data.publicUrl
    } catch (error) {
      console.error('Error uploading avatar:', error)
      // Don't show error alert, just return null to use gradient avatar
      return null
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.client_name.trim() || !formData.review_text.trim()) return

    setSubmitting(true)
    try {
      // Upload avatar if provided, otherwise use empty string for gradient avatar
      let avatarUrl = ''
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar()
        if (uploadedUrl) {
          avatarUrl = uploadedUrl
        }
        // If upload fails, avatarUrl remains empty string and gradient avatar will be used
      }
      
      const { error } = await db.createReview({
        ...formData,
        avatar_url: avatarUrl || undefined, // Use undefined for gradient avatar fallback
        project_id: formData.project_id || null, // Explicitly set to null if empty
        approved: false // Reviews need admin approval
      })

      if (error) throw error

      setSubmissionSuccess(true)
      setFormData({
        client_name: '',
        client_company: '',
        rating: 5,
        review_text: '',
        project_id: '',
        avatar_url: ''
      })
      setSelectedProjectTitle('')
      setAvatarFile(null)
      setAvatarPreview(null)

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmissionSuccess(false)
      }, 5000)

    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Error submitting review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setSubmissionSuccess(false)
    setFormData({
      client_name: '',
      client_company: '',
      rating: 5,
      review_text: '',
      project_id: '',
      avatar_url: ''
    })
    setSelectedProjectTitle('')
    setAvatarFile(null)
    setAvatarPreview(null)
  }
  // Calculate statistics
  const averageRating = allReviews.length > 0 
    ? allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length 
    : 0

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: allReviews.filter(review => review.rating === rating).length,
    percentage: allReviews.length > 0 
      ? (allReviews.filter(review => review.rating === rating).length / allReviews.length) * 100 
      : 0
  }))

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-7 bg-gray-50 animate-fade-in">
      <SEOHead
        title="Client Reviews & Testimonials | Nonce Firewall"
        description="Read authentic client reviews and testimonials for my web development services. See what clients say about working with me on React, Node.js, and full-stack projects."
        keywords="client reviews, testimonials, web developer reviews, react developer testimonials, full-stack developer feedback"
        url="/reviews"
      />
      <ScrollToTopAndBottomButtons />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="animate-slide-up">
            <h1 className="text-2xl sm:text-5xl font-bold text-gray-900 mb-6">Client Reviews</h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Hear what my clients have to say about working with me. These testimonials reflect 
              the quality and dedication I bring to every project.
            </p>
          </div>
        </div>

        {/* Review Submission Section */}
        <div className="mb-8 sm:mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 text-white text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Share Your Experience</h2>
            <p className="text-blue-100 mb-4 sm:mb-6 max-w-2xl mx-auto text-sm sm:text-base">
              Worked with me on a project? I'd love to hear about your experience! 
              Your feedback helps me improve and helps others understand what it's like to work together.
            </p>
            <button
              onClick={handleFormToggle}
              className="bg-white text-blue-600 px-6 py-2 sm:px-8 sm:py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm sm:text-base"
            >
              {showSubmissionForm ? 'Hide Form' : 'Write a Review'}
            </button>
          </div>

          {/* Review Submission Form */}
          {showSubmissionForm && (
            <div className={`bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 transition-all duration-500 ease-in-out ${
              isFormTransitioning 
                ? 'opacity-0 transform translate-y-4 scale-95' 
                : 'opacity-100 transform translate-y-0 scale-100'
            }`}>
              <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">Submit Your Review</h3>
                  <form onSubmit={handleSubmitReview} className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Name *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="client_name"
                            required
                            value={formData.client_name}
                            onChange={handleFormChange}
                            className="w-full pl-10 pr-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 text-sm sm:text-base"
                            placeholder="Enter your full name"
                          />
                        </div>
                      </div>
                      
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company (Optional)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Building className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="client_company"
                            value={formData.client_company}
                            onChange={handleFormChange}
                            className="w-full pl-10 pr-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 text-sm sm:text-base"
                            placeholder="Your company name"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Profile Picture Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profile Picture (Optional) 
                        <span className="text-xs text-gray-500 ml-1">- Beautiful gradient avatar will be generated if not provided</span>
                      </label>
                      <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                        {/* Avatar Preview */}
                        <div className="relative flex-shrink-0">
                          {avatarPreview ? (
                            <div className="relative group">
                              <img
                                src={avatarPreview}
                                alt="Avatar preview"
                                className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-full border-2 sm:border-4 border-white shadow-lg"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setAvatarFile(null)
                                  setAvatarPreview(null)
                                }}
                                className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors duration-300 opacity-0 group-hover:opacity-100"
                              >
                                ×
                              </button>
                            </div>
                          ) : (
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-2 sm:border-4 border-white shadow-lg">
                              <span className="text-white font-bold text-sm sm:text-lg">
                                {formData.client_name ? formData.client_name.slice(0, 2).toUpperCase() : '?'}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* Upload Button */}
                        <div className="flex-1">
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleAvatarChange}
                              className="hidden"
                              disabled={uploadingAvatar}
                            />
                            <div className="bg-gray-100 hover:bg-gray-200 border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-lg p-3 sm:p-4 text-center transition-all duration-300 transform hover:scale-105">
                              {uploadingAvatar ? (
                                <div className="flex items-center justify-center space-x-2">
                                  <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-blue-500"></div>
                                  <span className="text-sm text-gray-600">Uploading...</span>
                                </div>
                              ) : (
                                <div>
                                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2">
                                    <User size={12} className="sm:w-4 sm:h-4 text-blue-500" />
                                  </div>
                                  <p className="text-xs sm:text-sm text-gray-600">
                                    {avatarPreview ? 'Change Picture' : 'Upload Picture'}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-0.5 sm:mt-1">
                                    PNG, JPG up to 5MB • Optional
                                  </p>
                                  <p className="text-xs text-blue-600 mt-0.5 sm:mt-1 font-medium">
                                    💡 No photo? We'll create a beautiful gradient avatar for you!
                                  </p>
                                </div>
                              )}
                            </div>
                          </label>
                        </div>
                      </div>
                      
                      {/* Preview of what the avatar will look like */}
                      {!avatarPreview && formData.client_name && (
                        <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-xs text-blue-800 text-center">
                            <span className="font-medium">Preview:</span> Your review will display with a beautiful gradient avatar featuring your initials "{formData.client_name.slice(0, 2).toUpperCase()}"
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Related Project (Optional)
  </label>
  <button
    type="button"
    onClick={() => setShowProjectModal(true)}
    className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg text-left text-sm sm:text-base text-gray-700 hover:bg-gray-100 transition-all duration-300 flex items-center justify-between"
  >
    <span className="truncate">
      {selectedProjectTitle || 'Select a project (optional)'}
    </span>
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </button>
</div>

{/* Project Selection Modal */}
{showProjectModal && createPortal(
  <div
    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999] p-4"
    onClick={() => setShowProjectModal(false)}
  >
    <div
      className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] transform transition-all duration-300 ease-out animate-modal-scale-in"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Select Project</h3>
          <button
            onClick={() => setShowProjectModal(false)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-60 overflow-y-auto space-y-1">
          {['No specific project', ...projects.map(p => p.title)].map((title) => (
            <button
              key={title}
              onClick={() => {
                handleProjectChange(title)
                setShowProjectModal(false)
              }}
              className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                selectedProjectTitle === title
                  ? 'bg-blue-100 text-blue-700 font-medium'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {title}
            </button>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => setShowProjectModal(false)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            Apply Selection
          </button>
        </div>
      </div>
    </div>
  </div>,
  document.body
)}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Rating *
                      </label>
                      <div className="flex justify-center space-x-1 sm:space-x-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => setFormData({ ...formData, rating })}
                            className="group relative p-1 sm:p-2 transition-all duration-300 transform hover:scale-110 active:scale-95"
                            aria-label={`Rate ${rating} star${rating !== 1 ? 's' : ''}`}
                          >
                            <Star
                              size={24}
                              className={`transition-all duration-300 ${
                                rating <= formData.rating
                                  ? 'text-yellow-400 fill-current drop-shadow-lg'
                                  : 'text-gray-300 hover:text-yellow-200'
                              }`}
                            />
                            {rating <= formData.rating && (
                              <div className="absolute inset-0 bg-yellow-400 rounded-full opacity-20 animate-ping"></div>
                            )}
                          </button>
                        ))}
                      </div>
                      <p className="text-center text-gray-600 mt-2 text-sm sm:text-base">
                        {formData.rating === 5 && "Excellent! 🌟"}
                        {formData.rating === 4 && "Very Good! 👍"}
                        {formData.rating === 3 && "Good 👌"}
                        {formData.rating === 2 && "Fair 😐"}
                        {formData.rating === 1 && "Needs Improvement 😔"}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Review *
                      </label>
                      <textarea
                        name="review_text"
                        required
                        rows={4}
                        value={formData.review_text}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 resize-none text-sm sm:text-base"
                        placeholder="Share your experience working with me. What did you like? How was the communication? Would you recommend my services?"
                      />
                      <div className="mt-2 text-right">
                        <span className={`text-xs ${
                          formData.review_text.length > 500 ? 'text-red-500' : 'text-gray-500'
                        }`}>
                          {formData.review_text.length}/500 characters
                        </span>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                      <p className="text-blue-800 text-xs sm:text-sm">
                        <strong>Note:</strong> Your review will be reviewed before being published. 
                        This helps maintain the quality and authenticity of testimonials.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                      <button
                        type="submit"
                        disabled={submitting || uploadingAvatar || !formData.client_name.trim() || !formData.review_text.trim()}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 sm:px-8 sm:py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-105 active:scale-95 text-sm sm:text-base"
                      >
                        {submitting || uploadingAvatar ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                            {uploadingAvatar ? 'Uploading...' : 'Submitting...'}
                          </>
                        ) : (
                          <>
                            <Send size={16} className="mr-2 sm:w-5 sm:h-5" />
                            Submit Review
                          </>
                        )}
                      </button>
                      
                      <button
                        type="button"
                        onClick={resetForm}
                        className="border-2 border-gray-300 text-gray-700 px-6 py-2 sm:px-8 sm:py-3 rounded-xl font-medium transition-all duration-300 hover:bg-gray-50 hover:border-gray-400 transform hover:scale-105 active:scale-95 text-sm sm:text-base"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
              </div>
            </div>
          )}
        </div>
        
        {/* Success Pop-up Modal */}
        {submissionSuccess && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 max-w-xs sm:max-w-sm w-full mx-4 transform animate-scale-in">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 animate-bounce" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Thank You! 🎉</h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm">
                  Your review has been submitted successfully! It will be reviewed and published soon.
                </p>
                <div className="flex flex-col gap-2 sm:gap-3">
                  <button
                    onClick={resetForm}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 text-xs sm:text-sm"
                  >
                    Submit Another Review
                  </button>
                  <button
                    onClick={() => setSubmissionSuccess(false)}
                    className="w-full border border-gray-300 text-gray-700 px-3 py-2 rounded-lg font-medium hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 active:scale-95 text-xs sm:text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {allReviews.length === 0 ? (
          <div className="text-center py-8 sm:py-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <MessageSquare className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">No Reviews Yet</h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-md mx-auto mb-6 sm:mb-8">
              I'm building relationships with amazing clients. Check back soon for testimonials!
            </p>
            <button
              onClick={() => setShowSubmissionForm(true)}
              className="btn-primary py-2 px-4 text-sm sm:text-base"
            >
              Be My First Review
            </button>
          </div>
        ) : (
          <>
            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 lg:p-6 text-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 lg:mb-4">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-500" />
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                  {averageRating.toFixed(1)}
                </div>
                <div className="text-gray-600 text-xs sm:text-sm lg:text-base">Average Rating</div>
                <div className="flex justify-center mt-1 sm:mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={i < Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 lg:p-6 text-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 lg:mb-4">
                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-500" />
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{allReviews.length}</div>
                <div className="text-gray-600 text-xs sm:text-sm lg:text-base">Total Reviews</div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 lg:p-6 text-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 lg:mb-4">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-500" />
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                  {allReviews.filter(r => r.rating === 5).length}
                </div>
                <div className="text-gray-600 text-xs sm:text-sm lg:text-base">5-Star Reviews</div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 lg:p-6 text-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 lg:mb-4">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-500" />
                </div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                  {Math.round((allReviews.filter(r => r.rating >= 4).length / allReviews.length) * 100)}%
                </div>
                <div className="text-gray-600 text-xs sm:text-sm lg:text-base">Satisfaction Rate</div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Rating Distribution</h2>
              <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
                    <div className="flex items-center space-x-1 sm:space-x-2 w-12 sm:w-16 lg:w-20">
                      <span className="text-sm font-medium text-gray-700">{rating}</span>
                      <Star size={12} className="sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 sm:h-3">
                      <div
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 sm:h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-600 w-8 sm:w-10 lg:w-12 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex justify-center mb-6 sm:mb-8 animate-slide-up" style={{ animationDelay: '0.8s' }}>
              <div className="bg-white rounded-lg p-1 shadow-lg w-full sm:w-auto overflow-x-auto">
                <div className="flex min-w-max sm:min-w-0">
                <button
                  onClick={() => {
                    if (filter !== 'all') {
                      setFilter('all')
                    }
                  }}
                  className={`px-3 py-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap transform hover:scale-105 active:scale-95 ${
                    filter === 'all' 
                      ? 'bg-blue-500 text-white shadow-md' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  All Reviews ({allReviews.length})
                </button>
                <button
                  onClick={() => {
                    if (filter !== '5-star') {
                      setFilter('5-star')
                    }
                  }}
                  className={`px-3 py-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap transform hover:scale-105 active:scale-95 ${
                    filter === '5-star' 
                      ? 'bg-yellow-500 text-white shadow-md' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  5-Star ({allReviews.filter(r => r.rating === 5).length})
                </button>
                <button
                  onClick={() => {
                    if (filter !== '4-star') {
                      setFilter('4-star')
                    }
                  }}
                  className={`px-3 py-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap transform hover:scale-105 active:scale-95 ${
                    filter === '4-star' 
                      ? 'bg-green-500 text-white shadow-md' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  4-Star ({allReviews.filter(r => r.rating === 4).length})
                </button>
                </div>
              </div>
            </div>

            {/* Reviews Grid */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16 transition-all duration-500 ease-in-out ${
              isTransitioning 
                ? 'opacity-0 transform translate-y-4 scale-95' 
                : 'opacity-100 transform translate-y-0 scale-100'
            }`}>
              {displayedReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  project={review.project_id ? projects.find(p => p.id === review.project_id) : undefined}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMoreToLoad && displayedReviews.length > 0 && (
              <div className="text-center mb-8 sm:mb-12">
                <button
                  onClick={loadMoreReviews}
                  disabled={loadingMore}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto transform hover:scale-105 active:scale-95 text-sm sm:text-base"
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                      Loading More Reviews...
                    </>
                  ) : (
                    <>
                      Load More Reviews
                      <span className="ml-2 bg-white/20 text-white px-2 py-1 rounded-full text-xs sm:text-sm">
                        {filteredReviews.length - displayedReviews.length} more
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}

            {displayedReviews.length === 0 && filter !== 'all' && (
              <div className={`text-center py-8 sm:py-12 transition-all duration-500 ease-in-out ${
                isTransitioning 
                  ? 'opacity-0 transform translate-y-4' 
                  : 'opacity-100 transform translate-y-0'
              }`}>
                <p className="text-gray-600 text-base sm:text-lg">
                  No {filter} reviews found.
                </p>
              </div>
            )}
          </>
        )}

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 text-white text-center animate-slide-up" style={{ animationDelay: '1.2s' }}>
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Ready to Work Together?</h2>
          <p className="text-blue-100 mb-4 sm:mb-6 max-w-2xl mx-auto text-sm sm:text-base">
            Join my satisfied clients and let's create something amazing together. 
            I'm committed to delivering exceptional results that exceed expectations.
          </p>
          <button
            onClick={() => handleNavigation('/contact')}
            className="bg-white text-blue-600 px-6 py-2 sm:px-8 sm:py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm sm:text-base"
          >
            Start Your Project
          </button>
        </div>
      </div>
    </div>
  )
}

export default Reviews
