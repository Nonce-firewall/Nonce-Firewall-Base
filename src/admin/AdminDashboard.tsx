import React, { useState } from 'react'
import { Settings, Briefcase, Star, Code, Package, LogOut, BookOpen, Mail, Menu, X } from 'lucide-react'
import { Users } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import OptimizedImage from '../components/OptimizedImage'
import AdminSettings from './AdminSettings'
import AdminProjects from './AdminProjects'
import AdminReviews from './AdminReviews'
import AdminSkills from './AdminSkills'
import AdminProducts from './AdminProducts'
import AdminTeamMembers from './AdminTeamMembers'
import AdminBlogPosts from './AdminBlogPosts'
import AdminNewsletter from './AdminNewsletter'

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('settings')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { signOut, profile } = useAuth()

  const tabs = [
    { id: 'settings', label: 'Site Settings', icon: Settings, color: 'from-blue-500 to-blue-600' },
    { id: 'projects', label: 'Projects', icon: Briefcase, color: 'from-purple-500 to-purple-600' },
    { id: 'blog', label: 'Blog Posts', icon: BookOpen, color: 'from-green-500 to-green-600' },
    { id: 'reviews', label: 'Reviews', icon: Star, color: 'from-yellow-500 to-yellow-600' },
    { id: 'skills', label: 'Skills', icon: Code, color: 'from-indigo-500 to-indigo-600' },
    { id: 'products', label: 'Products', icon: Package, color: 'from-pink-500 to-pink-600' },
    { id: 'team', label: 'Team Members', icon: Users, color: 'from-teal-500 to-teal-600' },
    { id: 'newsletter', label: 'Newsletter', icon: Mail, color: 'from-orange-500 to-orange-600' }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'settings':
        return <AdminSettings />
      case 'projects':
        return <AdminProjects />
      case 'blog':
        return <AdminBlogPosts />
      case 'newsletter':
        return <AdminNewsletter />
      case 'reviews':
        return <AdminReviews />
      case 'skills':
        return <AdminSkills />
      case 'products':
        return <AdminProducts />
      case 'team':
        return <AdminTeamMembers />
      default:
        return <AdminSettings />
    }
  }

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await signOut()
    }
  }

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    setSidebarOpen(false) // Close sidebar on mobile after selection
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* DESKTOP ONLY - Horizontal Icon Navigation */}
      <div className="hidden lg:block bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <OptimizedImage
                src="/logo.png"
                alt="Admin Logo"
                className="h-8 w-8 object-contain"
                width={32}
                height={32}
                priority={true}
              />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                {profile && (
                  <p className="text-xs text-gray-600">
                    Welcome, {profile.username || profile.email}
                  </p>
                )}
              </div>
            </div>
            
            {/* Horizontal Icon Tabs */}
            <div className="flex items-center space-x-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative p-3 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 group ${
                      isActive 
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-lg` 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800'
                    }`}
                    title={tab.label}
                  >
                    <Icon size={20} />
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                      {tab.label}
                    </div>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </button>
                )
              })}
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => window.location.href = '/'}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 text-sm"
              >
                <span>View Site</span>
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 text-sm"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE ONLY - Fixed Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-lg border-b border-gray-200 z-50">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center space-x-2">
            <OptimizedImage
              src="/logo.png"
              alt="Admin Logo"
              className="h-6 w-6 object-contain"
              width={24}
              height={24}
              priority={true}
            />
            <div>
              <h1 className="text-base font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              {profile && (
                <p className="text-xs text-gray-500 truncate max-w-24">
                  {profile.username || profile.email}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* MOBILE ONLY - Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MOBILE ONLY - Sidebar */}
      <div className={`
        lg:hidden fixed inset-y-0 left-0 z-50
        w-64 bg-white shadow-xl border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col pt-16">
          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`
                    w-full group relative overflow-hidden rounded-lg p-2 text-left 
                    transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99]
                    ${isActive 
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg` 
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                    }
                  `}
                >
                  {/* Background decoration for active tab */}
                  {isActive && (
                    <div className="absolute inset-0 bg-white opacity-10 rounded-lg"></div>
                  )}
                  
                  <div className="relative flex items-center space-x-2">
                    <div className={`
                      p-1 rounded-md transition-all duration-300
                      ${isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-white text-gray-600 group-hover:text-gray-800 shadow-sm'
                      }
                    `}>
                      <Icon size={14} />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-xs">{tab.label}</span>
                      {isActive && (
                        <div className="w-full h-0.5 bg-white/30 rounded-full mt-1"></div>
                      )}
                    </div>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    )}
                  </div>
                </button>
              )
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <div className="space-y-2">
              <button
                onClick={() => window.location.href = '/'}
                className="w-full flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all duration-200"
              >
                <div className="p-1 bg-blue-100 rounded-md">
                  <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
                <span className="text-xs font-medium">View Site</span>
              </button>
              
              <button
                onClick={handleSignOut}
                className="w-full flex items-center space-x-2 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                <div className="p-1 bg-red-100 rounded-md">
                  <LogOut size={12} />
                </div>
                <span className="text-xs font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:pt-0 pt-16">
        {/* Content */}
        <div className="p-4 lg:p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard