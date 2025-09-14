import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Calendar, Clock, ArrowLeft, ArrowRight, Tag, Share2 } from 'lucide-react'
import { createRoot } from 'react-dom/client'
import OptimizedImage from '../components/OptimizedImage'
import ScrollToTopAndBottomButtons from '../components/ScrollToTopAndBottomButtons'
import NewsletterSignup from '../components/NewsletterSignup'
import BlogComments from '../components/BlogComments'
import SEOHead from '../components/SEOHead'
import YouTubeEmbed from '../components/YouTubeEmbed'
import CodeBlock from '../components/CodeBlock'
import TableRenderer from '../components/TableRenderer'
import { db } from '../lib/supabase'
import type { BlogPost } from '../types'

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [nextPost, setNextPost] = useState<BlogPostNavigation | null>(null)
  const [prevPost, setPrevPost] = useState<BlogPostNavigation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [processedContent, setProcessedContent] = useState('')
  const navigate = useNavigate()

  const handleNavigation = (path: string) => {
    navigate(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return
      
      setLoading(true)
      setError(false)
      
      try {
        const [postResult, allPostsResult] = await Promise.all([
          db.getBlogPostBySlug(slug),
          db.getAllBlogPostsForNavigation()
        ])
        
        if (postResult.error || !postResult.data) {
          setError(true)
        } else {
          setPost(postResult.data)
          setProcessedContent(processContent(postResult.data.content))
          
          // Find adjacent posts for navigation
          if (allPostsResult.data) {
            const currentIndex = allPostsResult.data.findIndex(p => p.slug === slug)
            if (currentIndex !== -1) {
              const prevIndex = currentIndex - 1
              const nextIndex = currentIndex + 1
              
              setPrevPost(prevIndex >= 0 ? allPostsResult.data[prevIndex] : null)
              setNextPost(nextIndex < allPostsResult.data.length ? allPostsResult.data[nextIndex] : null)
            }
          }
        }
      } catch (err) {
        console.error('Error fetching blog post:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  const processContent = (content: string): string => {
    // Process table blocks first
    const tableRegex = /\[table rows="(\d+)" cols="(\d+)"\]([\s\S]*?)\[\/table\]/g
    let processedContent = content.replace(tableRegex, (_, rows, cols, tableData) => {
      return `<div class="table-embed" data-rows="${rows}" data-cols="${cols}" data-content="${encodeURIComponent(tableData)}"></div>`
    })

    // Process YouTube embeds
    const youtubeRegex = /\[youtube\]([\w-]+)\[\/youtube\]/g
    processedContent = processedContent.replace(youtubeRegex, (_, videoId) => {
      return `<div class="youtube-embed" data-videoid="${videoId}"></div>`
    })

    // Process YouTube embeds with titles
    const youtubeTitleRegex = /\[youtube title="([^"]+)"\]([\w-]+)\[\/youtube\]/g
    processedContent = processedContent.replace(youtubeTitleRegex, (_, title, videoId) => {
      return `<div class="youtube-embed" data-videoid="${videoId}" data-title="${title}"></div>`
    })

    // Process code blocks with language
    const codeBlockRegex = /\[code language="([^"]+)"\]([\s\S]*?)\[\/code\]/g
    processedContent = processedContent.replace(codeBlockRegex, (_, language, code) => {
      // Properly escape HTML entities in code for safe storage in data attribute
      const escapedCode = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
      
      return `<div class="code-block-embed" data-language="${language}" data-code="${escapedCode}"></div>`
    })

    // Process code blocks without language (default to javascript)
    const simpleCodeBlockRegex = /\[code\]([\s\S]*?)\[\/code\]/g
    processedContent = processedContent.replace(simpleCodeBlockRegex, (_, code) => {
      // Properly escape HTML entities in code for safe storage in data attribute
      const escapedCode = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
      
      return `<div class="code-block-embed" data-language="javascript" data-code="${escapedCode}"></div>`
    })

    return processedContent
  }

  useEffect(() => {
    if (post && processedContent) {
      // Replace table embed placeholders with React components
      const tableElements = document.querySelectorAll('.table-embed')
      tableElements.forEach((element) => {
        const rows = element.getAttribute('data-rows')
        const cols = element.getAttribute('data-cols')
        const content = element.getAttribute('data-content')
        
        if (rows && cols && content) {
          const tableContainer = document.createElement('div')
          element.parentNode?.replaceChild(tableContainer, element)
          
          // Create table component
          const root = createRoot(tableContainer)
          root.render(React.createElement(TableRenderer, { 
            rows: parseInt(rows), 
            cols: parseInt(cols), 
            content: decodeURIComponent(content) 
          }))
        }
      })

      // Replace YouTube embed placeholders with React components
      const embedElements = document.querySelectorAll('.youtube-embed')
      embedElements.forEach((element) => {
        const videoId = element.getAttribute('data-videoid')
        const title = element.getAttribute('data-title') || 'YouTube Video'
        
        if (videoId) {
          const embedContainer = document.createElement('div')
          element.parentNode?.replaceChild(embedContainer, element)
          
          // Create YouTube embed component
          const root = createRoot(embedContainer)
          root.render(React.createElement(YouTubeEmbed, { videoId, title }))
        }
      })

      // Replace code block placeholders with React components
      const codeBlockElements = document.querySelectorAll('.code-block-embed')
      codeBlockElements.forEach((element) => {
        const language = element.getAttribute('data-language') || 'javascript'
        const code = element.getAttribute('data-code') || ''
        
        // Properly unescape HTML entities in correct order
        const unescapedCode = code
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&') // This must be last to avoid double-unescaping
        
        if (code) {
          const codeContainer = document.createElement('div')
          element.parentNode?.replaceChild(codeContainer, element)
          
          // Create CodeBlock component
          const root = createRoot(codeContainer)
          root.render(React.createElement(CodeBlock, { code: unescapedCode, language }))
        }
      })
    }
  }, [post, processedContent])
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleShare = async () => {
    const url = window.location.href
    const title = post?.title || 'Check out this article'
    
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url
        })
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(url)
        alert('Link copied to clipboard!')
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(url)
      alert('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-8">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/blog')}
            className="btn-primary flex items-center mx-auto"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Blogs
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-7 bg-gray-50 animate-fade-in">
      <SEOHead
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt || `Read ${post.title} - insights on web development and technology from Nonce Firewall, a professional full-stack developer.`}
        keywords={`${post.tags.join(', ')}, web development blog, programming tutorial, ${post.category?.toLowerCase()}, nonce firewall blog`}
        image={post.featured_image_url || undefined}
        url={`/blog/${post.slug}`}
        type="article"
        publishedTime={post.published_at || post.created_at}
        modifiedTime={post.updated_at || undefined}
        tags={post.tags}
        author="Nonce Firewall"
      />
      <ScrollToTopAndBottomButtons />
      
      <article className="mx-auto pt-10 pb-12 px-4 sm:px-6 lg:px-6">

        {/* Article Header */}
        <header className="mb-8 max-w-3xl mx-auto">
          <h1 className="text-1xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-3 text-gray-600 mb-4">
            <div className="flex items-center space-x-2">
              <Calendar size={14} />
              <span>{formatDate(post.published_at || post.created_at)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock size={14} />
              <span>{post.reading_time} min read</span>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-300"
              aria-label="Share this post"
            >
              <Share2 size={14} />
              <span>Share</span>
            </button>
          </div>

          {post.category && (
            <div className="mb-6">
              <span className="inline-flex px-2 py-1 text-blue-800 text-sm rounded-full font-medium">
                <Tag size={12} className="mr-1" />
                {post.category}
              </span>
            </div>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {post.featured_image_url && (
            <div className="relative h-45 sm:h-80 lg:h-96 rounded-xl overflow-hidden mb-8">
              <OptimizedImage
                src={post.featured_image_url}
                alt={post.title}
                className="w-full h-full object-cover"
                width={1200}
                height={400}
                priority={true}
                sizes="(max-width: 768px) 100vw, 1200px"
              />
            </div>
          )}
        </header>

        {/* Article Content */}
        <div className="p-1 mb-6 max-w-3xl mx-auto">
          <div 
            className="prose prose-lg prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100"
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />
        </div>

        {/* Newsletter Signup */}
        <div className="max-w-md mx-auto mb-12 max-w-3xl">
          <NewsletterSignup />
        </div>

        {/* Comments Section */}
        <div className="max-w-3xl mx-auto mb-12">
          <BlogComments postId={post.id} />
        </div>

        {/* Navigation */}
        <div className="text-center max-w-3xl mx-auto">
          {/* Previous/Next Post Navigation */}
          {(prevPost || nextPost) && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
              <div className="w-full sm:w-auto">
                {prevPost ? (
                  <button
                    onClick={() => handleNavigation(`/blog/${prevPost.slug}`)}
                    className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center sm:justify-start"
                  >
                    <ArrowLeft size={20} className="mr-2" />
                    <div className="text-left">
                      <div className="text-xs text-gray-500">Previous</div>
                      <div className="text-sm font-medium truncate max-w-48">{prevPost.title}</div>
                    </div>
                  </button>
                ) : (
                  <div className="w-full sm:w-auto"></div>
                )}
              </div>
              
              <div className="w-full sm:w-auto">
                {nextPost ? (
                  <button
                    onClick={() => handleNavigation(`/blog/${nextPost.slug}`)}
                    className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center sm:justify-end"
                  >
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Next</div>
                      <div className="text-sm font-medium truncate max-w-48">{nextPost.title}</div>
                    </div>
                    <ArrowRight size={20} className="ml-2" />
                  </button>
                ) : (
                  <div className="w-full sm:w-auto"></div>
                )}
              </div>
            </div>
          )}
          
          <button
            onClick={() => handleNavigation('/blog')}
            className="btn-primary py-2 px-2 flex items-center mx-auto"
          >
            <ArrowLeft size={20} className="mr-2" />
            More Articles
          </button>
        </div>
      </article>
    </div>
  )
}

export interface BlogPostNavigation {
  title: string;
  slug: string;
}

export default BlogPostPage
