'use client'

import React from 'react'
import { typography } from './ui/typography'

interface ClassificationBannerProps {
  classification?: string
  level?: 'unclassified' | 'confidential' | 'secret' | 'top-secret'
}

/**
 * Classification Banner Component
 * Displays security classification at the top of the interface
 * Follows DoD security classification standards
 */
export function ClassificationBanner({ 
  classification = 'UNCLASSIFIED',
  level = 'unclassified' 
}: ClassificationBannerProps) {
  const getClassificationColor = () => {
    switch (level) {
      case 'confidential':
        return 'bg-blue-600'
      case 'secret':
        return 'bg-red-600'
      case 'top-secret':
        return 'bg-yellow-600'
      default:
        return 'bg-green-600'
    }
  }

  return (
    <div className={`fixed top-0 left-0 right-0 z-[300] h-6 ${getClassificationColor()} flex items-center justify-center`}>
      <div className={`text-white ${typography.classification}`}>
        {classification}
      </div>
    </div>
  )
} 