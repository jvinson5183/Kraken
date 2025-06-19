'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Portal } from './Portal'
import { PortalData } from './JarvisInterface'

interface PortalGridProps {
  portals: PortalData[]
  onClosePortal: (portalId: string) => void
  onExpandPortal: (portalId: string) => void
}

export function PortalGrid({ portals, onClosePortal, onExpandPortal }: PortalGridProps) {
  const [gridDimensions, setGridDimensions] = useState({
    width: 0,
    height: 0,
    cellWidth: 0,
    cellHeight: 0
  })

  useEffect(() => {
    const calculateGridDimensions = () => {
      const { innerWidth, innerHeight } = window
      
      // Conservative padding to ensure grid fits and trays have space
      const padding = 120 // Space for trays + margins
      const bannerHeight = 24 // h-6 = 24px for classification banner
      const gridGap = 16 // Gap between grid cells (gap-4 = 16px)
      
      // Calculate available space with conservative padding and banner height
      const availableWidth = innerWidth - (padding * 2)
      const availableHeight = innerHeight - (padding * 2) - bannerHeight
      
      // Calculate cell dimensions for 3x3 grid
      const cellWidth = Math.max((availableWidth - (gridGap * 2)) / 3, 200) // Min 200px width
      const cellHeight = Math.max((availableHeight - (gridGap * 2)) / 3, 200) // Min 200px height
      
      // Calculate final grid dimensions
      const gridWidth = (cellWidth * 3) + (gridGap * 2)
      const gridHeight = (cellHeight * 3) + (gridGap * 2)
      
      // Ensure grid doesn't exceed viewport
      const maxWidth = innerWidth - 100 // Leave some margin
      const maxHeight = innerHeight - 100 // Leave some margin
      
      setGridDimensions({
        width: Math.min(gridWidth, maxWidth),
        height: Math.min(gridHeight, maxHeight),
        cellWidth: Math.min(cellWidth, (maxWidth - (gridGap * 2)) / 3),
        cellHeight: Math.min(cellHeight, (maxHeight - (gridGap * 2)) / 3)
      })
    }

    calculateGridDimensions()
    window.addEventListener('resize', calculateGridDimensions)
    
    return () => window.removeEventListener('resize', calculateGridDimensions)
  }, [])

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <div 
        className="grid grid-cols-3 grid-rows-3 gap-4"
        style={{
          width: `${gridDimensions.width}px`,
          height: `${gridDimensions.height}px`
        }}
      >
        {Array.from({ length: 9 }).map((_, index) => {
          const row = Math.floor(index / 3)
          const col = index % 3
          const portal = portals.find(p => p.position?.row === row && p.position?.col === col)

          return (
            <div 
              key={`${row}-${col}`} 
              className="relative"
              style={{
                width: `${gridDimensions.cellWidth}px`,
                height: `${gridDimensions.cellHeight}px`
              }}
            >
              <AnimatePresence mode="wait">
                {portal && (
                  <motion.div
                    key={portal.id}
                    initial={{ scale: 0, opacity: 0, rotateY: 90 }}
                    animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                    exit={{ scale: 0, opacity: 0, rotateY: -90 }}
                    transition={{ 
                      type: "spring", 
                      damping: 20, 
                      stiffness: 300,
                      opacity: { duration: 0.2 }
                    }}
                    className="w-full h-full"
                  >
                    <Portal
                      portal={portal}
                      onClose={() => onClosePortal(portal.id)}
                      onExpand={() => onExpandPortal(portal.id)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}