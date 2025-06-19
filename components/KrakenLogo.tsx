'use client'

import React from 'react'
import Layer1 from '../imports/Layer1'

interface KrakenLogoProps {
  size?: number
  position?: { top?: string; right?: string }
  className?: string
}

/**
 * Kraken Logo Component
 * Displays the Kraken brand logo with customizable positioning
 * Uses original purple colors as specified in PRD
 */
export function KrakenLogo({ 
  size = 40,
  position = { top: '32px', right: '16px' },
  className = ''
}: KrakenLogoProps) {
  const positionStyles = {
    top: position.top,
    right: position.right,
    width: `${size}px`,
    height: `${size}px`
  }

  return (
    <div 
      className={`fixed z-[200] flex items-center justify-center ${className}`}
      style={positionStyles}
    >
      <Layer1 />
    </div>
  )
} 