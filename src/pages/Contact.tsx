import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Phone, MapPin, Send, CheckCircle, RotateCcw, X } from 'lucide-react'
import { useForm } from '@formspree/react'
import ScrollToTopAndBottomButtons from '../components/ScrollToTopAndBottomButtons'
import { createPortal } from 'react-dom'

// --- MODIFICATION START ---

// 1. Define the props interface for the modal.
interface SuccessModalProps {
  countdown: number;
  resetForm: () => void;
  handleNavigation: (path: string) => void;
}

// 2. Move the SuccessModal component outside of the Contact component.
const SuccessModal: React.FC<SuccessModalProps> = ({ countdown, resetForm, handleNavigation }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 max-w-xs sm:max-w-md w-full mx-4 relative overflow-hidden animate-scale-in">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 opacity-60"></div>
        
        {/* Floating particles animation */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-4 left-4 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
          <div className="absolute top-8 right-8 w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></div>
          <div className="absolute bottom-4 right-4 w-1 h-1 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 text-center">
          {/* Success Icon with pulse animation */}
          <div className="relative mx-auto mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto animate-scale-in">
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-bounce-slow" />
            </div>
            {/* Ripple effect */}
            <div className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 bg-green-400 rounded-full animate-ping opacity-20"></div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 animate-slide-up">
            Message Sent Successfully! 🎉
          </h2>
          
          <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Thank you for reaching out! I'll get back to you within 24 hours with a detailed response.
          </p>

          {/* Countdown Timer */}
          <div className="mb-4 sm:mb-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4">
              <svg className="w-16 h-16 sm:w-20 sm:h-20 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - ((5 - countdown) / 5))}`}
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  key={countdown}
                  className="text-lg sm:text-xl font-bold text-gray-900 animate-pulse"
                >
                  {countdown}
                </span>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 animate-fade-in">
              Auto-reset in {countdown} second{countdown !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 sm:space-y-3 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <button
              onClick={resetForm}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg transform hover:scale-105 active:scale-95 flex items-center justify-center text-sm"
            >
              <RotateCcw size={16} className="mr-2 animate-spin-slow" />
              Send Another Message
            </button>
            
            <button
              onClick={() => {
                resetForm()
                handleNavigation('/')
              }}
              className="w-full border-2 border-gray-300 text-gray-700 px-4 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 hover:bg-gray-50 hover:border-gray-400 transform hover:scale-105 active:scale-95 text-sm"
            >
              Back to Homepage
            </button>
          </div>

          {/* Decorative elements */}
          <div className="mt-4 sm:mt-6 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
// --- MODIFICATION END ---


const Contact: React.FC = () => {
  const [state, handleSubmit, reset] = useForm("mldbqpgy")
  const navigate = useNavigate()
  
  const handleNavigation = (path: string) => {
    navigate(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const [showTimelineModal, setShowTimelineModal] = useState(false)
  const [showTypeModal, setShowTypeModal] = useState(false) 
  const [selectedTimeline, setSelectedTimeline] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    project_type: '',
    budget: '',
    timeline: '',
    subject: '',
    message: ''
  })

  // handlers
  const handleTimelineSelect = (option: string) => {
    setSelectedTimeline(option)
    setFormData(f => ({ ...f, timeline: option })) // Note: changed from project_timeline
    setShowTimelineModal(false)
  }

  const handleTypeSelect = (option: string) => {
    setSelectedType(option)
    setFormData(f => ({ ...f, project_type: option }))
    setShowTypeModal(false) 
  }

  // Set page title for SEO
  useEffect(() => {
    document.title = 'Contact - Hire Full-Stack Developer | Free Consultation | Nonce Firewall'
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Get in touch to discuss your web development project. I specialize in React, Next.js, Node.js, and full-stack development. Free consultation available for custom web applications, e-commerce solutions, and API development. 24-hour response time guaranteed.')
    }
    
    // Add structured data for contact page
    const existingScript = document.querySelector('script[data-seo="contact"]')
    if (!existingScript) {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-seo', 'contact')
      script.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contact Nonce Firewall - Full-Stack Developer",
        "description": "Get in touch for web development projects and consultations",
        "url": "https://noncefirewall.dev/contact",
        "mainEntity": {
          "@type": "Person",
          "name": "Nonce Firewall",
          "email": "build@noncefirewall.tech",
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "email": "build@noncefirewall.tech",
            "availableLanguage": "English"
          }
        }
      })
      document.head.appendChild(script)
    }
  }, [])

  // Open modal and reset countdown when submission succeeds
  useEffect(() => {
    if (state.succeeded) {
      setShowSuccessModal(true)
      setCountdown(5)
    }
  }, [state.succeeded])

  // Countdown effect
  useEffect(() => {
    if (!showSuccessModal) return

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }

    if (countdown === 0) {
      resetForm()
    }
  }, [countdown, showSuccessModal])
  
  const resetForm = () => {
    setShowSuccessModal(false)
    reset() // Reset Formspree state
    setFormData({
      name: '',
      email: '',
      project_type: '',
      budget: '',
      timeline: '',
      subject: '',
      message: ''
    })
    setSelectedTimeline('') // Also reset selected values for custom dropdowns
    setSelectedType('')
    setCountdown(5)
  }
  
  const timelineOptions = [
    '1-2 Weeks', '1 Month', '2-3 Months', '3-6 Months', 'Flexible'
  ]
  
  const typeOptions = [
    'Website Development', 'Web Application', 'E-commerce Store', 'Dashboard/Admin Panel',
    'Landing Page', 'Portfolio Website', 'Custom Development', 'Consultation'
  ]

  const budgetRanges = [
    'Under $1,000', '$1,000 - $5,000', '$5,000 - $10,000',
    '$10,000 - $25,000', '$25,000+', "Let's Discuss"
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Manually add custom dropdown values to the form data passed to handleSubmit
    const submissionData = {
      ...formData,
      project_type: selectedType,
      timeline: selectedTimeline
    };
    await handleSubmit(submissionData)
  }

  // Success Modal Component is now defined outside

  // Lock scroll when modal is open
  useEffect(() => {
    if (showSuccessModal || showTimelineModal || showTypeModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showSuccessModal, showTimelineModal, showTypeModal])

  return (
    <div className="min-h-screen pt-7 bg-gray-50 animate-fade-in">
      {/* 3. Update how the modal is called to pass the required props. */}
      {showSuccessModal && createPortal(
        <SuccessModal
          countdown={countdown}
          resetForm={resetForm}
          handleNavigation={handleNavigation}
        />,
        document.body
      )}
      
      <ScrollToTopAndBottomButtons />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <div className="animate-slide-up">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">Get In Touch</h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Ready to start your next project? Let's discuss how I can help bring your ideas to life.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Contact Info */}
          <div className="space-y-4 sm:space-y-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Let's Connect</h2>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Email</h3>
                    <p className="text-gray-600 text-sm sm:text-base">build@noncefirewall.tech</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Phone</h3>
                    <p className="text-gray-600 text-sm sm:text-base">Available via WhatsApp</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Location</h3>
                    <p className="text-gray-600 text-sm sm:text-base">Remote & Available Worldwide</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">What I Can Help With</h3>
              <ul className="space-y-2 sm:space-y-3 text-gray-600 text-sm sm:text-base">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Custom Web Application Development</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>E-commerce Solutions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>API Development & Integration</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Database Design & Optimization</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Performance Optimization</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Technical Consulting</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Send Me a Message</h2>
            
            {state.errors && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm sm:text-base">There was an error sending your message. Please try again.</p>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 text-sm sm:text-base" placeholder="Your full name" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 text-sm sm:text-base" placeholder="your@email.com" />
                </div>
              </div>

              {/* Project Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
                <button 
                  type="button" 
                  onClick={() => setShowTypeModal(true)} 
                  className="w-full px-4 py-2 border rounded-lg flex justify-between items-center hover:bg-gray-50 text-left"
                  aria-haspopup="listbox"
                  aria-expanded={showTypeModal}
                >
                  <span className={selectedType ? 'text-gray-900' : 'text-gray-400'}>{selectedType || 'Select project type'}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
              </div>

              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                  {budgetRanges.map((range) => (
                    <label key={range} className="flex items-center space-x-2 cursor-pointer group">
                      <input type="radio" name="budget" value={range} checked={formData.budget === range} onChange={handleChange} className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 transition-all duration-300" />
                      <span className="text-xs sm:text-sm text-gray-700 group-hover:text-blue-600 transition-colors duration-300">{range}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Project Timeline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Timeline</label>
                <button 
                  type="button" 
                  onClick={() => setShowTimelineModal(true)} 
                  className="w-full px-4 py-2 border rounded-lg flex justify-between items-center hover:bg-gray-50 text-left"
                  aria-haspopup="listbox"
                  aria-expanded={showTimelineModal}
                >
                  <span className={selectedTimeline ? 'text-gray-900' : 'text-gray-400'}>{selectedTimeline || 'Select timeline'}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                <input type="text" id="subject" name="subject" required value={formData.subject} onChange={handleChange} className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 text-sm sm:text-base" placeholder="Brief description of your project" />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Project Details *</label>
                <textarea id="message" name="message" required rows={4} value={formData.message} onChange={handleChange} className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-300 resize-none text-sm sm:text-base" placeholder="Tell me about your project, goals, and any specific requirements..." />
              </div>

              <button type="submit" disabled={state.submitting} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-105 active:scale-95">
                {state.submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send size={20} className="mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>

            {/* Timeline Modal */}
            {showTimelineModal && createPortal(
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999] p-4" onClick={() => setShowTimelineModal(false)}>
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] transform transition-all duration-300 ease-out animate-modal-scale-in" onClick={(e) => e.stopPropagation()} role="listbox">
                  <div className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Select Project Timeline</h3>
                      <button onClick={() => setShowTimelineModal(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"><X size={20} /></button>
                    </div>
                    <div className="max-h-60 overflow-y-auto space-y-1">
                      {timelineOptions.map(option => (
                        <button 
                          key={option} 
                          onClick={() => handleTimelineSelect(option)} 
                          className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 text-sm ${selectedTimeline === option ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-100 text-gray-700'}`}
                          role="option"
                          aria-selected={selectedTimeline === option}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>,
              document.body
            )}

            {/* Type Modal */}
            {showTypeModal && createPortal(
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999] p-4" onClick={() => setShowTypeModal(false)}>
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] transform transition-all duration-300 ease-out animate-modal-scale-in" onClick={(e) => e.stopPropagation()} role="listbox">
                  <div className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Select Project Type</h3>
                      <button onClick={() => setShowTypeModal(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"><X size={20} /></button>
                    </div>
                    <div className="max-h-60 overflow-y-auto space-y-1">
                      {typeOptions.map(option => (
                        <button 
                          key={option} 
                          onClick={() => handleTypeSelect(option)} 
                          className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 text-sm ${selectedType === option ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-100 text-gray-700'}`}
                          role="option"
                          aria-selected={selectedType === option}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>,
              document.body
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
