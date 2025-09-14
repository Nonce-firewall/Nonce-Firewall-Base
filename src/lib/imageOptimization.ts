// Image optimization utilities
export const getOptimizedImageUrl = (url: string, width?: number, height?: number, quality: number = 85): string => {
  // If it's a Pexels URL, add optimization parameters
  if (url.includes('pexels.com')) {
    const baseUrl = url.split('?')[0]
    const params = new URLSearchParams()
    
    if (width) params.set('w', width.toString())
    if (height) params.set('h', height.toString())
    params.set('auto', 'compress')
    params.set('cs', 'tinysrgb')
    params.set('fit', 'crop')
    params.set('fm', 'webp') // Force WebP format for better compression
    
    return `${baseUrl}?${params.toString()}`
  }
  
  // Supabase Storage public URL optimization
  if (url.includes('/storage/v1/object/public/') || url.includes('supabase.co')) {
    const [baseUrl, existingQueryString] = url.split('?')
    const params = new URLSearchParams(existingQueryString)
    
    // Add transformation parameters for Supabase image transformation
    if (width) params.set('width', width.toString())
    if (height) params.set('height', height.toString())
    params.set('quality', quality.toString())
    params.set('format', 'webp') // Force WebP for better compression
    params.set('resize', 'cover') // Cover the exact dimensions
    
    const newQueryString = params.toString()
    return newQueryString ? `${baseUrl}?${newQueryString}` : baseUrl
  }
  
  // For other URLs, return as-is (could be extended for other CDNs)
  return url
}

export const preloadCriticalImages = (imageUrls: string[]) => {
  imageUrls.forEach(url => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = url
    document.head.appendChild(link)
  })
}

export const createImagePlaceholder = (width: number, height: number): string => {
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial, sans-serif" font-size="14">Loading...</text>
    </svg>
  `)}`
}