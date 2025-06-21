import { useCallback } from 'react'
import { CommandResult } from '../services/jarvisAI'

interface UseCommandExecutorProps {
  onPortalAction: (action: string, payload: any) => void
}

export function useCommandExecutor({ onPortalAction }: UseCommandExecutorProps) {
  const executeCommand = useCallback((result: CommandResult) => {
    if (!result.success || !result.action) return

    const { type, payload } = result.action

    switch (type) {
      case 'open_portal':
        console.log(`🤖 Kraken AI: Opening ${payload.portal_type} portal at level ${payload.level || 2}`)
        console.log(`🤖 Kraken AI: isFullscreen flag:`, payload.level === 3)
        console.log(`🤖 Kraken AI: Portal ID being sent:`, payload.portal_type)
        console.log(`🤖 Kraken AI: Full payload:`, payload)
        onPortalAction('open_portal', {
          portalId: payload.portal_type,
          level: payload.level || 2,
          isFullscreen: payload.level === 3
        })
        break

      case 'close_portal':
        console.log(`🤖 Kraken AI: Closing ${payload.portal_type} portal`)
        if (payload.portal_type === 'all') {
          onPortalAction('close_all_portals', {})
        } else {
          onPortalAction('close_portal', {
            portalId: payload.portal_type
          })
        }
        break

      case 'show_weather':
        console.log(`🤖 Kraken AI: Showing weather for ${payload.location || 'current location'}`)
        onPortalAction('open_portal', {
          portalId: 'weather',
          level: payload.level || 2,
          isFullscreen: payload.level === 3,
          context: { location: payload.location }
        })
        break

      case 'analyze_threats':
        console.log(`🤖 Kraken AI: Analyzing threats with ${payload.severity_filter || 'all'} severity`)
        onPortalAction('open_portal', {
          portalId: 'alerts',
          level: 2,
          context: { 
            severityFilter: payload.severity_filter,
            threatType: payload.threat_type 
          }
        })
        break

      case 'navigate_map':
        console.log(`🤖 Kraken AI: Performing map action: ${payload.action}`)
        onPortalAction('open_portal', {
          portalId: 'map',
          level: 2,
          context: {
            action: payload.action,
            location: payload.location,
            zoomLevel: payload.zoom_level
          }
        })
        break

      case 'control_interface':
        console.log(`🤖 Kraken AI: Interface control: ${payload.action}`)
        onPortalAction('control_interface', {
          action: payload.action,
          setting: payload.setting
        })
        break

      default:
        console.warn(`🤖 Kraken AI: Unknown command type: ${type}`)
    }
  }, [onPortalAction])

  return { executeCommand }
} 