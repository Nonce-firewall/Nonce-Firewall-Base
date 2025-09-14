import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, ArrowRight, Mail, MessageCircle, Clock } from 'lucide-react'
import Hero from '../components/Hero'
import ProjectCard from '../components/ProjectCard'
import ReviewCard from '../components/ReviewCard'
import TeamMemberCard from '../components/TeamMemberCard'
import ScrollToTopAndBottomButtons from '../components/ScrollToTopAndBottomButtons'
import SEOHead from '../components/SEOHead'
import { db } from '../lib/supabase'
import type { Project, Review, SiteSettings, TeamMember } from '../types'

interface HomeProps {
}

const Home: React.FC<HomeProps> = () => {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [allProjects, setAllProjects] = useState<Project[]>([])
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const [isTeamTransitioning, setIsTeamTransitioning] = useState(true)
  const navigate = useNavigate()

  const handleNavigation = (path: string) => {
    navigate(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Helper function to compare arrays for deep equality
  const arraysEqual = (a: any[], b: any[]): boolean => {
    if (a.length !== b.length) return false
    return a.every((item, index) => JSON.stringify(item) === JSON.stringify(b[index]))
  }

  const fetchData = async () => {
    const [featuredProjectsResult, allProjectsResult, reviewsResult, teamMembersResult, settingsResult] = await Promise.all([
      db.getProjects(true),
      db.getProjects(),
      db.getReviews(true, 4), // Limit to latest 4 reviews
      db.getTeamMembers(true), // Only active team members
      db.getSiteSettings()
    ])
    
    if (featuredProjectsResult.data) {
      // Show max 2 on mobile, 4 on desktop
      setFeaturedProjects(featuredProjectsResult.data.slice(0, 4))
    }
    if (allProjectsResult.data) setAllProjects(allProjectsResult.data)
    
    // Only update reviews if the data has actually changed
    if (reviewsResult.data && !arraysEqual(reviewsResult.data, reviews)) {
      setReviews(reviewsResult.data)
    }
    
    // Only update team members if the data has actually changed
    if (teamMembersResult.data && !arraysEqual(teamMembersResult.data, teamMembers)) {
      setTeamMembers(teamMembersResult.data)
    }
    
    if (settingsResult.data) setSettings(settingsResult.data)
  }

  useEffect(() => {
    fetchData()
    
    // Subscribe to real-time changes
    const setupSubscriptions = async () => {
      const { subscribeToTable } = await import('../lib/supabase')
      
      subscribeToTable('projects', () => {
        fetchData()
      })
      
      subscribeToTable('reviews', () => {
        fetchData()
      })
      
      subscribeToTable('team_members', () => {
        fetchData()
      })
      
      subscribeToTable('site_settings', () => {
        fetchData()
      })
    }
    
    setupSubscriptions()
    
    return () => {
      const cleanup = async () => {
        const { unsubscribeFromTable } = await import('../lib/supabase')
        unsubscribeFromTable('projects')
        unsubscribeFromTable('reviews')
        unsubscribeFromTable('team_members')
        unsubscribeFromTable('site_settings')
      }
      cleanup()
    }
  }, [])

  // Memoize display arrays to prevent unnecessary re-creation
  const displayReviews = useMemo(() => {
    return reviews.length > 0 ? [...reviews, reviews[0]] : []
  }, [reviews])

  const displayTeamMembers = useMemo(() => {
    return teamMembers.length > 0 ? [...teamMembers, teamMembers[0]] : []
  }, [teamMembers])
  
  // Auto-rotate reviews
  useEffect(() => {
    if (displayReviews && displayReviews.length > 1) {
      const interval = setInterval(() => {
        setCurrentReviewIndex((prev) => prev + 1)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [displayReviews.length])

  // Auto-rotate team members
  useEffect(() => {
    if (displayTeamMembers && displayTeamMembers.length > 1) {
      const interval = setInterval(() => {
        setCurrentTeamIndex((prev) => prev + 1)
      }, 4000) // Slightly different timing than reviews
      return () => clearInterval(interval)
    }
  }, [displayTeamMembers.length])

  // Handle seamless loop reset
  useEffect(() => {
    if (currentReviewIndex === reviews.length && reviews.length > 0) {
      // We're showing the duplicated first review, prepare to loop back
      const timer = setTimeout(() => {
        setIsTransitioning(false)
        setCurrentReviewIndex(0)
        // Re-enable transition after a brief moment
        setTimeout(() => {
          setIsTransitioning(true)
        }, 50)
      }, 500) // Wait for transition to complete
      
      return () => clearTimeout(timer)
    }
  }, [currentReviewIndex, reviews.length])

  // Handle seamless loop reset for team members
  useEffect(() => {
    if (currentTeamIndex === teamMembers.length && teamMembers.length > 0) {
      // We're showing the duplicated first team member, prepare to loop back
      const timer = setTimeout(() => {
        setIsTeamTransitioning(false)
        setCurrentTeamIndex(0)
        // Re-enable transition after a brief moment
        setTimeout(() => {
          setIsTeamTransitioning(true)
        }, 50)
      }, 500) // Wait for transition to complete
      
      return () => clearTimeout(timer)
    }
  }, [currentTeamIndex, teamMembers.length])

  return (
    <div className="min-h-screen animate-fade-in">
      <SEOHead
        title="Nonce Firewall - Expert Full-Stack Developer | React, Next.js & Node.js | Custom Web Development"
        description="Professional full-stack developer specializing in React, Next.js, Node.js, and modern web technologies. Custom web applications, e-commerce solutions, API development, and scalable development services. 5+ years experience with 50+ completed projects."
        keywords="full-stack developer, react developer, web development, javascript, typescript, node.js, Next.js, frontend developer, backend developer, web applications, portfolio, custom web development, e-commerce development, API development, database design, responsive design, mobile-first development, modern web technologies, scalable applications, user experience design, performance optimization"
        url="/"
        type="website"
      />
      <ScrollToTopAndBottomButtons showScrollDownButton={false} />
      <Hero />
      
      {/* About Section */}
      <section id="about-section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-6">About</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {settings?.about_text || 'Passionate full-stack developer with expertise in modern web technologies. I create scalable, user-friendly applications that solve real-world problems and deliver exceptional user experiences.'}
            </p>
            <div className="mt-8">
              <button
                onClick={() => handleNavigation('/about')}
                className="group relative inline-flex items-center px-2 py-1 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-lg"
              >
                <span className="relative z-10">Learn More</span>
                <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-6">Featured Projects</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Recent projects that showcase my skills and expertise in web development.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
            {/* Show only 3 on mobile, 2 on tablet, 4 on desktop */}
            {featuredProjects.slice(0, 3).map((project) => (
              <div key={project.id}>
                <ProjectCard 
                  project={project} 
                  onClick={() => {
                    navigate(`/projects/${project.id}`)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                />
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => handleNavigation('/projects')}
              className="btn-primary py-1 px-2 inline-flex items-center transform hover:scale-105 active:scale-95"
            >
              Projects
              <ArrowRight size={17} className="ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      {displayReviews && displayReviews.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-6">Testimonials</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                ​Real results, real feedback. These testimonials reflect the quality and dedication I bring to every project.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="relative overflow-hidden">
                <div 
                  className={`flex ${isTransitioning ? 'transition-transform duration-500 ease-in-out' : ''}`}
                  style={{ transform: `translateX(-${currentReviewIndex * 100}%)` }}
                >
                  {displayReviews.map((review, index) => (
                    <div key={`${review.id}-${index}`} className="w-full flex-shrink-0 px-4">
                      <ReviewCard 
                        review={review} 
                        variant="preview"
                        project={review.project_id ? allProjects.find(p => p.id === review.project_id) : undefined}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Review indicators */}
              <div className="flex justify-center items-center mt-8 space-x-4">
                <div className="flex space-x-2">
                {reviews && reviews.map((_, reviewIndex) => (
                  <button
                    key={reviewIndex}
                    onClick={() => {
                      setIsTransitioning(true)
                      setCurrentReviewIndex(reviewIndex)
                    }}
                    className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                      reviewIndex === currentReviewIndex || (currentReviewIndex === reviews.length && reviewIndex === 0) ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
                </div>
                
                {/* View All Reviews Button */}
                <button
                  onClick={() => handleNavigation('/reviews')}
                  className="group flex items-center space-x-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-md"
                  title="View all reviews"
                >
                  <span className="text-sm font-medium">View All</span>
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Team Section */}
      {displayTeamMembers && displayTeamMembers.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-6">Meet The Team</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                I believe in a collaborative approach, ensuring every detail is perfect and your project is delivered with excellence. We're passionate creators working in sync to turn your vision into a stunning reality, fast⚡
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="relative overflow-hidden">
                <div 
                  className={`flex ${isTeamTransitioning ? 'transition-transform duration-500 ease-in-out' : ''}`}
                  style={{ transform: `translateX(-${currentTeamIndex * 100}%)` }}
                >
                  {displayTeamMembers.map((member, index) => (
                    <div key={`${member.id}-${index}`} className="w-full flex-shrink-0 px-4">
                      <React.Suspense fallback={
                        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center animate-pulse">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full mx-auto mb-3 sm:mb-4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
                          <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto"></div>
                          </div>
                        </div>
                      }>
                        <TeamMemberCard teamMember={member} variant="preview" />
                      </React.Suspense>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team member indicators */}
              <div className="flex justify-center mt-8 space-x-2">
                {teamMembers && teamMembers.map((_, memberIndex) => (
                  <button
                    key={memberIndex}
                    onClick={() => {
                      setIsTeamTransitioning(true)
                      setCurrentTeamIndex(memberIndex)
                    }}
                    className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                      memberIndex === currentTeamIndex || (currentTeamIndex === teamMembers.length && memberIndex === 0) ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-6">Ready To Launch?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Let's discuss how we can help bring your ideas to life. Get in touch and let's create something amazing for your online presence.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Info */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Let's Connect</h3>
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Mail className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Email</h4>
                          <p className="text-gray-600">{settings?.email || 'hello@noncefirewall.dev'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <MessageCircle className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">WhatsApp</h4>
                          <p className="text-gray-600">Available for quick chats</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <Clock className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Response Time</h4>
                          <p className="text-gray-600">Within 24 hours</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Contact Form */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h3>
                  <div className="text-center">
                    <p className="text-gray-600 mb-6">
                      Ready To Launch? Use the contact form to provide detailed information about your requirements.
                    </p>
                    <button
                      onClick={() => handleNavigation('/contact')}
                      className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg flex items-center justify-center transform hover:scale-105 active:scale-95"
                    >
                      Open Form
                      <ArrowRight size={17} className="ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
