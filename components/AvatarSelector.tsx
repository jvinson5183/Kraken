'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
// Using placeholder URLs for now - will be replaced with actual assets later
const humanAvatarGif = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><circle cx="48" cy="48" r="48" fill="%23374151"/><circle cx="48" cy="38" r="12" fill="%239CA3AF"/><path d="M24 72c0-13.3 10.7-24 24-24s24 10.7 24 24" fill="%239CA3AF"/></svg>'
const robotAvatarImage = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect x="16" y="20" width="64" height="56" rx="8" fill="%23374151"/><rect x="24" y="32" width="12" height="8" rx="2" fill="%239CA3AF"/><rect x="60" y="32" width="12" height="8" rx="2" fill="%239CA3AF"/><rect x="36" y="56" width="24" height="4" rx="2" fill="%239CA3AF"/></svg>'

export type AvatarType = 'kraken-eye' | 'human' | 'robot'

interface AvatarSelectorProps {
  selectedAvatar: AvatarType
  onSelectAvatar: (avatar: AvatarType) => void
  mousePosition: { x: number; y: number }
}

// Simplified Kraken Eye Component with Purple Theme and Transparent Background
function KrakenEye({ mousePosition, size = 80 }: { mousePosition: { x: number; y: number }, size?: number }) {
  const centerX = size / 2
  const centerY = size / 2
  const maxOffset = size * 0.15
  
  const rect = typeof window !== 'undefined' ? document.querySelector('.tron-eye-container')?.getBoundingClientRect() : null
  const avatarCenterX = rect ? rect.left + rect.width / 2 : 0
  const avatarCenterY = rect ? rect.top + rect.height / 2 : 0
  
  const deltaX = mousePosition.x - avatarCenterX
  const deltaY = mousePosition.y - avatarCenterY
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  
  const normalizedX = distance > 0 ? (deltaX / distance) * maxOffset : 0
  const normalizedY = distance > 0 ? (deltaY / distance) * maxOffset : 0
  
  const irisX = centerX + normalizedX
  const irisY = centerY + normalizedY

  return (
    <div className="tron-eye-container w-full h-full flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-lg">
        <defs>
          <radialGradient id="krakenGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(162, 161, 255, 0.2)" />
            <stop offset="100%" stopColor="rgba(118, 53, 164, 0.4)" />
          </radialGradient>
          
          <radialGradient id="krakenIris" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(162, 161, 255, 1)" />
            <stop offset="100%" stopColor="rgba(118, 53, 164, 0.8)" />
          </radialGradient>

          <radialGradient id="krakenPupil" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(58, 0, 104, 0.9)" />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 0.8)" />
          </radialGradient>
        </defs>
        
        {/* Outer ring with purple glow */}
        <circle
          cx={centerX}
          cy={centerY}
          r={size * 0.4}
          fill="none"
          stroke="rgba(139, 92, 246, 0.6)"
          strokeWidth="2"
        />
        
        {/* Moving iris with purple gradient */}
        <motion.circle
          cx={irisX}
          cy={irisY}
          r={size * 0.12}
          fill="url(#krakenIris)"
          animate={{ cx: irisX, cy: irisY }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        />
        
        {/* Pupil with dark purple gradient */}
        <motion.circle
          cx={irisX}
          cy={irisY}
          r={size * 0.04}
          fill="url(#krakenPupil)"
          animate={{ cx: irisX, cy: irisY }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        />

        {/* Additional purple glow effect */}
        <circle
          cx={centerX}
          cy={centerY}
          r={size * 0.42}
          fill="none"
          stroke="rgba(162, 161, 255, 0.3)"
          strokeWidth="1"
          opacity="0.5"
        />
      </svg>
    </div>
  )
}

function AnimatedHuman({ size = 80 }: { size?: number }) {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg">
      <img
        src={humanAvatarGif}
        alt="Animated Human AI Avatar"
        className="w-full h-full object-cover rounded-lg"
      />
    </div>
  )
}

function AnimatedRobot({ size = 80 }: { size?: number }) {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg">
      <img
        src={robotAvatarImage}
        alt="Robot AI Avatar"
        className="w-full h-full object-cover rounded-lg"
      />
    </div>
  )
}

export function AvatarSelector({ selectedAvatar, onSelectAvatar, mousePosition }: AvatarSelectorProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const avatarOptions = [
    {
      id: 'kraken-eye' as AvatarType,
      name: 'Kraken Eye',
      description: 'Interactive digital interface'
    },
    {
      id: 'human' as AvatarType,
      name: 'Human Face',
      description: 'Animated bio-avatar'
    },
    {
      id: 'robot' as AvatarType,
      name: 'Robot Face',
      description: 'Custom AI system'
    }
  ]

  const renderAvatar = (avatarType: AvatarType, size: number = 80) => {
    switch (avatarType) {
      case 'kraken-eye':
        return <KrakenEye mousePosition={mousePosition} size={size} />
      case 'human':
        return <AnimatedHuman size={size} />
      case 'robot':
        return <AnimatedRobot size={size} />
    }
  }

  const renderMenuPreview = (avatarType: AvatarType) => {
    switch (avatarType) {
      case 'kraken-eye':
        return <KrakenEye mousePosition={mousePosition} size={32} />
      case 'human':
        return <AnimatedHuman size={32} />
      case 'robot':
        return <AnimatedRobot size={32} />
    }
  }

  return (
    <div className="relative">
      <motion.div
        className="relative w-24 h-24 bg-transparent border-transparent overflow-hidden group cursor-pointer"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {renderAvatar(selectedAvatar, 80)}
        
        <div className="absolute inset-0 bg-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="text-transparent text-xs">AI</div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <div 
              className="fixed inset-0 z-[90]" 
              onClick={() => setIsMenuOpen(false)}
            />
            
            <motion.div
              className="absolute top-full left-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-md border border-purple-500/30 rounded-lg shadow-2xl z-[100] overflow-hidden"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="p-2">
                <div className="text-purple-300 text-sm mb-2 px-2 py-1">Select Avatar</div>
                {avatarOptions.map((option) => (
                  <motion.button
                    key={option.id}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                      selectedAvatar === option.id
                        ? 'bg-purple-600/30 border border-purple-400/50'
                        : 'hover:bg-slate-700/50 border border-transparent'
                    }`}
                    onClick={() => {
                      onSelectAvatar(option.id)
                      setIsMenuOpen(false)
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-10 h-10 bg-slate-700/50 rounded border border-slate-600/50 overflow-hidden flex-shrink-0">
                      {renderMenuPreview(option.id)}
                    </div>
                    
                    <div className="flex-1 text-left">
                      <div className="text-slate-300 text-sm">{option.name}</div>
                      <div className="text-slate-500 text-xs">{option.description}</div>
                    </div>
                    
                    {selectedAvatar === option.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-purple-400"
                      >
                        <Check className="w-4 h-4" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}