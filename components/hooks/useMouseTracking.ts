import { useState, useEffect } from 'react'

interface MousePosition {
  x: number
  y: number
}

interface TrayVisibility {
  bottom: boolean
  left: boolean
  right: boolean
}

/**
 * Custom hook for mouse tracking and tray visibility
 * Manages mouse position and determines which edge trays should be visible
 */
export function useMouseTracking() {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 })
  const [trayVisibility, setTrayVisibility] = useState<TrayVisibility>({
    bottom: false,
    left: false,
    right: false
  })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      
      // Calculate tray visibility based on mouse position near edge centers
      const edgeThreshold = 60 // How close to the edge
      const centerThreshold = 200 // How close to the center of the edge
      const { innerWidth, innerHeight } = window
      
      // Calculate center points
      const centerX = innerWidth / 2
      const centerY = (innerHeight - 24) / 2 + 24 // Account for classification banner
      
      setTrayVisibility({
        // Bottom tray: mouse near bottom edge AND near horizontal center
        bottom: e.clientY > innerHeight - edgeThreshold && 
                Math.abs(e.clientX - centerX) < centerThreshold,
        
        // Left tray: mouse near left edge AND near vertical center
        left: e.clientX < edgeThreshold && 
              Math.abs(e.clientY - centerY) < centerThreshold,
        
        // Right tray: mouse near right edge AND near vertical center
        right: e.clientX > innerWidth - edgeThreshold && 
               Math.abs(e.clientY - centerY) < centerThreshold
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return {
    mousePosition,
    trayVisibility
  }
} 