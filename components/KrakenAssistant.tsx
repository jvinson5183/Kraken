'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic } from 'lucide-react'

interface KrakenAssistantProps {
  hasOpenPortals: boolean
  mousePosition: { x: number; y: number }
  className?: string
  style?: React.CSSProperties
}

interface KrakenEyeProps {
  mousePosition: { x: number; y: number }
  size?: number
  isInCenter?: boolean
  containerRef?: React.RefObject<HTMLDivElement>
}

// Enhanced Kraken Eye Component with random movement and mouse tracking
function KrakenEye({ mousePosition, size = 80, isInCenter = false, containerRef }: KrakenEyeProps) {
  const [randomPosition, setRandomPosition] = useState({ x: 0, y: 0 })
  const [isMouseMoving, setIsMouseMoving] = useState(false)
  const mouseTimeoutRef = useRef<number>()
  const randomIntervalRef = useRef<number>()
  const prevMousePosition = useRef(mousePosition)

  const centerX = size / 2
  const centerY = size / 2
  const maxOffset = size * 0.15

  // Detect mouse movement
  useEffect(() => {
    if (mousePosition.x !== prevMousePosition.current.x || mousePosition.y !== prevMousePosition.current.y) {
      setIsMouseMoving(true)
      prevMousePosition.current = mousePosition

      // Clear existing timeout
      if (mouseTimeoutRef.current) {
        clearTimeout(mouseTimeoutRef.current)
      }

      // Set mouse as not moving after 2 seconds of no movement
      mouseTimeoutRef.current = setTimeout(() => {
        setIsMouseMoving(false)
      }, 2000)
    }
  }, [mousePosition])

  // Random eye movement when in center and mouse not moving
  useEffect(() => {
    if (isInCenter && !isMouseMoving) {
      const startRandomMovement = () => {
        randomIntervalRef.current = setInterval(() => {
          setRandomPosition({
            x: (Math.random() - 0.5) * maxOffset * 2,
            y: (Math.random() - 0.5) * maxOffset * 2
          })
        }, 1500 + Math.random() * 1000) // Random interval between 1.5-2.5 seconds
      }

      startRandomMovement()

      return () => {
        if (randomIntervalRef.current) {
          clearInterval(randomIntervalRef.current)
        }
      }
    } else {
      if (randomIntervalRef.current) {
        clearInterval(randomIntervalRef.current)
      }
    }
  }, [isInCenter, isMouseMoving, maxOffset])

  // Calculate iris position
  let irisX = centerX
  let irisY = centerY

  if (isInCenter && !isMouseMoving) {
    // Use random position when in center and mouse not moving
    irisX = centerX + randomPosition.x
    irisY = centerY + randomPosition.y
  } else if (containerRef?.current) {
    // Track mouse when moving or when in top-left
    const rect = containerRef.current.getBoundingClientRect()
    const avatarCenterX = rect.left + rect.width / 2
    const avatarCenterY = rect.top + rect.height / 2
    
    const deltaX = mousePosition.x - avatarCenterX
    const deltaY = mousePosition.y - avatarCenterY
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    
    const normalizedX = distance > 0 ? (deltaX / distance) * maxOffset : 0
    const normalizedY = distance > 0 ? (deltaY / distance) * maxOffset : 0
    
    irisX = centerX + normalizedX
    irisY = centerY + normalizedY
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
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

// Search Field Component
function KrakenSearchField({ onSearch, onFocusChange }: { 
  onSearch?: (query: string) => void
  onFocusChange?: (isFocused: boolean) => void 
}) {
  const [query, setQuery] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch?.(query.trim())
      setQuery('')
    }
  }

  const handleVoiceInput = () => {
    // Voice input functionality will be implemented later
    setIsListening(!isListening)
    console.log('Voice input toggled:', !isListening)
  }

  const handleFocus = () => {
    setIsFocused(true)
    onFocusChange?.(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
    onFocusChange?.(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="absolute"
      style={{ top: '130px' }} // Positioned 130px below eye center for proper spacing below the 2x scaled eye
    >
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Ask Kraken anything..."
          className="w-96 h-12 px-6 pr-14 bg-gray-900/90 backdrop-blur-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
          style={{ 
            border: '1px solid rgba(139, 92, 246, 0.5)',
            borderRadius: '24px' 
          }}
        />
        
        <button
          type="button"
          onClick={handleVoiceInput}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-200 ${
            isListening 
              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
              : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
          }`}
        >
          <Mic className="w-4 h-4" />
        </button>
      </form>
    </motion.div>
  )
}

export function KrakenAssistant({ hasOpenPortals, mousePosition, className, style }: KrakenAssistantProps) {
  const [isHoveringCenter, setIsHoveringCenter] = useState(false)
  const [isFieldActive, setIsFieldActive] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const hideTimeoutRef = useRef<number>()

  // Calculate distance from mouse to center eye or search field area
  useEffect(() => {
    if (!hasOpenPortals && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      // Calculate distance from mouse to eye center
      const eyeDistance = Math.sqrt(
        Math.pow(mousePosition.x - centerX, 2) + Math.pow(mousePosition.y - centerY, 2)
      )
      
                      // Define expanded interaction area that includes both eye and search field
        const interactionArea = {
          left: centerX - 200, // Slightly wider than search field
          right: centerX + 200,
          top: centerY - 80, // Above the eye
          bottom: centerY + 130 + 60 // Below the search field with extra padding
        }
        
        // Check if mouse is in the overall interaction area OR close to eye
        const isInInteractionArea = mousePosition.x >= interactionArea.left && 
                                   mousePosition.x <= interactionArea.right &&
                                   mousePosition.y >= interactionArea.top && 
                                   mousePosition.y <= interactionArea.bottom
        
        const shouldShow = eyeDistance <= 100 || isInInteractionArea
      
      if (shouldShow || isFieldActive) {
        // Show field if hovering or field is focused
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current)
          hideTimeoutRef.current = undefined
        }
        setIsHoveringCenter(true)
              } else if (isHoveringCenter) {
          // Start timeout to hide when not hovering and not focused
          if (!hideTimeoutRef.current) {
            hideTimeoutRef.current = setTimeout(() => {
              setIsHoveringCenter(false)
              hideTimeoutRef.current = undefined
            }, 300) // Longer delay to prevent flickering during mouse movement
          }
        }
    } else {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
        hideTimeoutRef.current = undefined
      }
      setIsHoveringCenter(false)
    }
  }, [mousePosition, hasOpenPortals, isHoveringCenter])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }
    }
  }, [])

  const handleSearch = (query: string) => {
    console.log('Kraken AI query:', query)
    // AI processing will be implemented later
  }

  const handleFieldFocusChange = (isFocused: boolean) => {
    setIsFieldActive(isFocused)
  }

  if (hasOpenPortals) {
    // Small version in top-left when portals are open
    return (
      <motion.div
        ref={containerRef}
        className={`w-24 h-24 ${className || ''}`}
        style={style}
        initial={{ scale: 1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <KrakenEye 
          mousePosition={mousePosition} 
          size={80} 
          isInCenter={false}
          containerRef={containerRef}
        />
      </motion.div>
    )
  }

  // Large version in center when no portals are open
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-[150] pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative flex flex-col items-center pointer-events-auto">
        <motion.div
          ref={containerRef}
          className="relative"
          initial={{ scale: 1 }}
          animate={{ scale: 2 }}
          transition={{ duration: 0.5 }}
        >
          <KrakenEye 
            mousePosition={mousePosition} 
            size={80} 
            isInCenter={true}
            containerRef={containerRef}
          />
        </motion.div>
        
        <AnimatePresence>
          {isHoveringCenter && (
            <KrakenSearchField 
              onSearch={handleSearch}
              onFocusChange={handleFieldFocusChange}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
} 