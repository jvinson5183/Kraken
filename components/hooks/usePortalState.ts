import { useState, useEffect } from 'react'
import { PortalData } from '../constants/portalConfigs.tsx'

/**
 * Custom hook for managing portal state
 * Handles opening, closing, and positioning of portals
 */
export function usePortalState() {
  const [openPortals, setOpenPortals] = useState<PortalData[]>([])
  const [fullscreenPortal, setFullscreenPortal] = useState<PortalData | null>(null)

  // Handle ESC key to close fullscreen portal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && fullscreenPortal) {
        setFullscreenPortal(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [fullscreenPortal])

  const togglePortal = (portal: PortalData) => {
    // Check if portal is already open in grid
    const existingPortal = openPortals.find(p => p.id === portal.id)
    
    if (existingPortal) {
      // Close portal if already open
      closePortal(portal.id)
    } else {
      // Open portal if not already open
      openPortal(portal)
    }
  }

  const openPortal = (portal: PortalData) => {
    const nextPosition = getNextAvailablePosition()
    if (!nextPosition) return

    const newPortal = { ...portal, position: nextPosition }
    setOpenPortals(prev => [...prev, newPortal])
  }

  const closePortal = (portalId: string) => {
    setOpenPortals(prev => prev.filter(portal => portal.id !== portalId))
    // Also clear fullscreen if this portal is currently fullscreen
    setFullscreenPortal(prev => prev?.id === portalId ? null : prev)
  }

  const closeAllPortals = () => {
    setOpenPortals([])
    setFullscreenPortal(null)
  }

  const openFullscreenPortal = (portal: PortalData) => {
    setFullscreenPortal(portal)
  }

  const closeFullscreenPortal = () => {
    setFullscreenPortal(null)
  }

  const expandPortalToFullscreen = (portalId: string, allPortals: PortalData[]) => {
    const portal = openPortals.find(p => p.id === portalId) || allPortals.find(p => p.id === portalId)
    if (portal) {
      setFullscreenPortal(portal)
    }
  }

  const getNextAvailablePosition = () => {
    const occupiedPositions = openPortals.map(p => `${p.position?.row}-${p.position?.col}`)
    
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (!occupiedPositions.includes(`${row}-${col}`)) {
          return { row, col }
        }
      }
    }
    return null
  }

  // Get all open portal IDs for selected state
  const openPortalIds = [
    ...openPortals.map(p => p.id),
    ...(fullscreenPortal ? [fullscreenPortal.id] : [])
  ]

  // Check if there are any open portals (either in grid or fullscreen)
  const hasOpenPortals = openPortals.length > 0 || fullscreenPortal !== null

  return {
    openPortals,
    fullscreenPortal,
    openPortalIds,
    hasOpenPortals,
    togglePortal,
    openPortal,
    closePortal,
    closeAllPortals,
    openFullscreenPortal,
    closeFullscreenPortal,
    expandPortalToFullscreen
  }
} 