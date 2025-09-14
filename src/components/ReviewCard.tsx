import React from 'react'
import { Star } from 'lucide-react'
import type { Review, Project } from '../types'

interface ReviewCardProps {
  review: Review
  project?: Project
  variant?: 'full' | 'preview'
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, project, variant = 'full' }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-gradient-to-br from-blue-500 to-blue-600',
      'bg-gradient-to-br from-green-500 to-green-600',
      'bg-gradient-to-br from-purple-500 to-purple-600',
      'bg-gradient-to-br from-pink-500 to-pink-600',
      'bg-gradient-to-br from-indigo-500 to-indigo-600',
      'bg-gradient-to-br from-yellow-500 to-yellow-600',
      'bg-gradient-to-br from-red-500 to-red-600',
      'bg-gradient-to-br from-teal-500 to-teal-600',
      'bg-gradient-to-br from-orange-500 to-orange-600',
      'bg-gradient-to-br from-cyan-500 to-cyan-600'
    ]
    const index = name.length % colors.length
    return colors[index]
  }

  const getCardAccentColor = (name: string) => {
    const colors = [
      'border-l-blue-500 bg-blue-50',
      'border-l-green-500 bg-green-50',
      'border-l-purple-500 bg-purple-50',
      'border-l-pink-500 bg-pink-50',
      'border-l-indigo-500 bg-indigo-50',
      'border-l-yellow-500 bg-yellow-50',
      'border-l-red-500 bg-red-50',
      'border-l-teal-500 bg-teal-50',
      'border-l-orange-500 bg-orange-50',
      'border-l-cyan-500 bg-cyan-50'
    ]
    const index = name.length % colors.length
    return colors[index]
  }

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  }

  const reviewText = variant === 'preview' ? truncateText(review.review_text) : review.review_text
  
  const cardClasses = variant === 'preview' 
    ? `bg-white rounded-xl shadow-lg p-4 sm:p-6 card-hover border-l-4 ${getCardAccentColor(review.client_name)} relative overflow-hidden`
    : `bg-white rounded-xl shadow-lg p-3 sm:p-6 card-hover border-l-4 ${getCardAccentColor(review.client_name)} relative overflow-hidden`

  return (
    <article className={cardClasses}>
      {/* Decorative background pattern */}
      <div className="absolute top-0 right-0 w-16 sm:w-32 h-16 sm:h-32 opacity-5">
        <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 rounded-full transform rotate-45 translate-x-16 -translate-y-16"></div>
      </div>
      
      <div className="relative z-10">
        {/* New horizontal layout with avatar on left */}
        <div className="flex items-start space-x-3">
          {/* Avatar - Fixed to left side */}
          <div className={`flex-shrink-0 ${variant === 'preview' ? 'w-8 h-8 sm:w-10 sm:h-10' : 'w-10 h-10 sm:w-12 sm:h-12'}`}>
            {review.avatar_url ? (
              <img
                src={review.avatar_url}
                alt={`${review.client_name}'s avatar`}
                className={variant === 'preview' 
                  ? "w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-full border-2 border-white shadow-md"
                  : "w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-full border-2 sm:border-3 border-white shadow-lg"
                }
              />
            ) : (
              <div className={`rounded-full flex items-center justify-center text-white font-bold shadow-lg ${getAvatarColor(review.client_name)} ${
                variant === 'preview' 
                  ? 'w-8 h-8 sm:w-10 sm:h-10' 
                  : 'w-10 h-10 sm:w-12 sm:h-12'
              }`}>
                <span className={variant === 'preview' ? "text-xs sm:text-sm" : "text-sm sm:text-base"}>
                  {getInitials(review.client_name)}
                </span>
              </div>
            )}
          </div>
          
          {/* Content area - Takes remaining space */}
          <div className="flex-1 min-w-0">
            {/* Header with name, company and rating in one line */}
            <div className={`flex flex-col space-y-1 ${variant === 'preview' ? 'mb-2' : 'mb-3'}`}>
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-gray-900 leading-tight truncate ${variant === 'preview' ? 'text-sm sm:text-base' : 'text-base sm:text-lg'}`}>
                    {review.client_name}
                  </p>
                  {review.client_company && (
                    <p className={`text-gray-600 font-medium truncate ${variant === 'preview' ? 'text-xs sm:text-sm' : 'text-sm'}`}>
                      {review.client_company}
                    </p>
                  )}
                </div>
                
                {/* Rating - Compact on the right */}
                <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                  <div className={`flex ${variant === 'preview' ? 'space-x-0.5' : 'space-x-1'}`}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={variant === 'preview' ? 10 : 12}
                        className={i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <span className={`font-semibold text-gray-700 ${variant === 'preview' ? 'text-xs' : 'text-xs'}`} aria-label={`Rating: ${review.rating} out of 5 stars`}>
                    {review.rating}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Review text - More space now */}
            <p className={`text-gray-700 italic leading-relaxed ${
              variant === 'preview' 
                ? 'mb-2 text-xs sm:text-sm' 
                : 'mb-3 text-sm sm:text-base'
            }`}>
              "{reviewText}"
            </p>
          
            {/* Project info - Compact at bottom */}
            {project && (
              <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 rounded-md border border-blue-100 ${variant === 'preview' ? 'p-1.5 sm:p-2' : 'p-2 sm:p-3'}`}>
                <p className={`text-blue-800 font-medium ${variant === 'preview' ? 'text-xs' : 'text-xs sm:text-sm'}`}>
                  <span className="font-semibold">Project:</span> <span className="font-medium">{project.title}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export default ReviewCard