import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Search } from 'lucide-react'
import BlogCard from '../components/BlogCard'
import NewsletterSignup from '../components/NewsletterSignup'
import ScrollToTopAndBottomButtons from '../components/ScrollToTopAndBottomButtons'
import SEOHead from '../components/SEOHead'
import { db } from '../lib/supabase'
import type { BlogPost } from '../types'

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [displayedPosts, setDisplayedPosts] = useState<BlogPost[]>([])
  const [hasMorePosts, setHasMorePosts] = useState(true)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showTagModal, setShowTagModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const navigate = useNavigate()

  const POSTS_PER_PAGE = 5

  const categories = [
    'Tech',
    'Religion',
    'News', 
    'Blockchain',
    'Politics',
    'Lifestyle',
    'Tutorial',
    'Opinion',
    'Review'
  ]
  const fetchPosts = async () => {
    setLoading(true)
    const { data } = await db.getBlogPosts(true, POSTS_PER_PAGE, 0) // Only published posts
    if (data) {
      setPosts(data)
      setFilteredPosts(data)
      setDisplayedPosts(data)
      setHasMorePosts(data.length === POSTS_PER_PAGE)
    }
    setLoading(false)
  }

  const loadMorePosts = async () => {
    if (loadingMore || !hasMorePosts) return
    
    setLoadingMore(true)
    const { data } = await db.getBlogPosts(true, POSTS_PER_PAGE, displayedPosts.length)
    
    if (data && data.length > 0) {
      const newPosts = [...posts, ...data]
      setPosts(newPosts)
      
      // Apply current filters to new posts
      let newFilteredPosts = newPosts
      if (searchQuery || selectedTag || selectedCategory) {
        newFilteredPosts = applyFilters(newPosts, searchQuery, selectedTag, selectedCategory)
      }
      
      setFilteredPosts(newFilteredPosts)
      setDisplayedPosts(newFilteredPosts.slice(0, displayedPosts.length + data.length))
      setHasMorePosts(data.length === POSTS_PER_PAGE)
    } else {
      setHasMorePosts(false)
    }
    
    setLoadingMore(false)
  }

  const applyFilters = (postsToFilter: BlogPost[], search: string, tag: string, category: string) => {
    let filtered = postsToFilter

    if (search) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(search.toLowerCase()) ||
        post.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
      )
    }

    if (tag) {
      filtered = filtered.filter(post =>
        post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
      )
    }

    if (category) {
      filtered = filtered.filter(post =>
        post.category && post.category.toLowerCase() === category.toLowerCase()
      )
    }

    return filtered
  }

  useEffect(() => {
    fetchPosts()
        
    // Subscribe to real-time changes
    const setupSubscriptions = async () => {
      const { subscribeToTable } = await import('../lib/supabase')
      
      subscribeToTable('blog_posts', () => {
        fetchPosts()
      })
    }
    
    setupSubscriptions()
    
    return () => {
      const cleanup = async () => {
        const { unsubscribeFromTable } = await import('../lib/supabase')
        unsubscribeFromTable('blog_posts')
      }
      cleanup()
    }
  }, [])

  // Filter posts based on search and tag
  useEffect(() => {
    const filtered = applyFilters(posts, searchQuery, selectedTag, selectedCategory)
    setFilteredPosts(filtered)
    setDisplayedPosts(filtered.slice(0, POSTS_PER_PAGE))
    setHasMorePosts(filtered.length > POSTS_PER_PAGE)
  }, [posts, searchQuery, selectedTag, selectedCategory])

  // Get all unique tags
  const allTags = Array.from(
    new Set(posts.flatMap(post => post.tags))
  ).sort()

  const handlePostClick = (post: BlogPost) => {
    navigate(`/blog/${post.slug}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-8 bg-gray-50 animate-fade-in">
      <SEOHead
        title="Blog - Web Development Insights & Tutorials | Nonce Firewall"
        description="Read the latest articles about web development, React, Next.js, Node.js, and modern technologies. Tips, tutorials, and insights from a full-stack developer with 5+ years experience."
        keywords="web development blog, react tutorials, javascript tips, full-stack development, programming articles, next.js tutorials, node.js guides, typescript tips, web development best practices"
        url="/blog"
      />
      <ScrollToTopAndBottomButtons />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="animate-slide-up">
            <h1 className="text-2xl sm:text-5xl font-bold text-gray-900 mb-6">Feeds Xp</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Insights, tutorials, and thoughts on web development, technology, and the craft of building digital experiences.
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6 mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex flex-col gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <button
                onClick={() => setShowTagModal(true)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg text-left text-sm sm:text-base text-gray-700 hover:bg-gray-100 transition-all duration-300 flex items-center justify-between"
              >
                <span className="truncate">{selectedTag || 'All Topics'}</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <button
                onClick={() => setShowCategoryModal(true)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border border-gray-300 rounded-lg text-left text-sm sm:text-base text-gray-700 hover:bg-gray-100 transition-all duration-300 flex items-center justify-between"
              >
                <span className="truncate">{selectedCategory || 'All Categories'}</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
          
          {(searchQuery || selectedTag || selectedCategory) && (
            <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <p className="text-gray-600 text-sm sm:text-base">
                {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedTag('')
                  setSelectedCategory('')
                }}
                className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium transition-colors duration-300 self-start sm:self-auto"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Tag Selection Modal */}
        {showTagModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm transform transition-all duration-300 ease-out animate-modal-scale-in">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Select Topic</h3>
                  <button
                    onClick={() => setShowTagModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="max-h-60 overflow-y-auto space-y-1">
                  <button
                    onClick={() => {
                      setSelectedTag('')
                      setShowTagModal(false)
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                      !selectedTag ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    All Topics
                  </button>
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setSelectedTag(tag)
                        setShowTagModal(false)
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                        selectedTag === tag ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Selection Modal */}
        {showCategoryModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm transform transition-all duration-300 ease-out animate-modal-scale-in">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Select Category</h3>
                  <button
                    onClick={() => setShowCategoryModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="max-h-60 overflow-y-auto space-y-1">
                  <button
                    onClick={() => {
                      setSelectedCategory('')
                      setShowCategoryModal(false)
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                      !selectedCategory ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category)
                        setShowCategoryModal(false)
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                        selectedCategory === category ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Posts */}
        {displayedPosts.length === 0 ? (
          <div className="text-center py-12">
            {posts.length === 0 ? (
              <div>
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Coming Soon</h2>
                <p className="text-gray-600 text-lg max-w-md mx-auto">
                  I'm working on some great content. Check back soon for the latest articles!
                </p>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Articles Found</h2>
                <p className="text-gray-600">
                  Try adjusting your search terms or clearing the filters.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {displayedPosts.map((post) => (
              <BlogCard
                key={post.id}
                post={post}
                onClick={() => handlePostClick(post)}
              />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {displayedPosts.length > 0 && hasMorePosts && displayedPosts.length < filteredPosts.length && (
          <div className="text-center mb-16">
            <button
              onClick={loadMorePosts}
              disabled={loadingMore}
              className="btn-primary py-2 px-2 flex items-center mx-auto disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
            >
              {loadingMore ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : null}
              {loadingMore ? 'Loading...' : 'Load More Posts'}
              {!loadingMore && filteredPosts.length - displayedPosts.length > 0 && (
                <span className="ml-2 bg-white/20 text-white px-2 py-1 rounded-full text-sm">
                  {filteredPosts.length - displayedPosts.length} more
                </span>
              )}
            </button>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="max-w-md mx-auto animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <NewsletterSignup />
        </div>
      </div>
    </div>
  )
}

export default Blog
