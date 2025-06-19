'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface CloseAllPortalsButtonProps {
  onCloseAll: () => void
  hasOpenPortals: boolean
  position?: { bottom?: string; left?: string }
}

/**
 * Close All Portals Button Component
 * Displays a circular button to close all open portals
 * Only visible when portals are open
 */
export function CloseAllPortalsButton({ 
  onCloseAll, 
  hasOpenPortals,
  position = { bottom: '16px', left: '16px' }
}: CloseAllPortalsButtonProps) {
  if (!hasOpenPortals) return null

  const positionStyles = {
    bottom: position.bottom,
    left: position.left
  }

  return (
    <AnimatePresence>
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onCloseAll}
        className="fixed z-[200] w-12 h-12 bg-gray-800/60 hover:bg-purple-600/40 border border-gray-600/50 hover:border-purple-500/60 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm shadow-lg"
        style={positionStyles}
        title="Close All Portals"
        aria-label="Close All Portals"
      >
        <X className="w-6 h-6 text-gray-300 hover:text-purple-200 transition-colors duration-200" />
      </motion.button>
    </AnimatePresence>
  )
} 