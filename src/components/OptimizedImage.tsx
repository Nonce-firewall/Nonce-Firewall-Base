import React, { useState } from 'react'
import { getOptimizedImageUrl, createImagePlaceholder } from '../lib/imageOptimization'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  loading?: 'lazy' | 'eager'
  priority?: boolean
  quality?: number
  fallbackSrc?: string
  sizes?: string
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
  priority = false,
  quality = 85,
  fallbackSrc,
  sizes
}) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)

  const optimizedSrc = getOptimizedImageUrl(currentSrc, width, height, quality)
  const placeholderSrc = width && height ? createImagePlaceholder(width, height) : undefined

  const handleLoad = () => {
    setImageLoaded(true)
  }

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc)
      setImageError(false)
    } else {
      setImageError(true)
    }
  }

  if (imageError) {
    return (
      <div className={`bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="w-8 h-8 bg-gray-300 rounded-full mx-auto mb-2 flex items-center justify-center">
            <span className="text-gray-500 text-xs">?</span>
          </div>
          <span className="text-gray-500 text-xs">Image unavailable</span>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden">
      {!imageLoaded && placeholderSrc && (
        <img
          src={placeholderSrc}
          alt=""
          className={`absolute inset-0 ${className} animate-pulse`}
          aria-hidden="true"
        />
      )}
      <img
        src={optimizedSrc}
        alt={alt}
        className={`${className} ${!imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500 ease-in-out`}
        loading={priority ? 'eager' : loading}
        onLoad={handleLoad}
        onError={handleError}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        {...(width && { width })}
        {...(height && { height })}
        {...(sizes && { sizes })}
      />
    </div>
  )
}

export default OptimizedImage