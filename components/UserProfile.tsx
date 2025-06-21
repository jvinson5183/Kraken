'use client'

import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { User } from 'lucide-react'
import { typography } from './ui/typography'

interface UserProfileProps {
  username?: string
  rank?: string
  avatarUrl?: string
  position?: { top?: string; right?: string }
}

/**
 * User Profile Component
 * Displays current user information with avatar and rank
 * Positioned in upper-right corner by default
 */
export function UserProfile({ 
  username = 'Captain Malone',
  rank = 'Captain',
  avatarUrl,
  position = { top: '56px', right: '64px' }
}: UserProfileProps) {
  const positionStyles = {
    top: position.top,
    right: position.right
  }

  return (
    <div 
      className="fixed z-[200] flex items-center gap-3 bg-gray-900/80 backdrop-blur-sm border border-gray-600/30 rounded-lg shadow-lg hover:border-purple-500/40 transition-all duration-300 group overflow-hidden w-12 h-12 hover:w-auto hover:h-auto p-2 hover:px-4 hover:py-2"
      style={positionStyles}
    >
      <Avatar className="w-8 h-8 border-2 border-gray-500/50 hover:border-purple-400/60 transition-colors duration-200 flex-shrink-0">
        <AvatarImage src={avatarUrl} alt={username} />
        <AvatarFallback className="bg-gray-700/50 text-gray-300">
          <User className="w-4 h-4" />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        <span className={`text-gray-400 leading-tight ${typography.caption}`}>
          Logged In As:
        </span>
        <span className={`text-gray-200 tracking-wide leading-tight ${typography.captionMedium}`}>
          {username}
        </span>
      </div>
    </div>
  )
} 