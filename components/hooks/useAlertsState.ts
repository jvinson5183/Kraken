import { useState, useCallback } from 'react'

// Alert interfaces (matching AlertsPortal.tsx)
export interface ThreatAlert {
  id: string
  timestamp: Date
  type: 'drone' | 'aircraft' | 'missile' | 'ram' | 'unknown'
  severity: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  location: string
  coordinates?: [number, number]
  speed?: number
  heading?: number
  altitude?: number
  trajectory?: [number, number][]
  confidence: number
  source: string
  status: 'active' | 'resolved' | 'acknowledged' | 'escalated'
  threatLevel: 'imminent' | 'probable' | 'possible' | 'unlikely'
  estimatedImpact?: Date
  countermeasures?: string[]
}

export interface SystemAlert {
  id: string
  timestamp: Date
  type: 'sensor' | 'effector' | 'network' | 'power' | 'communication' | 'cyber' | 'ammo' | 'interop'
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
  title: string
  description: string
  system: string
  component?: string
  status: 'active' | 'resolved' | 'maintenance' | 'acknowledged'
  affectedSystems?: string[]
  remediationSteps?: string[]
  estimatedRepair?: Date
}

export interface AlertSettings {
  audioEnabled: boolean
  visualEnabled: boolean
  hapticEnabled: boolean
  autoAcknowledge: boolean
  escalationTimeout: number
  priorityFilter: string
  roleBasedFilter: string
}

// Sample data (same as AlertsPortal.tsx)
const SAMPLE_THREAT_ALERTS: ThreatAlert[] = [
  {
    id: 'threat-001',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    type: 'drone',
    severity: 'high',
    title: 'Hostile UAS Detected',
    description: 'Multiple small drones approaching from northeast sector',
    location: 'Grid 345.127',
    coordinates: [32.0853, 34.7818],
    speed: 45,
    heading: 225,
    altitude: 150,
    confidence: 92,
    source: 'Sentinel Radar',
    status: 'active',
    threatLevel: 'probable',
    estimatedImpact: new Date(Date.now() + 3 * 60 * 1000),
    countermeasures: ['C-UAS Engagement', 'Electronic Jamming']
  },
  {
    id: 'threat-002',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    type: 'missile',
    severity: 'critical',
    title: 'Incoming Ballistic Threat',
    description: 'Long-range ballistic missile detected on intercept course',
    location: 'Grid 234.889',
    coordinates: [32.4000, 35.2000],
    speed: 1200,
    heading: 180,
    altitude: 25000,
    confidence: 98,
    source: 'TPY-2 Radar',
    status: 'active',
    threatLevel: 'imminent',
    estimatedImpact: new Date(Date.now() + 8 * 60 * 1000),
    countermeasures: ['Iron Dome', 'David\'s Sling', 'Arrow System']
  },
  {
    id: 'threat-003',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    type: 'aircraft',
    severity: 'medium',
    title: 'Unknown Aircraft Contact',
    description: 'Unidentified aircraft in restricted airspace',
    location: 'Zone Alpha-7',
    coordinates: [32.1200, 34.8500],
    speed: 350,
    heading: 90,
    altitude: 8000,
    confidence: 75,
    source: 'Air Defense Radar',
    status: 'acknowledged',
    threatLevel: 'possible',
    countermeasures: ['Intercept Mission', 'IFF Interrogation']
  }
]

const SAMPLE_SYSTEM_ALERTS: SystemAlert[] = [
  {
    id: 'sys-001',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    type: 'sensor',
    severity: 'critical',
    title: 'Primary Radar Offline',
    description: 'Sentinel radar system has lost power and is not responding',
    system: 'Sentinel Radar Array',
    component: 'Power Supply Unit',
    status: 'active',
    affectedSystems: ['Threat Detection', 'Air Picture'],
    remediationSteps: ['Check power connections', 'Reset system', 'Contact maintenance'],
    estimatedRepair: new Date(Date.now() + 30 * 60 * 1000)
  },
  {
    id: 'sys-002',
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    type: 'network',
    severity: 'high',
    title: 'Link 16 Connection Degraded',
    description: 'Intermittent connectivity issues with tactical data network',
    system: 'Link 16 Terminal',
    status: 'active',
    affectedSystems: ['Data Sharing', 'Situational Awareness'],
    remediationSteps: ['Check network cables', 'Restart terminal', 'Switch to backup']
  },
  {
    id: 'sys-003',
    timestamp: new Date(Date.now() - 20 * 60 * 1000),
    type: 'ammo',
    severity: 'medium',
    title: 'Low Interceptor Count',
    description: 'Iron Dome battery has less than 25% interceptors remaining',
    system: 'Iron Dome Battery Alpha',
    status: 'acknowledged',
    affectedSystems: ['Air Defense Capability']
  }
]

// Global state for alerts (persists across component mounts/unmounts)
let alertsState = {
  threatAlerts: SAMPLE_THREAT_ALERTS,
  systemAlerts: SAMPLE_SYSTEM_ALERTS,
  selectedAlertType: 'all',
  selectedSeverity: 'all',
  showResolved: false,
  settings: {
    audioEnabled: true,
    visualEnabled: true,
    hapticEnabled: false,
    autoAcknowledge: false,
    escalationTimeout: 300,
    priorityFilter: 'medium',
    roleBasedFilter: 'tactical'
  } as AlertSettings,
  sortBy: 'timestamp',
  refreshInterval: 5000
}

// Custom hook to manage alerts state
export function useAlertsState() {
  const [state, setState] = useState(alertsState)

  // Update global state whenever local state changes
  const updateState = useCallback((newState: Partial<typeof alertsState>) => {
    alertsState = { ...alertsState, ...newState }
    setState(alertsState)
  }, [])

  const setSelectedAlertType = useCallback((type: string) => {
    updateState({ selectedAlertType: type })
  }, [updateState])

  const setSelectedSeverity = useCallback((severity: string) => {
    updateState({ selectedSeverity: severity })
  }, [updateState])

  const setShowResolved = useCallback((show: boolean) => {
    updateState({ showResolved: show })
  }, [updateState])

  const setSettings = useCallback((settingsOrUpdater: AlertSettings | ((prev: AlertSettings) => AlertSettings)) => {
    const newSettings = typeof settingsOrUpdater === 'function' 
      ? settingsOrUpdater(alertsState.settings)
      : settingsOrUpdater
    updateState({ settings: newSettings })
  }, [updateState])

  const setSortBy = useCallback((sort: string) => {
    updateState({ sortBy: sort })
  }, [updateState])

  const setRefreshInterval = useCallback((interval: number) => {
    updateState({ refreshInterval: interval })
  }, [updateState])

  const updateAlertStatus = useCallback((alertId: string, status: 'active' | 'resolved' | 'acknowledged' | 'escalated') => {
    const updatedThreatAlerts = alertsState.threatAlerts.map(alert =>
      alert.id === alertId ? { ...alert, status } : alert
    )
    const updatedSystemAlerts = alertsState.systemAlerts.map(alert =>
      alert.id === alertId ? { ...alert, status: status as any } : alert
    )
    updateState({ 
      threatAlerts: updatedThreatAlerts,
      systemAlerts: updatedSystemAlerts
    })
  }, [updateState])

  const handleAcknowledgeAlert = useCallback((alertId: string) => {
    updateAlertStatus(alertId, 'acknowledged')
  }, [updateAlertStatus])

  const handleResolveAlert = useCallback((alertId: string) => {
    updateAlertStatus(alertId, 'resolved')
  }, [updateAlertStatus])

  const handleEscalateAlert = useCallback((alertId: string) => {
    updateAlertStatus(alertId, 'escalated')
  }, [updateAlertStatus])

  return {
    // State
    threatAlerts: state.threatAlerts,
    systemAlerts: state.systemAlerts,
    selectedAlertType: state.selectedAlertType,
    selectedSeverity: state.selectedSeverity,
    showResolved: state.showResolved,
    settings: state.settings,
    sortBy: state.sortBy,
    refreshInterval: state.refreshInterval,
    
    // Actions
    setSelectedAlertType,
    setSelectedSeverity,
    setShowResolved,
    setSettings,
    setSortBy,
    setRefreshInterval,
    handleAcknowledgeAlert,
    handleResolveAlert,
    handleEscalateAlert
  }
} 