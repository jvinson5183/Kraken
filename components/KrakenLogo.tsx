'use client'

import React from 'react'
import Layer1 from '../imports/Layer1'
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

interface KrakenLogoProps {
  size?: number
  position?: { bottom?: string; right?: string }
  className?: string
}

/**
 * Kraken Logo Component
 * Displays the Kraken brand logo with customizable positioning
 * Uses original purple colors as specified in PRD
 */
export function KrakenLogo({ 
  size = 40,
  position = { bottom: '32px', right: '16px' },
  className = ''
}: KrakenLogoProps) {
  const positionStyles = {
    bottom: position.bottom,
    right: position.right,
    width: `${size}px`,
    height: `${size}px`
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={`fixed z-[200] flex items-center justify-center cursor-pointer opacity-50 hover:opacity-100 transition-opacity duration-200 ${className}`}
            style={positionStyles}
          >
            <Layer1 />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Kraken 1.0</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
} 