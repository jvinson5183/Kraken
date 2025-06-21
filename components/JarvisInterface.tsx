'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EdgeTray } from './EdgeTray'
import { PortalGrid } from './PortalGrid'
import { FullscreenPortal } from './FullscreenPortal'
import { KrakenAssistant } from './KrakenAssistant'
import { ClassificationBanner } from './ClassificationBanner'
import { UserProfile } from './UserProfile'
import { KrakenLogo } from './KrakenLogo'
import { CloseAllPortalsButton } from './CloseAllPortalsButton'

import { useMouseTracking } from './hooks/useMouseTracking'
import { usePortalState } from './hooks/usePortalState'
import { useCommandExecutor } from './hooks/useCommandExecutor'
import { getAvatarPosition, getGridStyles } from './utils/layoutUtils'
import { 
  EDGE_TRAY_CONFIG, 
  PortalData 
} from './constants/portalConfigs.tsx'
import { WeatherPortalProvider } from './portals/WeatherPortal'
import { KrakenAI } from './services/jarvisAI'

// Portal configurations imported from constants file

export function KrakenInterface() {
  // AI panel state tracking
  const [isAIPanelActive, setIsAIPanelActive] = useState(false)
  // Keyboard shortcut trigger state
  const [shouldTriggerSearch, setShouldTriggerSearch] = useState(false)
  const [shouldTriggerAIPanel, setShouldTriggerAIPanel] = useState(false)

  // Initialize Kraken AI service
  const krakenAI = useMemo(() => new KrakenAI(), [])

  // Custom hooks for state management
  const { mousePosition, trayVisibility } = useMouseTracking()
  
  // AI panel close handler
  const handleAIPanelClose = () => {
    setIsAIPanelActive(false)
  }
  
  const {
    openPortals,
    fullscreenPortal,
    openPortalIds,
    hasOpenPortals,
    togglePortal,
    closePortal,
    closeAllPortals,
    openFullscreenPortal,
    closeFullscreenPortal,
    expandPortalToFullscreen,
    openPortal
  } = usePortalState(isAIPanelActive, handleAIPanelClose)

  // Keyboard shortcut listener
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl+Shift+2 - try multiple detection methods
      const isCtrlShift2 = event.ctrlKey && event.shiftKey && (
        event.key === '2' || 
        event.key === '@' || 
        event.code === 'Digit2' || 
        event.keyCode === 50
      )
      
      // Alternative test shortcut: F2 key
      const isF2 = event.key === 'F2' || event.code === 'F2' || event.keyCode === 113
      
      if (isCtrlShift2 || isF2) {
        event.preventDefault()
        
        if (!hasOpenPortals) {
          // No portals open: trigger search field
          setShouldTriggerSearch(true)
          // Reset the trigger after a brief moment
          setTimeout(() => setShouldTriggerSearch(false), 100)
        } else {
          // Portals open: trigger AI command panel in listening mode
          setShouldTriggerAIPanel(true)
          setIsAIPanelActive(true)
          // Reset the trigger after a brief moment
          setTimeout(() => setShouldTriggerAIPanel(false), 100)
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [hasOpenPortals])

  // Track if AI panel should be closed due to fullscreen portal
  const [shouldCloseAIPanel, setShouldCloseAIPanel] = React.useState(false)
  // Track if AI panel was open before fullscreen portal opened
  const [wasAIPanelOpenBeforeFullscreen, setWasAIPanelOpenBeforeFullscreen] = React.useState(false)
  // Track if we should restore AI panel
  const [shouldRestoreAIPanel, setShouldRestoreAIPanel] = React.useState(false)

  // Close AI panel when fullscreen portal opens, restore when it closes
  React.useEffect(() => {
    if (fullscreenPortal) {
      // Remember if AI panel was active before closing it
      if (isAIPanelActive) {
        setWasAIPanelOpenBeforeFullscreen(true)
        setIsAIPanelActive(false)
      }
      setShouldCloseAIPanel(true)
      setShouldRestoreAIPanel(false)
    } else {
      setShouldCloseAIPanel(false)
      // Restore AI panel if it was open before fullscreen
      if (wasAIPanelOpenBeforeFullscreen) {
        setShouldRestoreAIPanel(true)
        setWasAIPanelOpenBeforeFullscreen(false)
      }
    }
  }, [fullscreenPortal, isAIPanelActive])

  // Reset restoration flag after it's been processed
  React.useEffect(() => {
    if (shouldRestoreAIPanel && isAIPanelActive) {
      setShouldRestoreAIPanel(false)
    }
  }, [shouldRestoreAIPanel, isAIPanelActive])

  // All portal state management functions are provided by usePortalState hook
  const allPortals = [...EDGE_TRAY_CONFIG.top, ...EDGE_TRAY_CONFIG.left, ...EDGE_TRAY_CONFIG.right]
  
  // Portal tray configurations
  const rightPortals = EDGE_TRAY_CONFIG.right // AI Engine Portals
  const bottomPortals = EDGE_TRAY_CONFIG.top // System portals in bottom tray
  const leftPortals = EDGE_TRAY_CONFIG.left // Specialized portals

  // Portal action handler for AI commands
  const handlePortalAction = (action: string, payload: any) => {
    console.log(`🎯 Portal action called: ${action}`, payload)
    console.log(`🎯 Current AI panel state:`, isAIPanelActive)
    console.log(`🎯 Current open portals:`, openPortals.map(p => p.id))
    
    switch (action) {
      case 'open_portal':
        const portal = allPortals.find(p => p.id === payload.portalId)
        if (portal) {
          console.log(`🎯 Found portal:`, portal.title)
          if (payload.isFullscreen || payload.level === 3) {
            console.log(`🎯 Opening portal in fullscreen (level 3)`)
            openFullscreenPortal(portal)
          } else {
            // Check if portal is already open
            const existingPortal = openPortals.find(p => p.id === portal.id)
            if (!existingPortal) {
              console.log(`🎯 Opening portal in grid view (level 2) with AI panel state:`, isAIPanelActive)
              // Use openPortal instead of togglePortal to ensure grid logic is applied
              openPortal(portal)
            } else {
              console.log(`🎯 Portal already open:`, portal.id)
            }
          }
          console.log(`🎯 Portal action executed: ${action}`, payload)
        } else {
          console.warn(`🎯 Portal not found: ${payload.portalId}`)
        }
        break
        
      case 'close_portal':
        closePortal(payload.portalId)
        console.log(`🎯 Portal action executed: ${action}`, payload)
        break
        
      case 'close_all_portals':
        closeAllPortals()
        console.log(`🎯 Portal action executed: ${action}`)
        break
        
      case 'control_interface':
        switch (payload.action) {
          case 'minimize_all':
            closeAllPortals()
            break
          case 'maximize_all':
            // Could implement opening multiple portals
            break
          default:
            console.log(`🎯 Interface control: ${payload.action}`)
        }
        break
        
      default:
        console.warn(`🎯 Unknown portal action: ${action}`)
    }
  }

  // Command executor hook
  const { executeCommand } = useCommandExecutor({
    onPortalAction: handlePortalAction
  })

  // Layout utilities
  const avatarPosition = getAvatarPosition()
  const { primaryGridStyle, secondaryGridStyle } = getGridStyles()
  
  // Wrapper for expandPortalToFullscreen to provide allPortals
  const handleExpandPortalToFullscreen = (portalId: string) => {
    expandPortalToFullscreen(portalId, allPortals)
  }

  return (
    <WeatherPortalProvider>
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Classification Banner */}
      <ClassificationBanner />

      {/* User Profile - Upper-right corner (login info only) */}
      <UserProfile />

      {/* Kraken Logo - Separate from user profile, no background */}
      <KrakenLogo />

      {/* Enhanced animated background grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={primaryGridStyle} />
      </div>

      {/* Secondary grid for depth */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute inset-0" style={secondaryGridStyle} />
      </div>

      {/* Glowing orb that follows mouse */}
      <motion.div
        className="absolute w-96 h-96 bg-gray-500/3 rounded-full blur-3xl pointer-events-none"
        animate={{
          x: mousePosition.x - 192,
          y: mousePosition.y - 192,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      />

      {/* Central Portal Grid - Hidden when in fullscreen */}
      <AnimatePresence>
        {!fullscreenPortal && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <PortalGrid 
              portals={openPortals} 
              onClosePortal={closePortal}
              onExpandPortal={handleExpandPortalToFullscreen}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edge Trays - No top tray, only right, bottom, and left */}
      <EdgeTray
        position="right"
        visible={trayVisibility.right}
        portals={rightPortals}
        openPortalIds={openPortalIds}
        onPortalClick={togglePortal}
        onPortalDoubleClick={openFullscreenPortal}
      />
      <EdgeTray
        position="bottom"
        visible={trayVisibility.bottom}
        portals={bottomPortals}
        openPortalIds={openPortalIds}
        onPortalClick={togglePortal}
        onPortalDoubleClick={openFullscreenPortal}
      />
      <EdgeTray
        position="left"
        visible={trayVisibility.left}
        portals={leftPortals}
        openPortalIds={openPortalIds}
        onPortalClick={togglePortal}
        onPortalDoubleClick={openFullscreenPortal}
      />

      {/* Fullscreen Portal - Level 3 */}
      <AnimatePresence>
        {fullscreenPortal && (
          <FullscreenPortal
            portal={fullscreenPortal}
            onClose={() => closePortal(fullscreenPortal.id)}
            onMinimize={closeFullscreenPortal}
          />
        )}
      </AnimatePresence>

      {/* Kraken AI Assistant - Center when no portals, top-left when portals open */}
      <KrakenAssistant
        hasOpenPortals={hasOpenPortals}
        mousePosition={mousePosition}
        className={(hasOpenPortals || isAIPanelActive) ? "absolute z-[200]" : ""}
        style={(hasOpenPortals || isAIPanelActive) ? {
          left: `${avatarPosition.left}px`,
          top: `${avatarPosition.top}px`
        } : undefined}
        krakenAI={krakenAI}
        availablePortals={allPortals}
        onCommandExecuted={executeCommand}
        onAIPanelStateChange={setIsAIPanelActive}
        shouldCloseAIPanel={shouldCloseAIPanel}
        shouldRestoreAIPanel={shouldRestoreAIPanel}
        shouldTriggerSearch={shouldTriggerSearch}
        shouldTriggerAIPanel={shouldTriggerAIPanel}
      />

      {/* Close All Portals Button - Bottom-left corner */}
      <AnimatePresence>
        <CloseAllPortalsButton 
          onCloseAll={closeAllPortals}
          hasOpenPortals={hasOpenPortals}
        />
      </AnimatePresence>

      {/* Subtle corner accents */}
      <div className="absolute top-6 right-0 w-32 h-32 bg-gradient-to-bl from-gray-600/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-gray-600/5 to-transparent pointer-events-none" />
      </div>
    </WeatherPortalProvider>
  )
}