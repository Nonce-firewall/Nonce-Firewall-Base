import React from 'react'
import { ExternalLink, Github } from 'lucide-react'
import OptimizedImage from './OptimizedImage'
import type { Project } from '../types'

interface ProjectCardProps {
  project: Project
  onClick?: () => void
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <article className="bg-white rounded-xl shadow-lg overflow-hidden card-hover cursor-pointer" onClick={onClick}>
      <div className="relative h-48 overflow-hidden">
        <OptimizedImage
          src={project.image_url}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          width={400}
          height={192}
          loading="lazy"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {project.featured && (
          <div className="absolute top-3 right-3">
            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Featured
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
        <p className="text-sm md:text-base text-gray-600 mb-4 line-clamp-3">{project.description}</p>
        
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
        
        {/* Action Buttons */}
        <div className="flex space-x-3 mt-6">
  {project.project_url && (
    <a
      href={project.project_url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 md:px-2 rounded-lg text-sm md:text-base font-medium transition-all duration-300 hover:shadow-lg flex items-center justify-center space-x-2"
      onClick={(e) => e.stopPropagation()}
      aria-label={`View live demo of ${project.title}`}
    >
      <ExternalLink size={14} />
      <span>Live Demo</span>
    </a>
  )}
  {project.github_url && (
    <a
      href={project.github_url}
      target="_blank"
      rel="noopener noreferrer"
      className="border border-gray-500 text-gray-800 px-2 py-1 md:px-2 rounded-lg text-sm md:text-base font-medium transition-all duration-300 hover:bg-gray-50 hover:shadow-md flex items-center justify-center space-x-2"
      onClick={(e) => e.stopPropagation()}
      aria-label={`View source code for ${project.title} on GitHub`}
    >
      <Github size={14} />
      <span>Code</span>
    </a>
      )}
        </div>
      </div>
    </article>
  )
}

export default ProjectCard