import { 
  Activity, 
  Cloud, 
  Calendar, 
  MessageSquare, 
  Settings, 
  Shield, 
  Zap, 
  Network,
  Radio,
  Music,
  FileText,
  Map,
  Clock,
  Bell,
  Eye,
  BarChart3
} from 'lucide-react'

import Group from '../../imports/Group'
import GroupConfidence from '../../imports/Group-2016-40'
import GroupPrioritization from '../../imports/Group-2016-62'
import GroupCOA from '../../imports/Group-2016-86'
import Vector from '../../imports/Vector'
import Group73073 from '../../imports/Group73073'
import GroupContextCorrelator from '../../imports/Group-2018-78'

export interface PortalData {
  id: string
  type: string
  title: string
  icon: React.ReactNode
  position?: { row: number; col: number }
  category: 'system' | 'specialized' | 'ai-engine'
  description?: string
  context?: {
    action?: 'zoom_to' | 'show_threats' | 'show_assets' | 'center_on' | 'filter_alerts' | 'acknowledge_alert' | 'resolve_alert' | 'escalate_alert' | 'sort_alerts'
    location?: string
    zoomLevel?: number
    parameters?: any
  }
}

/**
 * System Portals - Top Tray
 * Core system monitoring and control functions
 */
export const SYSTEM_PORTALS: PortalData[] = [
  { 
    id: 'system', 
    type: 'system', 
    title: 'System Status', 
    icon: <Activity className="w-6 h-6" />,
    category: 'system',
    description: 'CPU, memory, storage, network metrics'
  },
  { 
    id: 'weather', 
    type: 'weather', 
    title: 'Weather', 
    icon: <Cloud className="w-6 h-6" />,
    category: 'system',
    description: 'Current conditions, forecasts, NOAA data'
  },
  { 
    id: 'calendar', 
    type: 'calendar', 
    title: 'Calendar', 
    icon: <Calendar className="w-6 h-6" />,
    category: 'system',
    description: 'Schedule, events, mission timeline'
  },
  { 
    id: 'network-diagram', 
    type: 'network-diagram', 
    title: 'Network Diagram', 
    icon: <Network className="w-6 h-6" />,
    category: 'system',
    description: 'Network topology and traffic flow'
  },
  { 
    id: 'data-links', 
    type: 'data-links', 
    title: 'Data Links', 
    icon: <Radio className="w-6 h-6" />,
    category: 'system',
    description: 'NIPR, SIPR, Link 16, TektoNet status'
  },
  { 
    id: 'cyber-attack-surface', 
    type: 'cyber-attack-surface', 
    title: 'Cyber Attack Surface', 
    icon: <Shield className="w-6 h-6" />,
    category: 'system',
    description: 'Threat dashboard, vulnerabilities'
  },
  { 
    id: 'power', 
    type: 'power', 
    title: 'Power Management', 
    icon: <Zap className="w-6 h-6" />,
    category: 'system',
    description: 'Grid status, consumption, UPS monitoring'
  },
  { 
    id: 'media', 
    type: 'media', 
    title: 'Media Center', 
    icon: <Music className="w-6 h-6" />,
    category: 'system',
    description: 'Audio/video feeds and recordings'
  },
  { 
    id: 'documents', 
    type: 'documents', 
    title: 'Documents', 
    icon: <FileText className="w-6 h-6" />,
    category: 'system',
    description: 'Mission documents and files'
  }
]

/**
 * Specialized Portals - Left Tray
 * Mission-specific operational functions
 */
export const SPECIALIZED_PORTALS: PortalData[] = [
  { 
    id: 'map', 
    type: 'map', 
    title: 'Map', 
    icon: <Map className="w-6 h-6" />,
    category: 'specialized',
    description: 'Geospatial situational awareness'
  },
  { 
    id: 'timeline', 
    type: 'timeline', 
    title: 'Timeline', 
    icon: <Clock className="w-6 h-6" />,
    category: 'specialized',
    description: 'Mission events chronologically'
  },
  { 
    id: 'messenger', 
    type: 'messenger', 
    title: 'Messenger', 
    icon: <MessageSquare className="w-6 h-6" />,
    category: 'specialized',
    description: 'Secure communication hub'
  },
  { 
    id: 'alerts', 
    type: 'alerts', 
    title: 'Alerts', 
    icon: <Bell className="w-6 h-6" />,
    category: 'specialized',
    description: 'Prioritized notifications'
  },
  { 
    id: 'camera-capability', 
    type: 'camera-capability', 
    title: 'Camera Capability', 
    icon: <Eye className="w-6 h-6" />,
    category: 'specialized',
    description: 'Visual feeds for threat confirmation'
  },
  { 
    id: 'data-view', 
    type: 'data-view', 
    title: 'Data View', 
    icon: <BarChart3 className="w-6 h-6" />,
    category: 'specialized',
    description: 'Analytics and data visualization'
  }
]

/**
 * AI Engine Portals - Right Tray
 * Artificial intelligence and automation functions
 */
export const AI_ENGINE_PORTALS: PortalData[] = [
  { 
    id: 'confidence-scoring', 
    type: 'confidence-scoring', 
    title: 'Confidence Scoring Engine', 
    icon: <div className="w-6 h-6"><GroupConfidence /></div>,
    category: 'ai-engine',
    description: 'Reliability assessment of detections'
  },
  { 
    id: 'prioritization', 
    type: 'prioritization', 
    title: 'Prioritization Engine', 
    icon: <div className="w-6 h-6"><GroupPrioritization /></div>,
    category: 'ai-engine',
    description: 'Task and threat prioritization'
  },
  { 
    id: 'coa-generator', 
    type: 'coa-generator', 
    title: 'COA Generator', 
    icon: <div className="w-6 h-6"><GroupCOA /></div>,
    category: 'ai-engine',
    description: 'Course of action generation'
  },
  { 
    id: 'asset-tasking', 
    type: 'asset-tasking', 
    title: 'Asset Tasking Optimizer', 
    icon: <div className="w-6 h-6"><Vector /></div>,
    category: 'ai-engine',
    description: 'Resource allocation optimization'
  },
  { 
    id: 'human-teaming', 
    type: 'human-teaming', 
    title: 'Human-Machine Teaming', 
    icon: <div className="w-6 h-6"><Group73073 /></div>,
    category: 'ai-engine',
    description: 'Collaboration and trust metrics'
  },
  { 
    id: 'context-correlator', 
    type: 'context-correlator', 
    title: 'Context Correlator', 
    icon: <div className="w-6 h-6"><GroupContextCorrelator /></div>,
    category: 'ai-engine',
    description: 'Multi-domain analysis and correlation'
  }
]

/**
 * All available portals organized by category
 */
export const ALL_PORTALS = {
  system: SYSTEM_PORTALS,
  specialized: SPECIALIZED_PORTALS,
  aiEngine: AI_ENGINE_PORTALS
} as const

/**
 * Portal configuration for edge trays
 */
export const EDGE_TRAY_CONFIG = {
  top: SYSTEM_PORTALS,
  left: SPECIALIZED_PORTALS,
  right: AI_ENGINE_PORTALS,
  bottom: [] // Bottom tray reserved for future use
} as const 