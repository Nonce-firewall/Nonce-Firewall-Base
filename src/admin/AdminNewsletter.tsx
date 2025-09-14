import React, { useEffect, useState } from 'react'
import { Mail, Download, Trash2, Users } from 'lucide-react'
import { db } from '../lib/supabase'
import type { NewsletterSubscriber } from '../types'

const AdminNewsletter: React.FC = () => {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const fetchSubscribers = async () => {
    setLoading(true)
    const { data } = await db.getNewsletterSubscribers()
    if (data) setSubscribers(data)
    setLoading(false)
  }

  const handleUnsubscribe = async (email: string) => {
    if (!confirm('Are you sure you want to unsubscribe this user?')) return
    
    try {
      const { error } = await db.unsubscribeFromNewsletter(email)
      if (error) throw error
      
      fetchSubscribers()
    } catch (error) {
      console.error('Error unsubscribing user:', error)
      alert('Error unsubscribing user. Please try again.')
    }
  }

  const exportSubscribers = () => {
    const activeSubscribers = subscribers.filter(sub => sub.active)
    const csvContent = [
      'Email,Subscribed Date,Status',
      ...activeSubscribers.map(sub => 
        `${sub.email},${new Date(sub.subscribed_at).toLocaleDateString()},${sub.active ? 'Active' : 'Inactive'}`
      )
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const filteredSubscribers = subscribers.filter(subscriber => {
    if (filter === 'active') return subscriber.active
    if (filter === 'inactive') return !subscriber.active
    return true
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <Mail className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-900">Newsletter Subscribers</h2>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={exportSubscribers}
              className="btn-secondary flex items-center"
            >
              <Download size={20} className="mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-600">Total Subscribers</p>
                <p className="text-2xl font-bold text-blue-900">{subscribers.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-green-600">Active</p>
                <p className="text-2xl font-bold text-green-900">
                  {subscribers.filter(sub => sub.active).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unsubscribed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {subscribers.filter(sub => !sub.active).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6 w-full sm:w-fit flex-wrap justify-center">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 ${
              filter === 'all' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All ({subscribers.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 ${
              filter === 'active' 
                ? 'bg-white text-green-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Active ({subscribers.filter(sub => sub.active).length})
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 ${
              filter === 'inactive' 
                ? 'bg-white text-red-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Unsubscribed ({subscribers.filter(sub => !sub.active).length})
          </button>
        </div>

        {/* Subscribers List */}
        <div className="space-y-4">
          {filteredSubscribers.map((subscriber) => (
            <div key={subscriber.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                  <div className={`w-3 h-3 rounded-full ${
                    subscriber.active ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base break-all">{subscriber.email}</p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Subscribed: {formatDate(subscriber.subscribed_at)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 flex-shrink-0 self-end sm:self-auto">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    subscriber.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {subscriber.active ? 'Active' : 'Unsubscribed'}
                  </span>
                  
                  {subscriber.active && (
                    <button
                      onClick={() => handleUnsubscribe(subscriber.email)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full"
                      title="Unsubscribe"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSubscribers.length === 0 && (
          <div className="text-center py-12">
            <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {filter === 'all' && 'No subscribers yet.'}
              {filter === 'active' && 'No active subscribers.'}
              {filter === 'inactive' && 'No unsubscribed users.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminNewsletter