import { useCallback } from 'react'
import { CommandResult } from '../services/jarvisAI'

interface UseCommandExecutorProps {
  onPortalAction: (action: string, payload: any) => void
  openPortalIds?: string[]
}

export function useCommandExecutor({ onPortalAction, openPortalIds = [] }: UseCommandExecutorProps) {
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
        console.log(`🗺️ Map navigation - Location: ${payload.location}, Zoom: ${payload.zoom_level}`)
        console.log(`🗺️ Map portal already open?`, openPortalIds.includes('map'))
        
        if (openPortalIds.includes('map')) {
          console.log(`🗺️ Map portal already open - updating context for navigation`)
          onPortalAction('update_portal_context', {
            portalId: 'map',
            context: {
              action: payload.action,
              location: payload.location,
              zoomLevel: payload.zoom_level
            }
          })
        } else {
          console.log(`🗺️ Map portal not open - opening with navigation context`)
          onPortalAction('open_portal', {
            portalId: 'map',
            level: payload.level || 2,
            isFullscreen: payload.level === 3,
            context: {
              action: payload.action,
              location: payload.location,
              zoomLevel: payload.zoom_level
            }
          })
        }
        break

      case 'expand_portal':
        console.log(`🤖 Kraken AI: Expanding portal: ${payload.portal_type}`)
        onPortalAction('expand_portal', {
          portalId: payload.portal_type
        })
        break

      case 'control_interface':
        console.log(`🤖 Kraken AI: Interface control: ${payload.action}`)
        onPortalAction('control_interface', {
          action: payload.action,
          setting: payload.setting
        })
        break

      case 'filter_alerts':
        console.log(`🤖 Kraken AI: Filtering alerts - Type: ${payload.alert_type}, Severity: ${payload.severity}`)
        onPortalAction('update_portal_context', {
          portalId: 'alerts',
          context: {
            action: 'filter_alerts',
            parameters: {
              type: payload.alert_type,
              severity: payload.severity,
              resolved: payload.show_resolved,
              sortBy: payload.sort_by
            }
          }
        })
        break

      case 'acknowledge_alert':
        console.log(`🤖 Kraken AI: Acknowledging alert - ID: ${payload.alert_id}, Title: ${payload.alert_title}`)
        onPortalAction('update_portal_context', {
          portalId: 'alerts',
          context: {
            action: 'acknowledge_alert',
            parameters: {
              alertId: payload.alert_id,
              alertTitle: payload.alert_title
            }
          }
        })
        break

      case 'resolve_alert':
        console.log(`🤖 Kraken AI: Resolving alert - ID: ${payload.alert_id}, Title: ${payload.alert_title}`)
        onPortalAction('update_portal_context', {
          portalId: 'alerts',
          context: {
            action: 'resolve_alert',
            parameters: {
              alertId: payload.alert_id,
              alertTitle: payload.alert_title
            }
          }
        })
        break

      case 'escalate_alert':
        console.log(`🤖 Kraken AI: Escalating alert - ID: ${payload.alert_id}, Title: ${payload.alert_title}`)
        onPortalAction('update_portal_context', {
          portalId: 'alerts',
          context: {
            action: 'escalate_alert',
            parameters: {
              alertId: payload.alert_id,
              alertTitle: payload.alert_title
            }
          }
        })
        break

      default:
        console.warn(`🤖 Kraken AI: Unknown command type: ${type}`)
    }
  }, [onPortalAction, openPortalIds])

  return { executeCommand }
} 