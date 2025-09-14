import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProjectCard from '../components/ProjectCard'
import ProjectSearch from '../components/ProjectSearch'
import ScrollToTopAndBottomButtons from '../components/ScrollToTopAndBottomButtons'
import { db } from '../lib/supabase'
import type { Project } from '../types'

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [displayedProjects, setDisplayedProjects] = useState<Project[]>([])
  const [showingAll, setShowingAll] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const navigate = useNavigate()
  
  const PROJECTS_PER_PAGE = 6

  // Set page title for SEO
  useEffect(() => {
    document.title = 'Web Development Projects Portfolio | React & Next.js Projects | Nonce Firewall'
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Explore my portfolio of 50+ web development projects including React applications, Next.js sites, full-stack solutions, e-commerce platforms, and custom web applications built with modern technologies like TypeScript, Node.js, and MongoDB.')
    }
    
    // Add structured data for projects page
    const existingScript = document.querySelector('script[data-seo="projects"]')
    if (!existingScript) {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-seo', 'projects')
      script.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Web Development Projects Portfolio",
        "description": "Portfolio showcasing 50+ web development projects including React applications, e-commerce solutions, and custom web applications",
        "url": "https://noncefirewall.dev/projects",
        "author": {
          "@type": "Person",
          "name": "Nonce Firewall"
        },
        "mainEntity": {
          "@type": "ItemList",
          "name": "Web Development Projects",
          "description": "Collection of professional web development projects"
        }
      })
      document.head.appendChild(script)
    }
  }, [])

  const fetchProjects = async () => {
    setLoading(true)
    const { data } = await db.getProjects()
    if (data) {
      setProjects(data)
      setFilteredProjects(data)
      setDisplayedProjects(data.slice(0, PROJECTS_PER_PAGE))
      setShowingAll(data.length <= PROJECTS_PER_PAGE)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProjects()
    
    // Subscribe to real-time changes
    const setupSubscriptions = async () => {
      const { subscribeToTable } = await import('../lib/supabase')
      
      subscribeToTable('projects', () => {
        fetchProjects()
      })
    }
    
    setupSubscriptions()
    
    return () => {
      const cleanup = async () => {
        const { unsubscribeFromTable } = await import('../lib/supabase')
        unsubscribeFromTable('projects')
      }
      cleanup()
    }
  }, [])

  const handleSearch = (query: string) => {
    setIsTransitioning(true)
    
    // Add a small delay to show the transition effect
    setTimeout(() => {
    const filtered = projects.filter(project =>
      project.title.toLowerCase().includes(query.toLowerCase()) ||
      project.description.toLowerCase().includes(query.toLowerCase()) ||
      project.tech_stack.some(tech => tech.toLowerCase().includes(query.toLowerCase()))
    )
    setFilteredProjects(filtered)
    setDisplayedProjects(filtered.slice(0, PROJECTS_PER_PAGE))
    setShowingAll(filtered.length <= PROJECTS_PER_PAGE)
      
      // End transition after content is updated
      setTimeout(() => {
        setIsTransitioning(false)
      }, 150)
    }, 200)
  }

  const handleFilterChange = (filters: string[]) => {
    setIsTransitioning(true)
    
    // Add delay for smooth animation
    setTimeout(() => {
    if (filters.length === 0) {
      setFilteredProjects(projects)
      setDisplayedProjects(projects.slice(0, PROJECTS_PER_PAGE))
      setShowingAll(projects.length <= PROJECTS_PER_PAGE)
    } else {
      const filtered = projects.filter(project =>
        filters.some(filter => {
          // Check tech stack
          const matchesTech = project.tech_stack.some(tech =>
            tech.toLowerCase().includes(filter.toLowerCase())
          )
          
          // Check project type/category (you can add a category field to projects if needed)
          const matchesCategory = project.title.toLowerCase().includes(filter.toLowerCase()) ||
                                 project.description.toLowerCase().includes(filter.toLowerCase())
          
          return matchesTech || matchesCategory
        })
      )
      setFilteredProjects(filtered)
      setDisplayedProjects(filtered.slice(0, PROJECTS_PER_PAGE))
      setShowingAll(filtered.length <= PROJECTS_PER_PAGE)
    }
      
      // End transition after content is updated
      setTimeout(() => {
        setIsTransitioning(false)
      }, 150)
    }, 200)
  }

  const handleProjectClick = (project: Project) => {
    navigate(`/projects/${project.id}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLoadMore = () => {
    const currentLength = displayedProjects.length
    const nextProjects = filteredProjects.slice(currentLength, currentLength + PROJECTS_PER_PAGE)
    setDisplayedProjects([...displayedProjects, ...nextProjects])
    setShowingAll(currentLength + nextProjects.length >= filteredProjects.length)
  }
  
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="text-center mb-8">
          <div className="animate-slide-up">
          <h1 className="text-2xl sm:text-5xl font-bold text-gray-900 mb-6">My Projects</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore my portfolio of web applications, from simple landing pages to complex full-stack solutions.
            Each project represents a unique challenge and learning experience.
          </p>
          </div>
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <ProjectSearch onSearch={handleSearch} onFilterChange={handleFilterChange} />
        </div>

        {displayedProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No projects found matching your criteria.</p>
          </div>
        ) : (
          <>
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-500 ease-in-out ${
              isTransitioning 
                ? 'opacity-0 transform translate-y-4 scale-95' 
                : 'opacity-100 transform translate-y-0 scale-100'
            }`} style={{ animationDelay: '0.4s' }}>
              {displayedProjects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onClick={() => handleProjectClick(project)}
                />
              ))}
            </div>
            
            {!showingAll && (
              <div className={`text-center mt-12 transition-all duration-500 ease-in-out ${
                isTransitioning 
                  ? 'opacity-0 transform translate-y-4' 
                  : 'opacity-100 transform translate-y-0'
              }`}>
                <button
                  onClick={handleLoadMore}
                  className="btn-primary inline-flex items-center"
                >
                  Load More Projects
                  <span className="ml-2 bg-white/20 text-white px-2 py-1 rounded-full text-sm">
                    {filteredProjects.length - displayedProjects.length} more
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Projects
