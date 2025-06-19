'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EdgeTray } from './EdgeTray'
import { PortalGrid } from './PortalGrid'
import { FullscreenPortal } from './FullscreenPortal'
import { AvatarSelector, AvatarType } from './AvatarSelector'
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

// Portal configurations imported from constants file

export function JarvisInterface() {
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarType>('kraken-eye')

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

  return (
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
            onClose={closeFullscreenPortal}
          />
        )}
      </AnimatePresence>

      {/* AI Avatar Selector - Always visible in upper-left corner */}
      <div 
        className="absolute z-[200]"
        style={{
          left: `${avatarPosition.left}px`,
          top: `${avatarPosition.top}px`
        }}
      >
        <AvatarSelector
          selectedAvatar={selectedAvatar}
          onSelectAvatar={setSelectedAvatar}
          mousePosition={mousePosition}
        />
      </div>

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
  )
}