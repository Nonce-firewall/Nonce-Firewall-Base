import React, { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Users, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react'
import { db } from '../lib/supabase'
import type { TeamMember } from '../types'

const AdminTeamMembers: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    profile_picture_url: '',
    twitter_url: '',
    linkedin_url: '',
    github_url: '',
    display_order: 0,
    active: true
  })

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    setLoading(true)
    const { data } = await db.getTeamMembers()
    if (data) setTeamMembers(data)
    setLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               type === 'number' ? parseInt(value) || 0 : value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingMember) {
        const { error } = await db.updateTeamMember(editingMember.id, formData)
        if (error) throw error
      } else {
        const { error } = await db.createTeamMember(formData)
        if (error) throw error
      }
      
      setShowForm(false)
      setEditingMember(null)
      resetForm()
      fetchTeamMembers()
    } catch (error) {
      console.error('Error saving team member:', error)
      alert('Error saving team member. Please try again.')
    }
  }

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member)
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio || '',
      profile_picture_url: member.profile_picture_url,
      twitter_url: member.twitter_url || '',
      linkedin_url: member.linkedin_url || '',
      github_url: member.github_url || '',
      display_order: member.display_order || 0,
      active: member.active ?? true
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return
    
    try {
      const { error } = await db.deleteTeamMember(id)
      if (error) throw error
      
      fetchTeamMembers()
    } catch (error) {
      console.error('Error deleting team member:', error)
      alert('Error deleting team member. Please try again.')
    }
  }

  const toggleActive = async (member: TeamMember) => {
    try {
      const { error } = await db.updateTeamMember(member.id, { active: !member.active })
      if (error) throw error
      
      fetchTeamMembers()
    } catch (error) {
      console.error('Error updating team member status:', error)
      alert('Error updating team member status. Please try again.')
    }
  }

  const updateDisplayOrder = async (member: TeamMember, direction: 'up' | 'down') => {
    const newOrder = direction === 'up' ? (member.display_order || 0) - 1 : (member.display_order || 0) + 1
    
    try {
      const { error } = await db.updateTeamMember(member.id, { display_order: newOrder })
      if (error) throw error
      
      fetchTeamMembers()
    } catch (error) {
      console.error('Error updating display order:', error)
      alert('Error updating display order. Please try again.')
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingMember(null)
    setFormData({
      name: '',
      role: '',
      bio: '',
      profile_picture_url: '',
      twitter_url: '',
      linkedin_url: '',
      github_url: '',
      display_order: 0,
      active: true
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
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center w-full sm:w-auto justify-center"
          >
            <Plus size={20} className="mr-2" />
            Add Team Member
          </button>
        </div>

        {showForm && (
          <div className="mb-8 p-4 sm:p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 sm:px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <input
                    type="text"
                    name="role"
                    required
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-3 py-2 sm:px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Picture URL *
                </label>
                <input
                  type="url"
                  name="profile_picture_url"
                  required
                  value={formData.profile_picture_url}
                  onChange={handleChange}
                  placeholder="https://example.com/profile.jpg"
                  className="w-full px-3 py-2 sm:px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full px-3 py-2 sm:px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter URL
                  </label>
                  <input
                    type="url"
                    name="twitter_url"
                    value={formData.twitter_url}
                    onChange={handleChange}
                    className="w-full px-3 py-2 sm:px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    name="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={handleChange}
                    className="w-full px-3 py-2 sm:px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    name="github_url"
                    value={formData.github_url}
                    onChange={handleChange}
                    className="w-full px-3 py-2 sm:px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    name="display_order"
                    value={formData.display_order}
                    onChange={handleChange}
                    className="w-full px-3 py-2 sm:px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <input
                    type="checkbox"
                    id="active"
                    name="active"
                    checked={formData.active}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                    Active (visible on website)
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button type="submit" className="btn-primary w-full sm:w-auto">
                  {editingMember ? 'Update Team Member' : 'Add Team Member'}
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

        <div className="space-y-4">
          {teamMembers.map((member) => (
            <div key={member.id} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-shrink-0 mx-auto sm:mx-0">
                  <img
                    src={member.profile_picture_url}
                    alt={member.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full border-2 border-gray-200"
                  />
                </div>
                
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{member.name}</h3>
                      <p className="text-blue-600 font-medium">{member.role}</p>
                    </div>
                    <div className="flex items-center justify-center sm:justify-end space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {member.active ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-xs text-gray-500">
                        Order: {member.display_order || 0}
                      </span>
                    </div>
                  </div>
                  
                  {member.bio && (
                    <p className="text-gray-600 text-sm mb-3 break-words">{member.bio}</p>
                  )}
                  
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-3">
                    {member.twitter_url && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Twitter</span>
                    )}
                    {member.linkedin_url && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">LinkedIn</span>
                    )}
                    {member.github_url && (
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">GitHub</span>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-row sm:flex-col items-center justify-center gap-2">
                  <button
                    onClick={() => updateDisplayOrder(member, 'up')}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full"
                    title="Move up"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    onClick={() => updateDisplayOrder(member, 'down')}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full"
                    title="Move down"
                  >
                    <ArrowDown size={16} />
                  </button>
                  <button
                    onClick={() => toggleActive(member)}
                    className={`p-2 rounded-full ${
                      member.active 
                        ? 'text-green-600 hover:text-green-800 hover:bg-green-100' 
                        : 'text-red-600 hover:text-red-800 hover:bg-red-100'
                    }`}
                    title={member.active ? 'Hide from website' : 'Show on website'}
                  >
                    {member.active ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button
                    onClick={() => handleEdit(member)}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100 text-center sm:text-left">
                Created: {new Date(member.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {teamMembers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No team members added yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminTeamMembers