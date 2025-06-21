'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PortalData } from './constants/portalConfigs'

interface EdgeTrayProps {
  position: 'top' | 'bottom' | 'left' | 'right'
  visible: boolean
  portals: PortalData[]
  openPortalIds: string[]
  onPortalClick: (portal: PortalData) => void
  onPortalDoubleClick: (portal: PortalData) => void
}

export function EdgeTray({ position, visible, portals, openPortalIds, onPortalClick, onPortalDoubleClick }: EdgeTrayProps) {
  const getPositionStyles = () => {
    switch (position) {
      case 'top':
        return {
          top: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'auto',
          height: '80px'
        }
      case 'bottom':
        return {
          bottom: '0px',
          left: '0px',
          right: '0px',
          width: '100%',
          height: '80px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }
      case 'left':
        return {
          left: '0px',
          top: '24px',
          bottom: '0px',
          width: '80px',
          height: 'calc(100% - 24px)',
          display: 'flex',
          flexDirection: 'column' as const,
          justifyContent: 'center',
          alignItems: 'center'
        }
      case 'right':
        return {
          right: '0px',
          top: '24px',
          bottom: '0px',
          width: '80px',
          height: 'calc(100% - 24px)',
          display: 'flex',
          flexDirection: 'column' as const,
          justifyContent: 'center',
          alignItems: 'center'
        }
    }
  }

  const getAnimationVariants = () => {
    switch (position) {
      case 'top':
        return {
          hidden: { y: -100, opacity: 0 },
          visible: { y: 0, opacity: 1 }
        }
      case 'bottom':
        return {
          hidden: { y: 100, opacity: 0 },
          visible: { y: 0, opacity: 1 }
        }
      case 'left':
        return {
          hidden: { x: -100, opacity: 0 },
          visible: { x: 0, opacity: 1 }
        }
      case 'right':
        return {
          hidden: { x: 100, opacity: 0 },
          visible: { x: 0, opacity: 1 }
        }
    }
  }

  const isHorizontal = position === 'top' || position === 'bottom'

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed z-[170]"
          style={getPositionStyles()}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={getAnimationVariants()}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <div className={`
            bg-gray-900/90 backdrop-blur-md border border-gray-600/30 rounded-lg p-2 shadow-2xl
            ${isHorizontal ? 'flex flex-row gap-2' : 'flex flex-col gap-2'}
          `}>
            {portals.map((portal) => {
              const isSelected = openPortalIds.includes(portal.id)
              
              return (
                <motion.button
                  key={portal.id}
                  className={`group relative p-3 border rounded-lg transition-all duration-200 ${
                    isSelected 
                      ? 'bg-purple-600/30 border-purple-400/80 shadow-lg shadow-purple-500/20' 
                      : 'bg-gray-800/50 hover:bg-purple-600/20 border-gray-600/50 hover:border-purple-400/60'
                  }`}
                  onClick={() => onPortalClick(portal)}
                  onDoubleClick={() => onPortalDoubleClick(portal)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={`transition-colors ${
                    isSelected 
                      ? 'text-purple-300' 
                      : 'text-gray-300 group-hover:text-purple-300'
                  }`}>
                    {portal.icon}
                  </div>
                  
                  {/* Selected indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full border-2 border-gray-900"
                    />
                  )}
                  
                  {/* Tooltip */}
                  <motion.div
                    className={`
                      absolute z-[180] px-2 py-1 bg-gray-900/95 text-gray-200 text-xs rounded whitespace-nowrap
                      opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none
                      border border-gray-600/30 shadow-lg backdrop-blur-sm
                      ${position === 'top' ? 'top-full mt-2 left-1/2 -translate-x-1/2' : ''}
                      ${position === 'bottom' ? 'bottom-full mb-2 left-1/2 -translate-x-1/2' : ''}
                      ${position === 'left' ? 'left-full ml-2 top-1/2 -translate-y-1/2' : ''}
                      ${position === 'right' ? 'right-full mr-2 top-1/2 -translate-y-1/2' : ''}
                    `}
                  >
                    <div className="flex items-center gap-1">
                      {isSelected && (
                        <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse" />
                      )}
                      {portal.title}
                    </div>
                    <div className="text-xs opacity-75 mt-1">
                      Single-click: Level 2, Double-click: Level 3
                    </div>
                  </motion.div>

                  {/* Glow effect */}
                  <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 blur-sm ${
                    isSelected ? 'bg-purple-400/20' : 'bg-purple-400/10'
                  }`} />
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}