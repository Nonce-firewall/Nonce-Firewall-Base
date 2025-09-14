import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Search, X } from 'lucide-react'

interface ProjectSearchProps {
  onSearch: (query: string) => void
  onFilterChange: (filters: string[]) => void
}

const ProjectSearch: React.FC<ProjectSearchProps> = ({ onSearch, onFilterChange }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [showTechModal, setShowTechModal] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const techFilters = [
    'React', 'Vue.js', 'Angular', 'Node.js', 'Express', 'MongoDB', 
    'PostgreSQL', 'TypeScript', 'JavaScript', 'Python', 'Django', 
    'Flask', 'Next.js', 'Nuxt.js', 'Tailwind CSS', 'Bootstrap',
    'Firebase', 'Supabase', 'GraphQL', 'REST API', 'Docker',
    'AWS', 'Vercel', 'Netlify', 'Git', 'GitHub'
  ]

  // Only close when clicking outside the container if the modal is not open.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showTechModal) return
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowTechModal(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showTechModal])

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (showTechModal) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [showTechModal])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch(query)
  }

  const handleTechFilterToggle = (filter: string) => {
    const newFilters = selectedFilters.includes(filter)
      ? selectedFilters.filter(f => f !== filter)
      : [...selectedFilters, filter]
    
    setSelectedFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearAllFilters = () => {
    setSelectedFilters([])
    setSearchQuery('')
    onSearch('')
    onFilterChange([])
  }

  const hasActiveFilters = searchQuery || selectedFilters.length > 0

  return (
    <div ref={dropdownRef} className="bg-white rounded-xl shadow-lg p-3 sm:p-6 mb-8">
      <div className="flex flex-col gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
          />
        </div>
        
        <div className="w-full">
          <button
            onClick={() => setShowTechModal(true)}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg text-left text-sm sm:text-base text-gray-700 hover:bg-gray-100 transition-all duration-300 flex items-center justify-between"
          >
            <span className="truncate">
              {selectedFilters.length > 0 
                ? `${selectedFilters.length} Tech${selectedFilters.length !== 1 ? 's' : ''} Selected`
                : 'All Technologies'
              }
            </span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
      
      {hasActiveFilters && (
        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {selectedFilters.map((filter) => (
              <span
                key={filter}
                className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
              >
                {filter}
                <button
                  onClick={() => handleTechFilterToggle(filter)}
                  className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors duration-200"
                >
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
          <button
            onClick={clearAllFilters}
            className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium transition-colors duration-300 self-start sm:self-auto"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Technology Selection Modal via portal */}
      {showTechModal && createPortal(
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[999] p-4"
          onClick={() => setShowTechModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] transform transition-all duration-300 ease-out animate-modal-scale-in"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Select Technologies"
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Select Technologies</h3>
                <button
                  onClick={() => setShowTechModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Selected: {selectedFilters.length} technolog{selectedFilters.length !== 1 ? 'ies' : 'y'}
                </p>
                {selectedFilters.length > 0 && (
                  <button
                    onClick={() => {
                      setSelectedFilters([])
                      onFilterChange([])
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear all technologies
                  </button>
                )}
              </div>
              
              <div className="max-h-60 overflow-y-auto space-y-1">
                {techFilters.map((tech) => (
                  <button
                    key={tech}
                    onClick={() => handleTechFilterToggle(tech)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 text-sm flex items-center justify-between ${
                      selectedFilters.includes(tech)
                        ? 'bg-blue-100 text-blue-700 font-medium' 
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span>{tech}</span>
                    {selectedFilters.includes(tech) && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowTechModal(false)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  Apply Filters ({selectedFilters.length})
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

export default ProjectSearch
