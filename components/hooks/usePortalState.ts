import { useState, useEffect } from 'react'
import { PortalData } from '../constants/portalConfigs.tsx'

/**
 * Custom hook for managing portal state
 * Handles opening, closing, and positioning of portals
 */
export function usePortalState(isAIPanelActive?: boolean, onAIPanelClose?: () => void) {
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

  // Handle repositioning of existing portals when AI panel state changes
  useEffect(() => {
    if (openPortals.length > 0) {
      console.log('🔄 Repositioning portals due to AI panel state change. AI Panel Active:', isAIPanelActive)
      
      // Get the preferred positions for current AI panel state
      const preferredPositions = isAIPanelActive 
        ? [
            { row: 0, col: 1 }, // Position 1 -> Grid space 2
            { row: 0, col: 2 }, // Position 2 -> Grid space 3
            { row: 1, col: 1 }, // Position 4 -> Grid space 5
            { row: 1, col: 2 }, // Position 5 -> Grid space 6
            { row: 2, col: 0 }, // Position 6 -> Grid space 7
            { row: 2, col: 1 }, // Position 7 -> Grid space 8
            { row: 2, col: 2 }, // Position 8 -> Grid space 9
            { row: 1, col: 0 }, // Position 3 -> Grid space 4 (fallback)
            { row: 0, col: 0 }, // Position 0 -> Grid space 1 (last resort)
          ]
        : [
            // Normal order when AI panel is not active
            { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 },
            { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 },
            { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }
          ]
      
      // Reposition all open portals according to the new preferred positions
      setOpenPortals(prev => {
        return prev.map((portal, index) => ({
          ...portal,
          position: preferredPositions[index] || { row: 2, col: 2 } // Fallback to bottom-right
        }))
      })
    }
  }, [isAIPanelActive]) // Only trigger when AI panel state changes

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
    // Close AI panel when opening fullscreen portal (level 3)
    if (onAIPanelClose) {
      onAIPanelClose()
    }
  }

  const closeFullscreenPortal = () => {
    setFullscreenPortal(null)
  }

  const expandPortalToFullscreen = (portalId: string, allPortals: PortalData[]) => {
    const portal = openPortals.find(p => p.id === portalId) || allPortals.find(p => p.id === portalId)
    if (portal) {
      setFullscreenPortal(portal)
      // Close AI panel when expanding to fullscreen (level 3)
      if (onAIPanelClose) {
        onAIPanelClose()
      }
    }
  }

  const getNextAvailablePosition = () => {
    const occupiedPositions = openPortals.map(p => `${p.position?.row}-${p.position?.col}`)
    
    // Define preferred positions when AI panel is active
    // Grid layout (0-indexed): 0 1 2
    //                          3 4 5  
    //                          6 7 8
    // When AI panel is active, use positions 2, 3, 5, 6, 7 (grid spaces 2, 3, 5, 6, 7 in 1-indexed)
    const preferredPositions = isAIPanelActive 
      ? [
          { row: 0, col: 1 }, // Position 1 -> Grid space 2
          { row: 0, col: 2 }, // Position 2 -> Grid space 3
          { row: 1, col: 1 }, // Position 4 -> Grid space 5
          { row: 1, col: 2 }, // Position 5 -> Grid space 6
          { row: 2, col: 0 }, // Position 6 -> Grid space 7
          { row: 2, col: 1 }, // Position 7 -> Grid space 8
          { row: 2, col: 2 }, // Position 8 -> Grid space 9
          { row: 1, col: 0 }, // Position 3 -> Grid space 4 (fallback)
          { row: 0, col: 0 }, // Position 0 -> Grid space 1 (last resort)
        ]
      : [
          // Normal order when AI panel is not active
          { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 },
          { row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 },
          { row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }
        ]
    
    for (const position of preferredPositions) {
      const positionKey = `${position.row}-${position.col}`
      if (!occupiedPositions.includes(positionKey)) {
        return position
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