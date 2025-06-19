/**
 * Layout utility functions for positioning calculations
 * Provides consistent positioning logic across the application
 */

export interface Position {
  left?: number | string
  top?: number | string
  right?: number | string
  bottom?: number | string
}

/**
 * Calculate avatar position accounting for classification banner and grid padding
 */
export function getAvatarPosition(): Position {
  // Conservative padding (matching PortalGrid calculations)
  const padding = 120
  const bannerHeight = 24 // h-6 = 24px for classification banner
  
  // Avatar position - upper-left corner with margin, below banner
  const avatarSize = 96 // w-24 = 96px
  const leftMargin = 24 // Distance from left edge
  const topPosition = padding - avatarSize - 16 + bannerHeight // Bottom of avatar 16px above grid area, account for banner
  
  return {
    left: leftMargin,
    top: Math.max(bannerHeight + 8, topPosition) // Ensure minimum distance below banner
  }
}

/**
 * Get grid background styles for military aesthetic
 */
export function getGridStyles() {
  const primaryGridStyle = {
    backgroundImage: 'linear-gradient(rgba(156, 163, 175, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(156, 163, 175, 0.3) 1px, transparent 1px)',
    backgroundSize: '40px 40px'
  }

  const secondaryGridStyle = {
    backgroundImage: 'linear-gradient(rgba(156, 163, 175, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(156, 163, 175, 0.1) 1px, transparent 1px)',
    backgroundSize: '120px 120px'
  }

  return {
    primaryGridStyle,
    secondaryGridStyle
  }
}

/**
 * Constants for layout dimensions
 */
export const LAYOUT_CONSTANTS = {
  CLASSIFICATION_BANNER_HEIGHT: 24,
  GRID_PADDING: 120,
  AVATAR_SIZE: 96,
  TRAY_PROXIMITY_THRESHOLD: 60,
  CLOSE_BUTTON_MARGIN: 16,
  USER_PROFILE_POSITION: { top: '32px', right: '64px' },
  KRAKEN_LOGO_POSITION: { top: '32px', right: '16px' }
} as const 