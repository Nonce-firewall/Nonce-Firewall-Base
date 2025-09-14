import React, { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Star, Check, X } from 'lucide-react'
import { db } from '../lib/supabase'
import type { Review, Project } from '../types'

const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const [formData, setFormData] = useState({
    client_name: '',
    client_company: '',
    rating: 5,
    review_text: '',
    project_id: '',
    approved: true
  })

  useEffect(() => {
    fetchReviews()
  }, [])

  useEffect(() => {
    fetchReviews()
  }, [filter])

  const fetchReviews = async () => {
    setLoading(true)
    
    let reviewsResult
    if (filter === 'all') {
      reviewsResult = await db.getReviews()
    } else if (filter === 'approved') {
      reviewsResult = await db.getReviews(true)
    } else {
      reviewsResult = await db.getReviews(false)
    }
    
    const projectsResult = await db.getProjects()
    
    if (reviewsResult.data) setReviews(reviewsResult.data)
    if (projectsResult.data) setProjects(projectsResult.data)
    setLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               type === 'number' ? parseInt(value) : value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Prepare data with proper null handling for optional project_id
      const reviewData = {
        ...formData,
        project_id: formData.project_id || null, // Convert empty string to null
        client_company: formData.client_company || null // Convert empty string to null
      }
      
      if (editingReview) {
        const { error } = await db.updateReview(editingReview.id, reviewData)
        if (error) throw error
      } else {
        const { error } = await db.createReview(reviewData)
        if (error) throw error
      }
      
      setShowForm(false)
      setEditingReview(null)
      setFormData({
        client_name: '',
        client_company: '',
        rating: 5,
        review_text: '',
        project_id: '',
        approved: true
      })
      fetchReviews()
    } catch (error) {
      console.error('Error saving review:', error)
      alert('Error saving review. Please try again.')
    }
  }

  const handleEdit = (review: Review) => {
    setEditingReview(review)
    setFormData({
      client_name: review.client_name,
      client_company: review.client_company || '',
      rating: review.rating,
      review_text: review.review_text,
      project_id: review.project_id || '',
      approved: review.approved
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return
    
    try {
      const { error } = await db.deleteReview(id)
      if (error) throw error
      
      fetchReviews()
    } catch (error) {
      console.error('Error deleting review:', error)
      alert('Error deleting review. Please try again.')
    }
  }

  const toggleApproval = async (review: Review) => {
    try {
      const { error } = await db.updateReview(review.id, { approved: !review.approved })
      if (error) throw error
      
      fetchReviews()
    } catch (error) {
      console.error('Error updating review approval:', error)
      alert('Error updating review approval. Please try again.')
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingReview(null)
    setFormData({
      client_name: '',
      client_company: '',
      rating: 5,
      review_text: '',
      project_id: '',
      approved: true
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
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Reviews</h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="flex bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
              <button
                onClick={() => setFilter('all')}
                className={`flex-1 sm:flex-none px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 ${
                  filter === 'all' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All ({reviews.length})
              </button>
              <button
                onClick={() => setFilter('approved')}
                className={`flex-1 sm:flex-none px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 ${
                  filter === 'approved' 
                    ? 'bg-white text-green-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`flex-1 sm:flex-none px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 ${
                  filter === 'pending' 
                    ? 'bg-white text-orange-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Pending
              </button>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary flex items-center justify-center w-full sm:w-auto text-sm py-2 px-3"
            >
              <Plus size={18} className="mr-2" />
              Add Review
            </button>
          </div>
        </div>

        {showForm && (
          <div className="mb-8 p-4 sm:p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingReview ? 'Edit Review' : 'Add New Review'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    name="client_name"
                    required
                    value={formData.client_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 sm:px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Company
                  </label>
                  <input
                    type="text"
                    name="client_company"
                    value={formData.client_company}
                    onChange={handleChange}
                    className="w-full px-3 py-2 sm:px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Related Project
                </label>
                <select
                  name="project_id"
                  value={formData.project_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 sm:px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                >
                  <option value="">No specific project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating *
                </label>
                <select
                  name="rating"
                  required
                  value={formData.rating}
                  onChange={handleChange}
                  className="w-full px-3 py-2 sm:px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                >
                  {[1, 2, 3, 4, 5].map(rating => (
                    <option key={rating} value={rating}>{rating} Star{rating !== 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Text *
                </label>
                <textarea
                  name="review_text"
                  required
                  rows={4}
                  value={formData.review_text}
                  onChange={handleChange}
                  className="w-full px-3 py-2 sm:px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="approved"
                  name="approved"
                  checked={formData.approved}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="approved" className="ml-2 block text-sm text-gray-900">
                  Approved for display
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button type="submit" className="btn-primary w-full sm:w-auto">
                  {editingReview ? 'Update Review' : 'Add Review'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary w-full sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {filter === 'all' && 'No reviews found.'}
              {filter === 'approved' && 'No approved reviews found.'}
              {filter === 'pending' && 'No pending reviews found.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-base sm:text-lg break-words">
                          {review.client_name}
                        </h3>
                        {review.client_company && (
                          <p className="text-gray-500 text-sm break-words">
                            {review.client_company}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          review.approved 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {review.approved ? 'Approved' : 'Pending'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500 mb-3">
                      {review.project_id && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium break-words">
                          Project: {projects.find(p => p.id === review.project_id)?.title || 'Unknown Project'}
                        </span>
                      )}
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                          />
                        ))}
                        <span className="ml-1 text-xs font-medium text-gray-700">{review.rating}/5</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 italic text-sm leading-relaxed break-words mb-4">
                      "{review.review_text}"
                    </p>
                    
                    <div className="text-xs text-gray-500 pt-3 border-t border-gray-100">
                      Created: {new Date(review.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center sm:justify-end space-x-2 pt-2 border-t border-gray-100 sm:border-t-0 sm:pt-0">
                    <button
                      onClick={() => toggleApproval(review)}
                      className={`p-2 rounded-full transition-all duration-200 ${
                        review.approved 
                          ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                          : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                      }`}
                      title={review.approved ? 'Approved - Click to unapprove' : 'Pending - Click to approve'}
                    >
                      {review.approved ? <Check size={16} /> : <X size={16} />}
                    </button>
                    <button
                      onClick={() => handleEdit(review)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-all duration-200"
                      title="Edit review"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-all duration-200"
                      title="Delete review"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminReviews