import React, { useEffect, useState } from 'react'
import { Code } from 'lucide-react'
import AnimatedStats from '../components/AnimatedStats'
import AnimatedSkillBar from '../components/AnimatedSkillBar'
import ScrollToTopAndBottomButtons from '../components/ScrollToTopAndBottomButtons'
import { db, subscribeToTable, unsubscribeFromTable } from '../lib/supabase'
import type { Skill, SiteSettings } from '../types'

const About: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([])
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)

  // Set page title for SEO
  useEffect(() => {
    document.title = 'About Me - Full-Stack Developer | 5+ Years Experience | Nonce Firewall'
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn about my 5+ year journey as a full-stack developer, my expertise in React, Next.js, Node.js, and modern web technologies. Discover my skills, 50+ completed projects, and passion for creating exceptional digital experiences.')
    }
    
    // Add structured data for about page
    const existingScript = document.querySelector('script[data-seo="about"]')
    if (!existingScript) {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-seo', 'about')
      script.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "About Nonce Firewall - Full-Stack Developer",
        "description": "Learn about Nonce Firewall's journey, skills, and experience as a professional full-stack developer",
        "url": "https://noncefirewall.dev/about",
        "mainEntity": {
          "@type": "Person",
          "name": "Nonce Firewall",
          "jobTitle": "Full-Stack Developer",
          "description": "Professional full-stack developer with 5+ years experience and 50+ completed projects"
        }
      })
      document.head.appendChild(script)
    }
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const [skillsResult, settingsResult] = await Promise.all([
      db.getSkills(),
      db.getSiteSettings()
    ])
    
    if (skillsResult.data) setSkills(skillsResult.data)
    if (settingsResult.data) setSettings(settingsResult.data)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
    
    // Subscribe to real-time changes
    subscribeToTable('skills', () => {
      fetchData()
    })
    
    subscribeToTable('site_settings', () => {
      fetchData()
    })
    
    return () => {
      unsubscribeFromTable('skills')
      unsubscribeFromTable('site_settings')
    }
  }, [])

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-7 bg-gray-50 animate-fade-in">
      <ScrollToTopAndBottomButtons />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-slide-up">
          <h1 className="text-2xl sm:text-5xl font-bold text-gray-900 mb-6">About Me</h1>
          
          {/* Admin-managed main about text with enhanced styling */}
          <div className="relative max-w-4xl mx-auto mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-purple-50 to-pink-100 rounded-2xl transform rotate-1"></div>
            <div className="relative bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="absolute top-4 left-4 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="absolute top-6 right-6 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping"></div>
              <div className="absolute bottom-4 left-6 w-1 h-1 bg-pink-400 rounded-full animate-bounce"></div>
              
              <p className="text-lg text-gray-700 leading-relaxed font-medium">
                {settings?.about_text || 'Passionate full-stack developer with expertise in modern web technologies. I create scalable, user-friendly applications that solve real-world problems and deliver exceptional user experiences.'}
              </p>
            </div>
          </div>

          {/* Enhanced custom text sections with premium card designs */}
          <div className="max-w-5xl mx-auto space-y-6">
            {/* First custom text - Gradient border card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-sm opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative bg-white rounded-2xl shadow-lg border-2 border-transparent bg-clip-padding p-6 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 overflow-hidden">
                <div className="float-left w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg mr-4 mb-2">
                  <span className="text-white font-bold text-xl">🥇</span>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed text-left">
                  My journey in frontend development began with a fascination for creating digital experiences that seamlessly blend form and function. Over the past 2+ years, I've evolved from mastering the fundamentals of HTML, CSS, and JavaScript to architecting sophisticated applications with React, TypeScript, and modern development frameworks.
                </p>
              </div>
            </div>

            {/* Second custom text - Glass morphism effect */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-2xl transform -rotate-1 opacity-50"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:bg-white/90 transition-all duration-500 transform hover:scale-[1.02] overflow-hidden">
                <div className="float-left w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center shadow-lg mr-4 mb-2">
                  <span className="text-white font-bold text-xl">🥈</span>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed text-left">
                  While my primary expertise lies in frontend development, I've expanded my skill set to include full-stack capabilities, allowing me to build complete web applications from database to user interface. This comprehensive understanding enables me to create more cohesive and efficient solutions.
                </p>
              </div>
            </div>

            {/* Third custom text - Neumorphism style */}
            <div className="relative group">
              <div className="bg-gray-50 rounded-2xl shadow-inner p-6 hover:shadow-lg transition-all duration-500 transform hover:scale-[1.01] overflow-hidden" style={{
                boxShadow: 'inset 8px 8px 16px #e2e8f0, inset -8px -8px 16px #ffffff, 0 4px 20px rgba(0,0,0,0.1)'
              }}>
                <div className="float-left w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg mr-4 mb-2">
                  <span className="text-white font-bold text-xl">🥉</span>
                </div>
                <p className="text-lg text-left text-gray-700 leading-relaxed">
                  I specialize in transforming complex ideas into intuitive, accessible interfaces that not only meet business objectives but exceed user expectations. My approach combines technical precision with creative problem-solving, ensuring every project delivers both visual impact and optimal performance.
                </p>
              </div>
            </div>

            {/* Fourth custom text - Premium diamond card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-500 blur-xl"></div>
              <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl border border-gray-200 p-8 hover:shadow-3xl transition-all duration-700 transform hover:-translate-y-2 hover:rotate-1">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-t-2xl"></div>
                <div className="overflow-hidden">
                  <div className="float-left w-10 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-xl animate-pulse mr-4 mb-2">
                    <span className="text-white font-bold text-2xl">💎</span>
                  </div>
                  <div className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-ping"></div>
                  <p className="text-lg max-w-none text-gray-700 leading-relaxed text-left">
                    I believe great frontend development is where technical expertise meets creative vision, resulting in digital experiences that truly resonate with users. My full-stack knowledge allows me to build complete solutions while maintaining focus on exceptional user experiences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        {settings && (
          <div className="mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <AnimatedStats
              yearsExperience={settings.years_experience}
              projectsCompleted={settings.projects_completed}
              happyClients={settings.happy_clients}
              commitsCount={settings.commits_count}
            />
          </div>
        )}

        {/* Skills Section */}
        <div className="mb-16 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-6">Skills & Expertise</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Here are the technologies and tools I work with to bring ideas to life.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category} className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <Code className="w-6 h-6 text-blue-500 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900 capitalize">{category}</h3>
                </div>
                <div className="space-y-4">
                  {categorySkills.map((skill) => (
                    <React.Suspense key={skill.id} fallback={
                      <div className="animate-pulse">
                        <div className="flex justify-between items-center mb-2">
                          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                          <div className="h-3 bg-gray-200 rounded w-8"></div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2"></div>
                      </div>
                    }>
                      <AnimatedSkillBar
                        name={skill.name}
                        proficiency={skill.proficiency}
                        delay={categorySkills.indexOf(skill) * 200}
                      />
                    </React.Suspense>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Timeline */}
        <div className="bg-white rounded-xl shadow-lg p-8 animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-6">Experience</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              My journey as a developer and the milestones I've achieved.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-4 h-4 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Full-Stack Developer</h3>
                <p className="text-blue-600 font-medium">2025 - Present</p>
                <p className="text-gray-600 mt-2">
                  Developing modern web applications using React, Node.js, and cloud technologies. 
                  Focus on creating scalable solutions and exceptional user experiences.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-4 h-4 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Front-End Developer</h3>
                <p className="text-green-600 font-medium">2022 - 2024</p>
                <p className="text-gray-600 mt-2">
                  Specialized in creating responsive, interactive user interfaces using modern 
                  JavaScript frameworks and CSS technologies.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-4 h-4 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Web Developer</h3>
                <p className="text-purple-600 font-medium">2021 - 2022</p>
                <p className="text-gray-600 mt-2">
                  Started my journey in web development, learning the fundamentals and 
                  building my first projects with HTML, CSS, and JavaScript.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
