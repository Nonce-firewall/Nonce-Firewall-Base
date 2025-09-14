import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Calendar, Clock } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { db } from '../lib/supabase';
import type { BlogPost } from '../types';


const AdminBlogPosts: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image_url: '',
    published: false,
    meta_title: '',
    meta_description: '',
    tags: '',
    category: 'Tech'
  })

  const categories = [
    'Tech', 'Religion', 'News', 'Blockchain', 'Politics',
    'Lifestyle', 'Tutorial', 'Opinion', 'Review'
  ]

  const quillRef = useRef<ReactQuill>(null);

  // Memoize the helper function so it's not recreated on every render
  const getYouTubeVideoId = useCallback((url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }, []);

  // Memoize the video handler function
  const handleYouTubeVideo = useCallback(() => {
    const url = prompt('Enter YouTube URL:');
    if (url) {
      const videoId = getYouTubeVideoId(url);
      if (videoId) {
        const quill = quillRef.current?.getEditor();
        if (quill) {
          const range = quill.getSelection(true);
          quill.insertText(range.index, `\n[youtube]${videoId}[/youtube]\n`);
        }
      } else {
        alert('Invalid YouTube URL. Please enter a valid video link.');
      }
    }
  }, [getYouTubeVideoId]);

  // Table insertion handler
  const handleTableInsert = useCallback(() => {
    const rows = prompt('📊 Create Table\n\nEnter number of rows (including header row):\n\nExample: Enter "3" for 1 header + 2 data rows')
    const cols = prompt('📊 Create Table\n\nEnter number of columns/headers:\n\nExample: Enter "4" for 4 columns')
    
    if (rows && cols) {
      const numRows = parseInt(rows);
      const numCols = parseInt(cols);
      
      if (numRows > 0 && numCols > 0 && numRows <= 15 && numCols <= 8) {
        const quill = quillRef.current?.getEditor();
        if (quill) {
          const range = quill.getSelection(true);
          
          // Create table HTML with proper structure
          let tableHTML = '\n<table class="blog-table">\n';
          
          // Create header row
          tableHTML += '  <thead>\n    <tr>\n';
          for (let j = 0; j < numCols; j++) {
            tableHTML += `      <th>Header ${j + 1}</th>\n`;
          }
          tableHTML += '    </tr>\n  </thead>\n';
          
          // Create body rows
          tableHTML += '  <tbody>\n';
          for (let i = 1; i < numRows; i++) {
            tableHTML += '    <tr>\n';
            for (let j = 0; j < numCols; j++) {
              tableHTML += `      <td>Cell ${i},${j + 1}</td>\n`;
            }
            tableHTML += '    </tr>\n';
          }
          tableHTML += '  </tbody>\n</table>\n';
          
          // Wrap in table shortcode for proper processing
          const tableShortcode = `\n[table rows="${numRows}" cols="${numCols}"]${tableHTML}[/table]\n`
          
          // Insert the table shortcode
          quill.clipboard.dangerouslyPasteHTML(range.index, tableShortcode)
        }
      } else {
        alert('❌ Invalid Input\n\nPlease enter valid numbers:\n• Rows: 1-15 (including header)\n• Columns: 1-8\n\nExample: 3 rows, 4 columns creates a table with 1 header row and 2 data rows with 4 columns each.');
      }
    }
  }, []);
  // --- NEW --- Custom handler for the link button
  const handleLink = useCallback(() => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const range = quill.getSelection();
    if (range && range.length > 0) {
      // If text is selected, just ask for the URL
      const url = prompt('Enter the URL for the selected text:');
      if (url) {
        quill.format('link', url);
      }
    } else {
      // If no text is selected, ask for both text and URL
      const text = prompt('Enter the display text for the link:');
      if (text) {
        const url = prompt(`Enter the URL for "${text}":`);
        if (url) {
          const insertRange = quill.getSelection(true);
          quill.insertText(insertRange.index, text, 'link', url);
        }
      }
    }
  }, []);

  // Memoize the modules object itself
  const quillModules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['link', 'image', 'video', 'table'],
        ['blockquote', 'code-block'],
        ['clean']
      ],
      handlers: {
        'video': handleYouTubeVideo, 
        'link': handleLink, // --- NEW --- Register the custom link handler
        'table': handleTableInsert, // Custom table handler
      }
    }
  }), [handleYouTubeVideo, handleLink, handleTableInsert]); // --- NEW --- Add handleLink as a dependency

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'script', 'indent', 'direction',
    'color', 'background', 'align', 'link', 'image', 'video', 'table',
    'blockquote', 'code-block'
  ]

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    setLoading(true)
    const { data } = await db.getBlogPosts()
    if (data) setPosts(data)
    setLoading(false)
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    
    setFormData({
      ...formData,
      [name]: newValue,
      ...(name === 'title' && { slug: generateSlug(value) })
    })
  }

  const handleContentChange = (content: string) => {
    setFormData({
      ...formData,
      content: content
    })
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const postData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      published_at: formData.published ? new Date().toISOString() : null
    }

    try {
      if (editingPost) {
        const { error } = await db.updateBlogPost(editingPost.id, postData)
        if (error) throw error
      } else {
        const { error } = await db.createBlogPost(postData)
        if (error) throw error
      }
      
      setShowForm(false)
      setEditingPost(null)
      resetForm()
      fetchPosts()
    } catch (error) {
      console.error('Error saving blog post:', error)
      alert('Error saving blog post. Please try again.')
    }
  }

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content,
      featured_image_url: post.featured_image_url || '',
      published: post.published,
      meta_title: post.meta_title || '',
      meta_description: post.meta_description || '',
      tags: post.tags.join(', '),
      category: post.category || 'Technology'
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return
    
    try {
      const { error } = await db.deleteBlogPost(id)
      if (error) throw error
      
      fetchPosts()
    } catch (error) {
      console.error('Error deleting blog post:', error)
      alert('Error deleting blog post. Please try again.')
    }
  }

  const togglePublished = async (post: BlogPost) => {
    try {
      const { error } = await db.updateBlogPost(post.id, { 
        published: !post.published,
        published_at: !post.published ? new Date().toISOString() : null
      })
      if (error) throw error
      
      fetchPosts()
    } catch (error) {
      console.error('Error updating blog post:', error)
      alert('Error updating blog post. Please try again.')
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingPost(null)
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featured_image_url: '',
      published: false,
      meta_title: '',
      meta_description: '',
      tags: '',
      category: 'Tech'
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="p-2">
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-2xl font-bold text-gray-900">Blog Posts</h2>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary py-2 px-2 flex items-center"
          >
            <Plus size={20} className="mr-2" />
            New Post
          </button>
        </div>

        {showForm && (
          <div className="mb-2 p-2 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h3>
            
            <div className="mb-4">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="btn-secondary text-sm"
              >
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
            </div>

            <div className={`grid ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-6`}>
              <div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Slug *
                      </label>
                      <input
                        type="text"
                        name="slug"
                        required
                        value={formData.slug}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleSelectChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Excerpt
                    </label>
                    <textarea
                      name="excerpt"
                      rows={3}
                      value={formData.excerpt}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Brief description of the post..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content *
                    </label>
                    <React.Suspense fallback={
                      <div className="w-full h-80 bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                          <p className="text-gray-600 text-sm">Loading editor...</p>
                        </div>
                      </div>
                    }>
                      <ReactQuill
                        ref={quillRef}
                        theme="snow"
                        value={formData.content}
                        onChange={handleContentChange}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Write your blog post content here..."
                        style={{ height: '300px', marginBottom: '150px' }}
                      />
                    </React.Suspense>
                  </div>

                  <div>
                    <label className="block text-sm bg-white font-medium text-gray-700 mb-2">
                      Featured Image URL
                    </label>
                    <input
                      type="url"
                      name="featured_image_url"
                      value={formData.featured_image_url}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm bg-white font-medium text-gray-700 mb-2">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      placeholder="React, JavaScript, Web Development"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Title (SEO)
                      </label>
                      <input
                        type="text"
                        name="meta_title"
                        value={formData.meta_title}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Meta Description (SEO)
                      </label>
                      <input
                        type="text"
                        name="meta_description"
                        value={formData.meta_description}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="published"
                      name="published"
                      checked={formData.published}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                      Publish immediately
                    </label>
                  </div>

                  <div className="flex space-x-4">
                    <button type="submit" className="btn-primary">
                      {editingPost ? 'Update Post' : 'Create Post'}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="btn-secondary py-1 px-2"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>

              {showPreview && (
                <div className="border-l-4 border-blue-500 pl-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h4>
                  <div className="bg-white rounded-lg p-6 shadow-sm border max-h-[600px] overflow-y-auto">
                    {formData.title && (
                      <h1 className="text-2xl font-bold text-gray-900 mb-4">{formData.title}</h1>
                    )}
                    {formData.category && (
                      <div className="mb-4">
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                          {formData.category}
                        </span>
                      </div>
                    )}
                    {formData.excerpt && (
                      <p className="text-gray-600 italic mb-6">{formData.excerpt}</p>
                    )}
                    <div 
                      className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100"
                      dangerouslySetInnerHTML={{ __html: formData.content }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">{post.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      post.published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  
                  {post.excerpt && (
                    <p className="text-gray-600 mb-3">{post.excerpt}</p>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                      {post.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>{formatDate(post.created_at)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock size={14} />
                      <span>{post.reading_time} min read</span>
                    </div>
                  </div>
                  
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="text-gray-500 text-xs">+{post.tags.length - 3} more</span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => togglePublished(post)}
                    className={`p-1 rounded-full ${
                      post.published 
                        ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                        : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                    }`}
                    title={post.published ? 'Unpublish' : 'Publish'}
                  >
                    {post.published ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button
                    onClick={() => handleEdit(post)}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No blog posts created yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminBlogPosts
