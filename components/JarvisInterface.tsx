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
import { useAlertsBackend, BackendAlert } from './hooks/useAlertsBackend'

// Portal configurations imported from constants file

export function KrakenInterface() {
  // AI panel state tracking
  const [isAIPanelActive, setIsAIPanelActive] = useState(false)
  // Keyboard shortcut trigger state
  const [shouldTriggerSearch, setShouldTriggerSearch] = useState(false)
  const [shouldTriggerAIPanel, setShouldTriggerAIPanel] = useState(false)
  // Immediate alert message state
  const [immediateAlertMessage, setImmediateAlertMessage] = useState<string | null>(null)
  // Flag to prevent AI panel from closing during alert scenarios
  const [isAlertScenario, setIsAlertScenario] = useState(false)

  // Initialize Kraken AI service
  const krakenAI = useMemo(() => new KrakenAI(), [])

  // Generate AI alert message
  const generateAlertMessage = (alert: BackendAlert): string => {
    const severityMap = {
      critical: 'CRITICAL',
      high: 'HIGH PRIORITY', 
      medium: 'MEDIUM PRIORITY',
      low: 'LOW PRIORITY'
    }
    
    const severity = severityMap[alert.severity] || 'UNKNOWN'
    const alertType = alert.type === 'threat' ? 'threat' : 'system'
    
    return `${severity} ${alertType} alert detected: ${alert.title}. ${alert.description} Location: ${alert.location || 'Unknown'}. Alerts portal opened for immediate assessment.`
  }

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
    openPortal,
    updatePortalContext
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
        console.log('🎹 Keyboard shortcut detected:', isCtrlShift2 ? 'Ctrl+Shift+2' : 'F2')
        
        // Check current portal state directly instead of relying on hasOpenPortals
        const currentHasOpenPortals = openPortals.length > 0 || fullscreenPortal !== null
        
        if (!currentHasOpenPortals) {
          // No portals open: trigger search field
          console.log('🎯 No portals open - triggering search field')
          setShouldTriggerSearch(true)
          // Reset the trigger after a brief moment
          setTimeout(() => setShouldTriggerSearch(false), 100)
        } else {
          // Portals open: trigger AI command panel in listening mode
          console.log('🎯 Portals open - triggering AI panel')
          setShouldTriggerAIPanel(true)
          setIsAIPanelActive(true)
          // Reset the trigger after a brief moment
          setTimeout(() => setShouldTriggerAIPanel(false), 100)
        }
      }
    }

    console.log('🎹 Keyboard shortcut listener registered')
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      console.log('🎹 Keyboard shortcut listener removed')
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, []) // Empty dependency array to prevent re-registration

  // Track if AI panel should be closed due to fullscreen portal (kept for compatibility)
  const [shouldCloseAIPanel, setShouldCloseAIPanel] = React.useState(false)
  // Track if we should restore AI panel (kept for compatibility)
  const [shouldRestoreAIPanel, setShouldRestoreAIPanel] = React.useState(false)

  // REMOVED RESTRICTION: AI assistant can now appear on top of Level 3 portals
  // This allows manual activation of Kraken AI even when fullscreen portals are open
  React.useEffect(() => {
    if (fullscreenPortal) {
      console.log('🎯 Fullscreen portal opened - AI assistant can still be activated manually')
      // No longer automatically close AI panel when fullscreen opens
      setShouldCloseAIPanel(false)
      setShouldRestoreAIPanel(false)
    } else {
      setShouldCloseAIPanel(false)
      // Reset alert scenario flag when fullscreen closes
      setIsAlertScenario(false)
      // No automatic restoration needed since we don't auto-close anymore
    }
  }, [fullscreenPortal, isAlertScenario])

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
          console.log(`🎯 Portal context:`, payload.context)
          
          // Create portal with context if provided
          const portalWithContext = payload.context ? { ...portal, context: payload.context } : portal
          
          if (payload.isFullscreen || payload.level === 3) {
            console.log(`🎯 Opening portal in fullscreen (level 3)`)
            openFullscreenPortal(portalWithContext)
          } else {
            // Check if portal is already open
            const existingPortal = openPortals.find(p => p.id === portal.id)
            if (!existingPortal) {
              console.log(`🎯 Opening portal in grid view (level 2) with AI panel state:`, isAIPanelActive)
              // Use openPortal instead of togglePortal to ensure grid logic is applied
              openPortal(portalWithContext)
            } else {
              console.log(`🎯 Portal already open:`, portal.id)
              // Update existing portal with new context if provided
              if (payload.context) {
                console.log(`🎯 Updating existing portal with new context`)
                const updatedPortal = { ...existingPortal, context: payload.context }
                closePortal(portal.id) // Close existing
                setTimeout(() => openPortal(updatedPortal), 100) // Reopen with context
              }
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

      case 'expand_portal':
        const portalToExpand = allPortals.find(p => p.id === payload.portalId)
        if (portalToExpand) {
          console.log(`🎯 Expanding portal to fullscreen:`, portalToExpand.title)
          // Check if portal is already open in grid
          const existingPortal = openPortals.find(p => p.id === portalToExpand.id)
          if (existingPortal) {
            // Expand existing portal to fullscreen
            handleExpandPortalToFullscreen(portalToExpand.id)
          } else {
            // Open portal directly in fullscreen if not already open
            openFullscreenPortal(portalToExpand)
          }
          console.log(`🎯 Portal expansion executed: ${payload.portalId}`)
        } else {
          console.warn(`🎯 Portal to expand not found: ${payload.portalId}`)
        }
        break
        
      case 'update_portal_context':
        console.log(`🎯 Updating portal context for: ${payload.portalId}`, payload.context)
        
        const wasUpdated = updatePortalContext(payload.portalId, payload.context)
        
        if (!wasUpdated) {
          console.log(`🎯 Portal not currently open, opening with context`)
          // Portal not open, open it with the context (fallback behavior)
          const portal = allPortals.find(p => p.id === payload.portalId)
          if (portal) {
            const portalWithContext = { ...portal, context: payload.context }
            openPortal(portalWithContext)
          }
        }
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
    onPortalAction: handlePortalAction,
    openPortalIds: openPortalIds
  })

  // Layout utilities
  const avatarPosition = getAvatarPosition()
  const { primaryGridStyle, secondaryGridStyle } = getGridStyles()
  
  // Wrapper for expandPortalToFullscreen to provide allPortals
  const handleExpandPortalToFullscreen = (portalId: string) => {
    expandPortalToFullscreen(portalId, allPortals)
  }

  // Backend alerts integration with callback for new alerts
  const handleNewAlert = React.useCallback((alert: BackendAlert) => {
    console.log('🚨 New alert received from backend:', alert)
    
    // Generate AI message about the new alert
    const aiMessage = generateAlertMessage(alert)
    console.log('🤖 Kraken AI alert message:', aiMessage)
    
    // SIMULTANEOUS ACTIONS: Activate AI panel AND open portal together
    console.log('🎬 Triggering simultaneous AI panel activation and portal opening')
    
    // 1. Set alert scenario flag to prevent AI panel from being closed
    setIsAlertScenario(true)
    
    // 2. Set immediate alert message for instant display
    setImmediateAlertMessage(aiMessage)
    
    // 3. Activate AI panel immediately
    setIsAIPanelActive(true)
    
    // 4. Open alerts portal to Level 3 immediately  
    const alertsPortal = allPortals.find(p => p.id === 'alerts')
    if (alertsPortal) {
      console.log('🎯 Opening alerts portal to Level 3 due to new alert')
      openFullscreenPortal(alertsPortal)
    }
    
    // 4. Process AI command for full response (this will show in the already-active AI panel)
    if (krakenAI) {
      krakenAI.processCommand(aiMessage, allPortals)
        .then((response: any) => {
          console.log('🤖 Kraken AI response to alert:', response)
          // Clear immediate message once full AI response is ready
          setImmediateAlertMessage(null)
        })
        .catch((error: any) => {
          console.error('🚨 Error processing alert with Kraken AI:', error)
          // Clear immediate message even on error
          setImmediateAlertMessage(null)
        })
    }
    
  }, [openFullscreenPortal, allPortals, generateAlertMessage, krakenAI, setIsAIPanelActive, setImmediateAlertMessage, setIsAlertScenario])

  const alertsBackend = useAlertsBackend({
    pollInterval: 5000, // 5 seconds to reduce server load
    autoStart: true,
    onNewAlert: handleNewAlert
  })

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
        className={(hasOpenPortals || isAIPanelActive) ? "absolute z-[300]" : ""}
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
        immediateMessage={immediateAlertMessage}
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