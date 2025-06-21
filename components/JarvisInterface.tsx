'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
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
import { getAvatarPosition, getGridStyles } from './utils/layoutUtils'
import { 
  EDGE_TRAY_CONFIG, 
  PortalData 
} from './constants/portalConfigs.tsx'
import { WeatherPortalProvider } from './portals/WeatherPortal'

// Portal configurations imported from constants file

export function JarvisInterface() {
  // Alert system state
  const [alertMessage, setAlertMessage] = useState<string>('')

  // Custom hooks for state management
  const { mousePosition, trayVisibility } = useMouseTracking()
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
    expandPortalToFullscreen
  } = usePortalState()

  // All portal state management functions are provided by usePortalState hook
  const allPortals = [...EDGE_TRAY_CONFIG.top, ...EDGE_TRAY_CONFIG.left, ...EDGE_TRAY_CONFIG.right]
  
  // Portal tray configurations
  const rightPortals = EDGE_TRAY_CONFIG.right // AI Engine Portals
  const bottomPortals = EDGE_TRAY_CONFIG.top // System portals in bottom tray
  const leftPortals = EDGE_TRAY_CONFIG.left // Specialized portals

  // Layout utilities
  const avatarPosition = getAvatarPosition()
  const { primaryGridStyle, secondaryGridStyle } = getGridStyles()
  
  // Wrapper for expandPortalToFullscreen to provide allPortals
  const handleExpandPortalToFullscreen = (portalId: string) => {
    expandPortalToFullscreen(portalId, allPortals)
  }

  // Alert system handlers
  const handleTestAlert = () => {
    setAlertMessage('Missile incoming.')
    
    // Automatically open camera at Level 3 (fullscreen)
    const cameraPortal = allPortals.find(p => p.id === 'camera-capability')
    if (cameraPortal) {
      openFullscreenPortal(cameraPortal)
    }
  }

  const handleAlertDismiss = () => {
    setAlertMessage('')
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
        className={hasOpenPortals || alertMessage ? "absolute z-[200]" : ""}
        style={(hasOpenPortals || alertMessage) ? {
          left: `${avatarPosition.left}px`,
          top: `${avatarPosition.top}px`
        } : undefined}
        alertMessage={alertMessage}
        onAlertDismiss={handleAlertDismiss}
      />

      {/* Close All Portals Button - Bottom-left corner */}
      <AnimatePresence>
        <CloseAllPortalsButton 
          onCloseAll={closeAllPortals}
          hasOpenPortals={hasOpenPortals}
        />
      </AnimatePresence>

      {/* Test Alert Button - Bottom-right corner */}
      <motion.button
        className="fixed bottom-4 right-4 w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg z-[200] transition-colors"
        onClick={handleTestAlert}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: "spring", damping: 20, stiffness: 300 }}
      >
        <AlertTriangle className="w-6 h-6" />
      </motion.button>

      {/* Subtle corner accents */}
      <div className="absolute top-6 right-0 w-32 h-32 bg-gradient-to-bl from-gray-600/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-gray-600/5 to-transparent pointer-events-none" />
      </div>
    </WeatherPortalProvider>
  )
}