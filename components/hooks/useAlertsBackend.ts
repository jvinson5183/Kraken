import { useState, useEffect, useCallback, useRef } from 'react'

export interface BackendAlert {
  id: string
  type: 'threat' | 'system'
  severity: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  source: string
  location: string
  timestamp: string
  status: 'active' | 'acknowledged' | 'resolved' | 'escalated'
  metadata: any
  threatLevel?: string
  affectedSystems?: string[]
  recommendations?: string[]
}

export interface AlertsBackendState {
  alerts: BackendAlert[]
  isConnected: boolean
  isLoading: boolean
  error: string | null
  totalCount: number
}

interface UseAlertsBackendOptions {
  pollInterval?: number // milliseconds
  autoStart?: boolean
  onNewAlert?: (alert: BackendAlert) => void
}

const BACKEND_URL = 'http://localhost:5000'

export function useAlertsBackend(options: UseAlertsBackendOptions = {}) {
  const {
    pollInterval = 5000, // Poll every 5 seconds to reduce server load
    autoStart = true,
    onNewAlert
  } = options

  // Generate unique instance ID for debugging
  const instanceId = useRef(Math.random().toString(36).substr(2, 9))

  const [state, setState] = useState<AlertsBackendState>({
    alerts: [],
    isConnected: false,
    isLoading: false,
    error: null,
    totalCount: 0
  })

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastAlertCountRef = useRef(0)
  const isPollingRef = useRef(false)
  const isInitialLoadRef = useRef(true)
  const isFetchingRef = useRef(false)

  // Fetch alerts from backend
  const fetchAlerts = useCallback(async () => {
    // Prevent multiple simultaneous requests
    if (isFetchingRef.current) {
      console.log(`⏭️ [${instanceId.current}] Skipping fetch - already in progress`)
      return
    }
    
    try {
      isFetchingRef.current = true
      setState(prev => ({ ...prev, isLoading: true, error: null }))

      const response = await fetch(`${BACKEND_URL}/scenarios`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      // Check for new alerts (but not on initial load)
      const newAlertCount = data.total_count
      const hadNewAlerts = newAlertCount > lastAlertCountRef.current
      
      console.log(`🔍 [${instanceId.current}] Alert Detection Debug:`)
      console.log(`  Current count: ${newAlertCount}`)
      console.log(`  Previous count: ${lastAlertCountRef.current}`)
      console.log(`  Had new alerts: ${hadNewAlerts}`)
      console.log(`  Is initial load: ${isInitialLoadRef.current}`)
      console.log(`  Has callback: ${!!onNewAlert}`)
      
      if (hadNewAlerts && data.alerts.length > 0 && !isInitialLoadRef.current) {
        // Find the newest alert(s)
        const sortedAlerts = [...data.alerts].sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        
        // Trigger callback for new alert
        if (onNewAlert && sortedAlerts[0]) {
          console.log(`🚨 [${instanceId.current}] New alert detected, triggering callback:`, sortedAlerts[0].title)
          onNewAlert(sortedAlerts[0])
        } else {
          console.log(`⚠️ [${instanceId.current}] New alert detected but callback not triggered`)
        }
      } else if (hadNewAlerts && isInitialLoadRef.current) {
        console.log(`📝 [${instanceId.current}] Skipping callback - initial load`)
      }
      
      // Update refs
      lastAlertCountRef.current = newAlertCount
      isInitialLoadRef.current = false

      setState(prev => ({
        ...prev,
        alerts: data.alerts || [],
        totalCount: data.total_count || 0,
        isConnected: true,
        isLoading: false,
        error: null
      }))

    } catch (error) {
      console.error('Failed to fetch alerts:', error)
      setState(prev => ({
        ...prev,
        isConnected: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }))
    } finally {
      isFetchingRef.current = false
    }
  }, [onNewAlert])

  // Start polling
  const startPolling = useCallback(() => {
    if (isPollingRef.current) {
      console.log(`⚠️ [${instanceId.current}] Polling already running, skipping start`)
      return
    }

    // Ensure any existing interval is cleared
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
      pollIntervalRef.current = null
    }

    isPollingRef.current = true
    isInitialLoadRef.current = true // Reset initial load flag
    
    // Initial fetch
    fetchAlerts()
    
    // Set up polling interval
    pollIntervalRef.current = setInterval(fetchAlerts, pollInterval)
    
    console.log(`🔄 [${instanceId.current}] Started polling alerts backend every ${pollInterval}ms`)
  }, [fetchAlerts, pollInterval])

  // Stop polling
  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
      pollIntervalRef.current = null
    }
    isPollingRef.current = false
    
    setState(prev => ({ ...prev, isConnected: false }))
    console.log(`⏹️ [${instanceId.current}] Stopped polling alerts backend`)
  }, [])

  // Update alert status
  const updateAlertStatus = useCallback(async (alertId: string, status: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/scenarios/${alertId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      })

      if (!response.ok) {
        throw new Error(`Failed to update alert status: ${response.statusText}`)
      }

      // Refresh alerts after update
      await fetchAlerts()

      return true
    } catch (error) {
      console.error('Failed to update alert status:', error)
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to update alert'
      }))
      return false
    }
  }, [fetchAlerts])

  // Clear all alerts
  const clearAllAlerts = useCallback(async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/scenarios`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error(`Failed to clear alerts: ${response.statusText}`)
      }

      // Reset local state
      setState(prev => ({
        ...prev,
        alerts: [],
        totalCount: 0,
        error: null
      }))
      
      lastAlertCountRef.current = 0
      isInitialLoadRef.current = true // Reset initial load flag

      return true
    } catch (error) {
      console.error('Failed to clear alerts:', error)
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to clear alerts'
      }))
      return false
    }
  }, [])

  // Test backend connection
  const testConnection = useCallback(async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/health`)
      return response.ok
    } catch {
      return false
    }
  }, [])

  // Auto-start polling
  useEffect(() => {
    console.log(`🎬 [${instanceId.current}] useEffect triggered, autoStart: ${autoStart}`)
    
    if (autoStart) {
      startPolling()
    }

    // Cleanup on unmount AND on dependency changes (HMR)
    return () => {
      console.log(`🧹 [${instanceId.current}] Cleanup triggered - stopping polling`)
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
        pollIntervalRef.current = null
      }
      isPollingRef.current = false
    }
  }, [autoStart]) // Only depend on autoStart, not the functions

  return {
    ...state,
    startPolling,
    stopPolling,
    updateAlertStatus,
    clearAllAlerts,
    testConnection,
    refreshAlerts: fetchAlerts,
    isPolling: isPollingRef.current
  }
} 