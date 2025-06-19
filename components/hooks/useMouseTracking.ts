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
      
      // Calculate tray visibility based on mouse position (excluding top)
      const threshold = 60
      const { innerWidth, innerHeight } = window
      
      setTrayVisibility({
        bottom: e.clientY > innerHeight - threshold,
        left: e.clientX < threshold,
        right: e.clientX > innerWidth - threshold
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