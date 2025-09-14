import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ExternalLink, Package } from 'lucide-react'
import ScrollToTopAndBottomButtons from '../components/ScrollToTopAndBottomButtons'
import { db } from '../lib/supabase'
import type { Product } from '../types'

interface ProductsProps {
}

const Products: React.FC<ProductsProps> = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const handleNavigation = (path: string) => {
    navigate(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Set page title for SEO
  useEffect(() => {
    document.title = 'Developer Tools & Products | Web Development Resources | Nonce Firewall'
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover developer tools, resources, and products I\'ve created to help developers and businesses succeed with modern web technologies. Free and premium tools for React, Next.js, Node.js development and best practices.')
    }
    
    // Add structured data for products page
    const existingScript = document.querySelector('script[data-seo="products"]')
    if (!existingScript) {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-seo', 'products')
      script.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Developer Tools & Products",
        "description": "Collection of developer tools and products for modern web development",
        "url": "https://noncefirewall.dev/products",
        "author": {
          "@type": "Person",
          "name": "Nonce Firewall"
        },
        "mainEntity": {
          "@type": "ItemList",
          "name": "Developer Products",
          "description": "Tools and resources for web developers"
        }
      })
      document.head.appendChild(script)
    }
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    const { data } = await db.getProducts()
    if (data) setProducts(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
    
    // Subscribe to real-time changes
    const setupSubscriptions = async () => {
      const { subscribeToTable } = await import('../lib/supabase')
      
      subscribeToTable('products', () => {
        fetchProducts()
      })
    }
    
    setupSubscriptions()
    
    return () => {
      const cleanup = async () => {
        const { unsubscribeFromTable } = await import('../lib/supabase')
        unsubscribeFromTable('products')
      }
      cleanup()
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-7 bg-gray-50 animate-fade-in">
      <ScrollToTopAndBottomButtons />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <div className="animate-slide-up">
          <h1 className="text-2xl sm:text-5xl font-bold text-gray-900 mb-6">Products & Tools</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover the tools, resources, and products My team have created to help developers and businesses succeed online.
          </p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Coming Soon</h2>
            <p className="text-gray-600 text-lg max-w-md mx-auto">
              We're working on some exciting products and tools. Check back soon for updates!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden card-hover">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{product.title}</h3>
                  
                  {product.description && (
                    <p className="text-gray-600 mb-6 line-clamp-3">{product.description}</p>
                  )}
                  
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300"
                  >
                    Visit Product
                    <ExternalLink size={16} className="ml-2" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-1xl font-bold text-gray-900 mb-4">Have an Idea for a Product?</h2>
            <p className="text-gray-600 mb-6">
              We're always interested in collaborating on new products and tools that can help the developer community.
            </p>
            <button
              onClick={() => handleNavigation('/contact')}
              className="btn-primary py-2 px-2"
            >
              Let's Discuss
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products
