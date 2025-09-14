import React, { useState, useEffect } from 'react'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'
import OptimizedImage from './OptimizedImage'

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  priority?: boolean
  quality?: number
  fallbackSrc?: string
  sizes?: string
  placeholder?: boolean
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  quality = 85,
  fallbackSrc,
  sizes,
  placeholder = true
}) => {
  const [shouldLoad, setShouldLoad] = useState(priority)
  const { isIntersecting, elementRef } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
    triggerOnce: true
  })

  useEffect(() => {
    if (isIntersecting && !shouldLoad) {
      setShouldLoad(true)
    }
  }, [isIntersecting, shouldLoad])

  if (!shouldLoad && placeholder) {
    return (
      <div 
        ref={elementRef as React.RefObject<HTMLDivElement>}
        className={`bg-gray-200 animate-pulse ${className}`}
        style={{ width, height }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-gray-400 text-xs">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div ref={elementRef as React.RefObject<HTMLDivElement>}>
      {shouldLoad && (
        <OptimizedImage
          src={src}
          alt={alt}
          className={className}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          priority={priority}
          quality={quality}
          fallbackSrc={fallbackSrc}
          sizes={sizes}
        />
      )}
    </div>
  )
}

export default LazyImage