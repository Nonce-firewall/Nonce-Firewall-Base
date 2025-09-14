import React from 'react'
import { Github, Linkedin, Twitter } from 'lucide-react'
import type { TeamMember } from '../types'

interface TeamMemberCardProps {
  teamMember: TeamMember
  variant?: 'full' | 'compact' | 'preview'
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ teamMember, variant = 'full' }) => {
  const getCardAccentColor = (name: string) => {
    const colors = [
      'border-t-blue-500 bg-gradient-to-b from-blue-50 to-white',
      'border-t-green-500 bg-gradient-to-b from-green-50 to-white',
      'border-t-purple-500 bg-gradient-to-b from-purple-50 to-white',
      'border-t-pink-500 bg-gradient-to-b from-pink-50 to-white',
      'border-t-indigo-500 bg-gradient-to-b from-indigo-50 to-white',
      'border-t-yellow-500 bg-gradient-to-b from-yellow-50 to-white',
      'border-t-red-500 bg-gradient-to-b from-red-50 to-white',
      'border-t-teal-500 bg-gradient-to-b from-teal-50 to-white',
      'border-t-orange-500 bg-gradient-to-b from-orange-50 to-white',
      'border-t-cyan-500 bg-gradient-to-b from-cyan-50 to-white'
    ]
    const index = name.length % colors.length
    return colors[index]
  }

  const getRoleColor = (role: string) => {
    const colors = [
      'text-blue-600 bg-blue-100',
      'text-green-600 bg-green-100',
      'text-purple-600 bg-purple-100',
      'text-pink-600 bg-pink-100',
      'text-indigo-600 bg-indigo-100',
      'text-yellow-600 bg-yellow-100',
      'text-red-600 bg-red-100',
      'text-teal-600 bg-teal-100',
      'text-orange-600 bg-orange-100',
      'text-cyan-600 bg-cyan-100'
    ]
    const index = role.length % colors.length
    return colors[index]
  }

  const cardClasses = variant === 'compact'
    ? `rounded-xl shadow-lg p-4 sm:p-6 card-hover text-center border-t-4 relative overflow-hidden ${getCardAccentColor(teamMember.name)}`
    : variant === 'preview'
    ? `rounded-xl shadow-lg p-3 sm:p-4 card-hover text-center border-t-4 relative overflow-hidden ${getCardAccentColor(teamMember.name)}`
    : `rounded-xl shadow-lg p-6 card-hover text-center border-t-4 relative overflow-hidden ${getCardAccentColor(teamMember.name)}`

  const avatarSize = variant === 'compact' || variant === 'preview' ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-24 h-24'
  const nameSize = variant === 'compact' || variant === 'preview' ? 'text-lg sm:text-xl' : 'text-xl'
  const roleSize = variant === 'compact' || variant === 'preview' ? 'text-xs sm:text-sm' : 'text-sm'
  const bioSize = variant === 'compact' || variant === 'preview' ? 'text-xs sm:text-sm' : 'text-sm'
  const socialSize = variant === 'compact' || variant === 'preview' ? 'w-8 h-8' : 'w-10 h-10'
  const socialIconSize = variant === 'compact' || variant === 'preview' ? 14 : 18

  return (
    <article className={cardClasses}>
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
        <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 rounded-full transform rotate-12 translate-x-8 -translate-y-8"></div>
      </div>
      <div className="absolute bottom-0 left-0 w-16 h-16 opacity-5">
        <div className="w-full h-full bg-gradient-to-tr from-gray-300 to-gray-500 rounded-full transform -rotate-12 -translate-x-4 translate-y-4"></div>
      </div>
      
      <div className="relative z-10">
        <div className={`relative mx-auto ${variant === 'compact' ? 'mb-3' : 'mb-4'} ${avatarSize}`}>
        <img
          src={teamMember.profile_picture_url}
          alt={`${teamMember.name} - ${teamMember.role}`}
          className={`w-full h-full object-cover rounded-full shadow-xl ${variant === 'compact' ? 'border-2 sm:border-3' : 'border-4'} border-white`}
        />
        {/* Avatar glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
      </div>
      
      <h3 className={`font-bold text-gray-900 ${variant === 'compact' ? 'mb-2' : 'mb-2'} ${nameSize}`}>
        {teamMember.name}
      </h3>
      <div className={`inline-block ${variant === 'compact' ? 'mb-3' : 'mb-4'}`}>
        <p className={`px-2 sm:px-3 py-1 rounded-full font-semibold ${getRoleColor(teamMember.role)} ${roleSize}`}>
          {teamMember.role}
        </p>
      </div>
      
      {teamMember.bio && (
        <p className={`text-gray-600 line-clamp-3 leading-relaxed ${variant === 'compact' ? 'mb-4' : 'mb-6'} ${bioSize}`}>
          {teamMember.bio}
        </p>
      )}
      
      {/* Social Links */}
      <div className={`flex justify-center ${variant === 'compact' ? 'space-x-2 sm:space-x-3' : 'space-x-4'}`}>
        {teamMember.twitter_url && (
          <a
            href={teamMember.twitter_url}
            target="_blank"
            rel="noopener noreferrer"
            className={`bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-600 hover:from-blue-200 hover:to-blue-300 transition-all duration-300 transform hover:scale-110 hover:shadow-lg ${socialSize}`}
            title={`${teamMember.name} on Twitter`}
          >
            <Twitter size={socialIconSize} />
          </a>
        )}
        {teamMember.linkedin_url && (
          <a
            href={teamMember.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className={`bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-700 hover:from-blue-200 hover:to-blue-300 transition-all duration-300 transform hover:scale-110 hover:shadow-lg ${socialSize}`}
            title={`${teamMember.name} on LinkedIn`}
          >
            <Linkedin size={socialIconSize} />
          </a>
        )}
        {teamMember.github_url && (
          <a
            href={teamMember.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className={`bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-gray-700 hover:from-gray-200 hover:to-gray-300 transition-all duration-300 transform hover:scale-110 hover:shadow-lg ${socialSize}`}
            title={`${teamMember.name} on GitHub`}
          >
            <Github size={socialIconSize} />
          </a>
        )}
      </div>
      </div>
    </article>
  )
}

export default TeamMemberCard