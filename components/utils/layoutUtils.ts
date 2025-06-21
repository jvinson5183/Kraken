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
  const leftMargin = 24 // Distance from left edge
  
  // Position avatar below banner with proper spacing
  const topPosition = LAYOUT_CONSTANTS.CLASSIFICATION_BANNER_HEIGHT + LAYOUT_CONSTANTS.AVATAR_TOP_MARGIN
  
  return {
    left: leftMargin,
    top: topPosition // 24px (banner) + 16px (margin) = 40px from top
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
  AVATAR_TOP_MARGIN: 32, // Increased space below classification banner
  TRAY_PROXIMITY_THRESHOLD: 60,
  CLOSE_BUTTON_MARGIN: 16,
  USER_PROFILE_POSITION: { top: '56px', right: '64px' },
  KRAKEN_LOGO_POSITION: { bottom: '32px', right: '16px' }
} as const 