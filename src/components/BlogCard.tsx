import React from 'react'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import OptimizedImage from './OptimizedImage'
import type { BlogPost } from '../types'

interface BlogCardProps {
  post: BlogPost
  onClick?: () => void
}

const BlogCard: React.FC<BlogCardProps> = ({ post, onClick }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <article className="bg-white rounded-xl shadow-lg overflow-hidden card-hover cursor-pointer" onClick={onClick}>
      {post.featured_image_url && (
        <div className="relative h-48 overflow-hidden">
          <OptimizedImage
            src={post.featured_image_url}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            width={400}
            height={192}
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
            {post.category}
          </span>
          <div className="flex items-center space-x-1">
            <Calendar size={14} />
            <span>{formatDate(post.published_at || post.created_at)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock size={14} />
            <span>{post.reading_time} min read</span>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">{post.title}</h3>
        
        {post.excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
        )}
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-gray-500 text-xs">+{post.tags.length - 3} more</span>
            )}
          </div>
        )}
        
        <div className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300">
          <span>Read More</span>
          <ArrowRight size={16} className="ml-2" />
        </div>
      </div>
    </article>
  )
}

export default BlogCard