// Performance monitoring and optimization utilities
import { preloadCriticalRoutes } from './pwa'

// Preload critical resources
export const preloadCriticalResources = () => {
  // Preload critical fonts
  const fontLink = document.createElement('link')
  fontLink.rel = 'preload'
  fontLink.as = 'font'
  fontLink.type = 'font/woff2'
  fontLink.crossOrigin = 'anonymous'
  fontLink.href = 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2'
  document.head.appendChild(fontLink)

  // Preload logo
  const logoLink = document.createElement('link')
  logoLink.rel = 'preload'
  logoLink.as = 'image'
  logoLink.href = '/logo.png'
  document.head.appendChild(logoLink)
  
  // Preload critical routes for PWA
  setTimeout(() => {
    preloadCriticalRoutes()
  }, 1500)
  
  // Preload admin routes if user might be admin
  setTimeout(() => {
    if (localStorage.getItem('supabase.auth.token')) {
      import('./pwa').then(({ preloadAdminRoutes }) => {
        preloadAdminRoutes()
      })
    }
  }, 3000)
}

export const measurePerformance = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    // Measure Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime)
        }
        if (entry.entryType === 'first-input') {
          console.log('FID:', (entry as any).processingStart - entry.startTime)
        }
        if (entry.entryType === 'layout-shift') {
          if (!(entry as any).hadRecentInput) {
            console.log('CLS:', (entry as any).value)
          }
        }
      }
    })

    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })
  }
}

export const preloadRoute = (routePath: string) => {
  // Preload route components for faster navigation
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = routePath
  document.head.appendChild(link)
}

// Optimize images for better LCP
export const optimizeImageLoading = () => {
  // Add loading="eager" to above-the-fold images
  const heroImages = document.querySelectorAll('img[data-hero="true"]')
  heroImages.forEach(img => {
    img.setAttribute('loading', 'eager')
    img.setAttribute('fetchpriority', 'high')
  })

  // Add loading="lazy" to below-the-fold images
  const lazyImages = document.querySelectorAll('img:not([data-hero="true"])')
  lazyImages.forEach(img => {
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy')
    }
  })
}

export const optimizeScrolling = () => {
  // Add passive event listeners for better scroll performance
  let ticking = false

  const updateScrollPosition = () => {
    // Update scroll-dependent UI elements
    ticking = false
  }

  const requestTick = () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollPosition)
      ticking = true
    }
  }

  window.addEventListener('scroll', requestTick, { passive: true })
}

// Intersection Observer for lazy loading and animations
export const createIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  }

  return new IntersectionObserver(callback, defaultOptions)
}