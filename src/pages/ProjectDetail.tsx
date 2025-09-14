import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Github, Calendar, Tag } from 'lucide-react'
import OptimizedImage from '../components/OptimizedImage'
import ScrollToTopAndBottomButtons from '../components/ScrollToTopAndBottomButtons'
import SEOHead from '../components/SEOHead'
import { db } from '../lib/supabase'
import type { Project } from '../types'

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const navigate = useNavigate()

  const handleNavigation = (path: string) => {
    navigate(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return
      
      setLoading(true)
      setError(false)
      
      try {
        const { data } = await db.getProjects()
        const foundProject = data?.find(p => p.id === id)
        
        if (foundProject) {
          setProject(foundProject)
        } else {
          setError(true)
        }
      } catch (err) {
        console.error('Error fetching project:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <p className="text-gray-600 mb-8">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/projects')}
            className="btn-primary flex items-center mx-auto"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Projects
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-7 bg-gray-50 animate-fade-in">
      <SEOHead
        title={`${project.title} - Web Development Project | ${project.tech_stack.slice(0, 3).join(', ')} | Nonce Firewall`}
        description={`${project.description} Built with ${project.tech_stack.join(', ')}. View live demo and source code for this professional web development project.`}
        keywords={`${project.tech_stack.join(', ')}, web development project, ${project.title}, react project, full-stack application, custom web development`}
        image={project.image_url}
        url={`/projects/${project.id}`}
        type="article"
        publishedTime={project.created_at}
      />
      <ScrollToTopAndBottomButtons />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-4 lg:px-8 pt-16 pb-12">


        {/* Project Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="relative h-78 sm:h-80 lg:h-96">
            <OptimizedImage
              src={project.image_url}
              alt={project.title}
              className="w-full h-full object-cover"
              width={1200}
              height={400}
              priority={true}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
            />
            {project.featured && (
              <div className="absolute top-4 right-4">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Featured
                </span>
              </div>
            )}
          </div>
          
          <div className="p-4">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              {project.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
              <div className="flex items-center space-x-2">
                <Calendar size={16} />
                <span>{formatDate(project.created_at)}</span>
              </div>
            </div>

            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              {project.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-4">
              {project.project_url && (
                <a
                  href={project.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 md:px-2 rounded-lg text-sm md:text-base font-medium transition-all duration-300 hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  <ExternalLink size={20} className="mr-2" />
                  Live Demo
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-gray-500 text-gray-800 px-2 py-1 md:px-2 rounded-lg text-sm md:text-base font-medium transition-all duration-300 hover:bg-gray-50 hover:shadow-md flex items-center justify-center space-x-2"
                >
                  <Github size={20} className="mr-2" />
                  View Code
                </a>
              )}
            </div>

            {/* Tech Stack */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Tag size={3} className="mr-2" />
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 md:px-3 bg-blue-100 text-blue-800 text-xs md:text-sm rounded-full font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Overview</h2>
              
              <div className="space-y-6">
                {project.challenge && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Challenge</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {project.challenge}
                    </p>
                  </div>
                )}
                
                {project.solution && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Solution</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {project.solution}
                    </p>
                  </div>
                )}
                
                {project.results && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Results</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {project.results}
                    </p>
                  </div>
                )}
                
                {!project.challenge && !project.solution && !project.results && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Project</h3>
                    <p className="text-gray-700 leading-relaxed">
                      This project showcases modern web development practices and innovative solutions. 
                      Each project is carefully crafted with attention to user experience, performance, and scalability.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Info</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Created</span>
                  <p className="text-gray-900">{formatDate(project.created_at)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Status</span>
                  <p className="text-gray-900">Completed</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Type</span>
                  <p className="text-gray-900">Web Application</p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-3">Interested in Similar Work?</h3>
              <p className="text-blue-100 mb-4 text-sm">
                Let's discuss how I can help bring your project ideas to life.
              </p>
              <button
                onClick={() => handleNavigation('/contact')}
                className="w-full bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300"
              >
                Get In Touch
              </button>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <button
            onClick={() => handleNavigation('/projects')}
            className="btn-primary py-2 px-2 flex items-center mx-auto"
          >
            <ArrowLeft size={20} className="mr-2" />
            View All Projects
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetail
