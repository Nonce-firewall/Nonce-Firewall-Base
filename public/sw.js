// Service Worker for PWA functionality
const CACHE_NAME = 'nonce-firewall-v1.1.0'
const STATIC_CACHE = 'static-v1.1.0'
const DYNAMIC_CACHE = 'dynamic-v1.1.0'

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.png',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png'
]

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /\/api\//,
  /supabase\.co/,
  /supabase\.in/,
  /fonts\.googleapis\.com/,
  /fonts\.gstatic\.com/,
  /pexels\.com/,
  /images\.pexels\.com/
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('Service Worker: Static assets cached')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('Service Worker: Error caching static assets', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker: Activated')
        return self.clients.claim()
      })
  )
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith('http')) {
    return
  }

  event.respondWith(
    handleFetch(request)
  )
})

async function handleFetch(request) {
  const url = new URL(request.url)
  
  try {
    // Strategy 1: Cache First for static assets
    if (STATIC_ASSETS.some(asset => url.pathname === asset) || 
        url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
      return await cacheFirst(request)
    }
    
    // Strategy 2: Network First for API calls
    if (API_CACHE_PATTERNS.some(pattern => pattern.test(url.href))) {
      return await networkFirst(request)
    }
    
    // Strategy 3: Stale While Revalidate for pages
    if (url.pathname.startsWith('/') && request.headers.get('accept')?.includes('text/html')) {
      return await staleWhileRevalidate(request)
    }
    
    // Default: Network First
    return await networkFirst(request)
    
  } catch (error) {
    console.error('Service Worker: Fetch error', error)
    
    // Return offline fallback for HTML requests
    if (request.headers.get('accept')?.includes('text/html')) {
      const cache = await caches.open(STATIC_CACHE)
      return await cache.match('/') || new Response('Offline', { status: 503 })
    }
    
    return new Response('Network error', { status: 503 })
  }
}

// Cache First Strategy
async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE)
  const cached = await cache.match(request)
  
  if (cached) {
    return cached
  }
  
  const response = await fetch(request)
  if (response.status === 200) {
    cache.put(request, response.clone())
  }
  
  return response
}

// Network First Strategy
async function networkFirst(request) {
  const cache = await caches.open(DYNAMIC_CACHE)
  
  try {
    const response = await fetch(request)
    if (response.status === 200) {
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    const cached = await cache.match(request)
    if (cached) {
      return cached
    }
    throw error
  }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE)
  const cached = await cache.match(request)
  
  const fetchPromise = fetch(request).then((response) => {
    if (response.status === 200) {
      cache.put(request, response.clone())
    }
    return response
  }).catch(() => cached)
  
  return cached || await fetchPromise
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync', event.tag)
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  // Handle offline actions when back online
  console.log('Service Worker: Performing background sync')
}

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    
    const options = {
      body: data.body,
      icon: '/android-chrome-192x192.png',
      badge: '/favicon-32x32.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      },
      actions: [
        {
          action: 'explore',
          title: 'View',
          icon: '/favicon-32x32.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/favicon-32x32.png'
        }
      ]
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})