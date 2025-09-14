import React, { useState, useEffect } from 'react'
import { MessageCircle, Reply, Send, User, Trash2, CheckCircle } from 'lucide-react'
import { db } from '../lib/supabase'
import type { BlogComment } from '../types'

interface BlogCommentsProps {
  postId: string
}

const BlogComments: React.FC<BlogCommentsProps> = ({ postId }) => {
  const [comments, setComments] = useState<BlogComment[]>([])
  const [commentCount, setCommentCount] = useState(0)
  const [repliesState, setRepliesState] = useState<{[key: string]: { replies: BlogComment[], hasMore: boolean, loading: boolean }}>({})
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMoreComments, setHasMoreComments] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [username, setUsername] = useState('')
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [browserId, setBrowserId] = useState('')

  const COMMENTS_PER_LOAD = 5
  const REPLIES_PER_LOAD = 3

  // Generate or get browser ID
  useEffect(() => {
    let id = localStorage.getItem('blog_browser_id')
    if (!id) {
      id = `browser_${Date.now()}_${Math.random().toString(36).substring(2)}`
      localStorage.setItem('blog_browser_id', id)
    }
    setBrowserId(id)
    
    // Check if user has a username
    checkExistingUsername(id)
  }, [])

  const checkExistingUsername = async (browserId: string) => {
    try {
      const { data } = await db.getUsernameByBrowser(browserId)
      if (data?.username) {
        setUsername(data.username)
      }
    } catch (error) {
      // No username found, which is fine
    }
  }

  const fetchComments = async (loadMore = false) => {
    if (loadMore) {
      setLoadingMore(true)
    } else {
      setLoading(true)
    }

    try {
      const offset = loadMore ? comments.length : 0
      const [commentsResult, countResult] = await Promise.all([
        db.getBlogComments(postId, COMMENTS_PER_LOAD, offset),
        db.getCommentCount(postId)
      ])

      if (commentsResult.data) {
        // Fetch initial replies for each comment (limited)
        const commentsWithReplies = await Promise.all(
          commentsResult.data.map(async (comment) => {
            const { data: replies } = await db.getBlogCommentReplies(comment.id)
            const limitedReplies = replies?.slice(0, REPLIES_PER_LOAD) || []
            const hasMoreReplies = (replies?.length || 0) > REPLIES_PER_LOAD
            
            // Update replies state for this comment
            setRepliesState(prev => ({
              ...prev,
              [comment.id]: {
                replies: limitedReplies,
                hasMore: hasMoreReplies,
                loading: false
              }
            }))
            
            return { ...comment, replies: limitedReplies }
          })
        )

        if (loadMore) {
          setComments(prev => [...prev, ...commentsWithReplies])
        } else {
          setComments(commentsWithReplies)
        }

        setHasMoreComments(commentsResult.data.length === COMMENTS_PER_LOAD)
      }

      if (countResult.count !== null) {
        setCommentCount(countResult.count)
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const loadMoreReplies = async (commentId: string) => {
    const currentState = repliesState[commentId]
    if (!currentState || currentState.loading) return

    setRepliesState(prev => ({
      ...prev,
      [commentId]: { ...currentState, loading: true }
    }))

    try {
      const { data: allReplies } = await db.getBlogCommentReplies(commentId)
      const currentRepliesCount = currentState.replies.length
      const newReplies = allReplies?.slice(currentRepliesCount, currentRepliesCount + REPLIES_PER_LOAD) || []
      const totalReplies = [...currentState.replies, ...newReplies]
      const hasMoreReplies = (allReplies?.length || 0) > totalReplies.length

      setRepliesState(prev => ({
        ...prev,
        [commentId]: {
          replies: totalReplies,
          hasMore: hasMoreReplies,
          loading: false
        }
      }))

      // Update the comment in the main comments array
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, replies: totalReplies }
          : comment
      ))
    } catch (error) {
      console.error('Error loading more replies:', error)
      setRepliesState(prev => ({
        ...prev,
        [commentId]: { ...currentState, loading: false }
      }))
    }
  }

  useEffect(() => {
    fetchComments()
    
    // Subscribe to real-time changes
    const setupSubscriptions = async () => {
      const { subscribeToTable } = await import('../lib/supabase')
      
      subscribeToTable('blog_comments', () => {
        fetchComments()
      })
    }
    
    setupSubscriptions()
    
    return () => {
      const cleanup = async () => {
        const { unsubscribeFromTable } = await import('../lib/supabase')
        unsubscribeFromTable('blog_comments')
      }
      cleanup()
    }
  }, [postId])

  const generateAvatar = (username: string) => {
    const colors = [
      'bg-gradient-to-br from-blue-500 to-blue-600',
      'bg-gradient-to-br from-green-500 to-green-600',
      'bg-gradient-to-br from-purple-500 to-purple-600',
      'bg-gradient-to-br from-pink-500 to-pink-600',
      'bg-gradient-to-br from-indigo-500 to-indigo-600',
      'bg-gradient-to-br from-yellow-500 to-yellow-600',
      'bg-gradient-to-br from-red-500 to-red-600',
      'bg-gradient-to-br from-teal-500 to-teal-600',
      'bg-gradient-to-br from-orange-500 to-orange-600',
      'bg-gradient-to-br from-cyan-500 to-cyan-600'
    ]
    const index = username.length % colors.length
    return colors[index]
  }

  const getInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase()
  }

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return

    try {
      // Check if username is available
      const { data: existingUser } = await db.checkUsername(username.trim())
      
      if (existingUser) {
        alert('Username already taken. Please choose another one.')
        return
      }

      // Create username
      const { error } = await db.createUsername(username.trim(), browserId)
      if (error) throw error

      setShowUsernamePrompt(false)
    } catch (error) {
      console.error('Error creating username:', error)
      alert('Error creating username. Please try again.')
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    if (!username) {
      setShowUsernamePrompt(true)
      return
    }

    setSubmitting(true)
    try {
      const { error } = await db.createBlogComment({
        post_id: postId,
        username: username,
        content: newComment.trim(),
        browser_id: browserId
      })

      if (error) throw error

      setNewComment('')
      showSuccess('Comment posted successfully! 🎉')
      fetchComments() // Refresh comments
    } catch (error) {
      console.error('Error submitting comment:', error)
      alert('Error submitting comment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReplySubmit = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault()
    if (!replyContent.trim()) return

    if (!username) {
      setShowUsernamePrompt(true)
      return
    }

    setSubmitting(true)
    try {
      const { error } = await db.createBlogComment({
        post_id: postId,
        parent_id: parentId,
        username: username,
        content: replyContent.trim(),
        browser_id: browserId
      })

      if (error) throw error

      setReplyContent('')
      setReplyingTo(null)
      showSuccess('Reply posted successfully! 💬')
      
      // Refresh the specific comment's replies instead of all comments
      const { data: updatedReplies } = await db.getBlogCommentReplies(parentId)
      if (updatedReplies) {
        const currentState = repliesState[parentId] || { replies: [], hasMore: false, loading: false }
        const limitedReplies = updatedReplies.slice(0, Math.max(REPLIES_PER_LOAD, currentState.replies.length + 1))
        const hasMoreReplies = updatedReplies.length > limitedReplies.length
        
        setRepliesState(prev => ({
          ...prev,
          [parentId]: {
            replies: limitedReplies,
            hasMore: hasMoreReplies,
            loading: false
          }
        }))
        
        // Update the comment in the main comments array
        setComments(prev => prev.map(comment => 
          comment.id === parentId 
            ? { ...comment, replies: limitedReplies }
            : comment
        ))
      }
    } catch (error) {
      console.error('Error submitting reply:', error)
      alert('Error submitting reply. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditComment = (comment: BlogComment) => {
    setEditingComment(comment.id)
    setEditContent(comment.content)
  }

  const handleUpdateComment = async (commentId: string) => {
    if (!editContent.trim()) return

    setSubmitting(true)
    try {
      const { error } = await db.updateBlogComment(commentId, {
        content: editContent.trim()
      })

      if (error) throw error

      setEditingComment(null)
      setEditContent('')
      showSuccess('Comment updated successfully! ✏️')
      fetchComments() // Refresh comments
    } catch (error) {
      console.error('Error updating comment:', error)
      alert('Error updating comment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const showSuccess = (message: string) => {
    setSuccessMessage(message)
    setShowSuccessModal(true)
    setTimeout(() => {
      setShowSuccessModal(false)
    }, 3000)
  }

  const handleDeleteClick = (commentId: string) => {
    setCommentToDelete(commentId)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!commentToDelete) return

    setSubmitting(true)
    try {
      const { error } = await db.deleteBlogComment(commentToDelete)

      if (error) throw error

      setShowDeleteModal(false)
      setCommentToDelete(null)
      showSuccess('Comment deleted successfully! 🗑️')
      fetchComments() // Refresh comments
    } catch (error) {
      console.error('Error deleting comment:', error)
      alert('Error deleting comment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const cancelEdit = () => {
    setEditingComment(null)
    setEditContent('')
  }

  const isOwnComment = (comment: BlogComment) => {
    return comment.browser_id === browserId
  }

  const loadMoreComments = () => {
    fetchComments(true)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60)
      return `${diffInMinutes}m ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-5 sm:h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-3 sm:h-4 bg-gray-200 rounded"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-xs sm:max-w-sm w-full mx-2 sm:mx-4 transform animate-scale-in">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 animate-bounce" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Success!</h3>
              <p className="text-gray-600 text-xs sm:text-sm">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-xs sm:max-w-sm w-full mx-2 sm:mx-4 transform animate-scale-in">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Trash2 className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 animate-pulse" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Delete Comment?</h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6">
                This action cannot be undone. Your comment will be permanently removed.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setCommentToDelete(null)
                  }}
                  className="flex-1 px-3 py-2 sm:px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={submitting}
                  className="flex-1 px-3 py-2 sm:px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-105 active:scale-95 text-sm sm:text-base"
                >
                  {submitting ? (
                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Username Prompt Modal */}
      {showUsernamePrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
          <div className="bg-white rounded-xl p-4 sm:p-6 max-w-sm sm:max-w-md w-full mx-2 transform animate-scale-in">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Choose Your Username</h3>
            <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
              This username will be used for all your comments across the blog.
            </p>
            <form onSubmit={handleUsernameSubmit}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                minLength={2}
                maxLength={20}
                pattern="[a-zA-Z0-9_]+"
                title="Username can only contain letters, numbers, and underscores"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3 sm:mb-4 text-sm sm:text-base"
              />
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm sm:text-base"
                >
                  Create Username
                </button>
                <button
                  type="button"
                  onClick={() => setShowUsernamePrompt(false)}
                  className="flex-1 border border-gray-300 text-gray-700 px-3 py-2 sm:px-4 rounded-lg font-medium hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Comments Header */}
      <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-6">
        <MessageCircle className="w-4 h-4 sm:w-6 sm:h-6 text-blue-500" />
        <h3 className="text-base sm:text-xl font-bold text-gray-900">
          Comments ({commentCount})
        </h3>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleCommentSubmit} className="mb-4 sm:mb-8 transform transition-all duration-300">
        <div className="flex items-start space-x-2 sm:space-x-3">
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm ${
            username ? generateAvatar(username) : 'bg-gray-400'
          }`}>
            {username ? getInitials(username) : <User size={12} className="sm:w-4 sm:h-4" />}
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={username ? "Share your thoughts..." : "Click to choose username and comment"}
              rows={2}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
              onClick={() => !username && setShowUsernamePrompt(true)}
            />
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2 sm:mt-3 gap-2 sm:gap-0">
              <span className="text-xs sm:text-sm text-gray-500 order-2 sm:order-1">
                {username ? `Commenting as ${username}` : 'Choose username to comment'}
              </span>
              <button
                type="submit"
                disabled={!newComment.trim() || !username || submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-4 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm sm:text-base order-1 sm:order-2 self-end transform hover:scale-105 active:scale-95"
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-1 sm:mr-2"></div>
                ) : (
                  <Send size={12} className="mr-1 sm:mr-2 sm:w-4 sm:h-4" />
                )}
                Comment
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-3 sm:space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="border-l-2 border-gray-100 pl-2 sm:pl-4">
            {/* Main Comment */}
            <div className="flex items-start space-x-2 sm:space-x-3">
              <div className={`w-6 h-6 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-base ${generateAvatar(comment.username)}`}>
                {getInitials(comment.username)}
              </div>
              <div className="flex-1">
                {editingComment === comment.id ? (
                  <div className="bg-blue-50 rounded-lg p-2 sm:p-3 border border-blue-200">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                      <span className="font-semibold text-gray-900 text-xs sm:text-sm">{comment.username}</span>
                      <span className="text-xs text-gray-500">{formatDate(comment.created_at)}</span>
                      <span className="text-xs text-blue-600 font-medium">Editing</span>
                    </div>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-xs sm:text-sm mb-2"
                      rows={2}
                    />
                    <div className="flex justify-end space-x-1 sm:space-x-2">
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="text-xs text-gray-600 hover:text-gray-800 px-2 py-1 rounded transition-all duration-300 transform hover:scale-105"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateComment(comment.id)}
                        disabled={!editContent.trim() || submitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                      >
                        {submitting ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                      <span className="font-semibold text-gray-900 text-xs sm:text-sm">{comment.username}</span>
                      <span className="text-xs text-gray-500">{formatDate(comment.created_at)}</span>
                    </div>
                    <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{comment.content}</p>
                  </div>
                )}
                
                <div className="flex items-center justify-between mt-1 sm:mt-2">
                  <button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    <Reply size={8} className="mr-1 sm:w-3 sm:h-3" />
                    Reply
                  </button>
                  
                  {isOwnComment(comment) && editingComment !== comment.id && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditComment(comment)}
                        className="text-xs text-gray-600 hover:text-blue-600 font-medium transition-all duration-300 transform hover:scale-105"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(comment.id)}
                        className="text-xs text-gray-600 hover:text-red-600 font-medium transition-all duration-300 transform hover:scale-105"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {/* Reply Form */}
                {replyingTo === comment.id && (
                  <form onSubmit={(e) => handleReplySubmit(e, comment.id)} className="mt-2 sm:mt-4">
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <div className={`w-5 h-5 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm ${
                        username ? generateAvatar(username) : 'bg-gray-400'
                      }`}>
                        {username ? getInitials(username) : <User size={10} className="sm:w-3 sm:h-3" />}
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder={username ? `Reply to ${comment.username}...` : "Choose username to reply"}
                          rows={1}
                          className="w-full px-2 py-2 sm:px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-xs sm:text-sm"
                          onClick={() => !username && setShowUsernamePrompt(true)}
                        />
                        <div className="flex justify-end space-x-1 sm:space-x-2 mt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setReplyingTo(null)
                              setReplyContent('')
                            }}
                            className="text-xs sm:text-sm text-gray-600 hover:text-gray-800 px-2 py-1 sm:px-3 rounded transition-all duration-300 transform hover:scale-105"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={!replyContent.trim() || !username || submitting}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 sm:px-3 rounded text-xs sm:text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transform hover:scale-105 active:scale-95"
                          >
                            {submitting ? (
                              <div className="animate-spin rounded-full h-2 w-2 sm:h-3 sm:w-3 border-b-2 border-white mr-1"></div>
                            ) : (
                              <Send size={8} className="mr-1 sm:w-3 sm:h-3" />
                            )}
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                )}

                {/* Replies */}
                {repliesState[comment.id]?.replies && repliesState[comment.id].replies.length > 0 && (
                  <div className="mt-2 sm:mt-4 space-y-2 sm:space-y-3 border-l-2 border-blue-100 pl-2 sm:pl-4">
                    {repliesState[comment.id].replies.map((reply) => (
                      <div key={reply.id} className="flex items-start space-x-2 sm:space-x-3">
                        <div className={`w-5 h-5 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm ${generateAvatar(reply.username)}`}>
                          {getInitials(reply.username)}
                        </div>
                        <div className="flex-1">
                          {/* Reply indicator */}
                          <div className="flex items-center space-x-1 mb-1">
                            <Reply size={8} className="text-blue-500 sm:w-3 sm:h-3" />
                            <span className="text-xs text-blue-600 font-medium">
                              Replied to {comment.username}
                            </span>
                          </div>
                          
                          {editingComment === reply.id ? (
                            <div className="bg-blue-100 rounded-lg p-2 border border-blue-300">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 mb-2">
                                <span className="font-semibold text-gray-900 text-xs">{reply.username}</span>
                                <span className="text-xs text-gray-500">{formatDate(reply.created_at)}</span>
                                <span className="text-xs text-blue-600 font-medium">Editing</span>
                              </div>
                              <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-xs mb-2"
                                rows={1}
                              />
                              <div className="flex justify-end space-x-1">
                                <button
                                  type="button"
                                  onClick={cancelEdit}
                                  className="text-xs text-gray-600 hover:text-gray-800 px-1 py-0.5 rounded transition-all duration-300 transform hover:scale-105"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateComment(reply.id)}
                                  disabled={!editContent.trim() || submitting}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-0.5 rounded text-xs font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                                >
                                  {submitting ? 'Saving...' : 'Save'}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-blue-50 rounded-lg p-2 sm:p-3">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                                <span className="font-semibold text-gray-900 text-xs sm:text-sm">{reply.username}</span>
                                <span className="text-xs text-gray-500">{formatDate(reply.created_at)}</span>
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  <Reply size={8} className="mr-1" />
                                  Reply
                                </span>
                              </div>
                              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{reply.content}</p>
                            </div>
                          )}
                          
                          {isOwnComment(reply) && editingComment !== reply.id && (
                            <div className="flex justify-end space-x-2 mt-1">
                              <button
                                onClick={() => handleEditComment(reply)}
                                className="text-xs text-gray-500 hover:text-blue-600 font-medium transition-all duration-300 transform hover:scale-105"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteClick(reply.id)}
                                className="text-xs text-gray-500 hover:text-red-600 font-medium transition-all duration-300 transform hover:scale-105"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {/* Load More Replies Button */}
                    {repliesState[comment.id]?.hasMore && (
                      <div className="mt-3 text-center">
                        <button
                          onClick={() => loadMoreReplies(comment.id)}
                          disabled={repliesState[comment.id]?.loading}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-xs transform hover:scale-105 active:scale-95 border border-blue-200"
                        >
                          {repliesState[comment.id]?.loading ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
                              Loading replies...
                            </>
                          ) : (
                            <>
                              <MessageCircle size={10} className="mr-1" />
                              Load More Replies
                              <span className="ml-1 bg-blue-200 text-blue-800 px-1.5 py-0.5 rounded-full text-xs">
                                +{(repliesState[comment.id]?.replies.length || 0) < 10 ? '3' : 'more'}
                              </span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Comments */}
      {hasMoreComments && comments.length >= COMMENTS_PER_LOAD && (
        <div className="text-center mt-3 sm:mt-6">
          <button
            onClick={loadMoreComments}
            disabled={loadingMore}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 sm:px-6 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto text-sm sm:text-base transform hover:scale-105 active:scale-95"
          >
            {loadingMore ? (
              <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-gray-600 mr-1 sm:mr-2"></div>
            ) : null}
            {loadingMore ? 'Loading...' : 'Load More Comments'}
          </button>
        </div>
      )}

      {/* No Comments State */}
      {comments.length === 0 && !loading && (
        <div className="text-center py-4 sm:py-8">
          <MessageCircle className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-4" />
          <p className="text-gray-600 text-sm sm:text-base px-4">No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  )
}

export default BlogComments