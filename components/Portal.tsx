'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  X, 
  TrendingUp, 
  Cpu, 
  Wifi, 
  Battery, 
  Maximize2, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Bell, 
  Eye, 
  BarChart3, 
  Shield, 
  Target, 
  Navigation, 
  Network, 
  Plane, 
  AlertTriangle, 
  Camera, 
  Radio,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  Thermometer,
  Calendar as CalendarIcon,
  ChevronRight,
  Users,
  Send,
  CheckCircle2,
  AlertCircle,
  User,
  Brain,
  GitBranch,
  Globe,
  Gauge,
  Zap,
  Activity,
  TrendingDown,
  CheckCircle,
  XCircle,
  Radar,
  Satellite,
  Router,
  Database,
  Skull,
  MousePointer,
  Clock3,
  Heart,
  Settings,
  Volume2,
  Monitor,
  UserCheck,
  Lightbulb,
  HardDrive,
  MemoryStick,
  Server,
  Power,
  Wifi as WifiIcon,
  Play,
  Pause,
  File,
  Folder,
  Download,
  Upload,
  Lock,
  Unlock,
  Plus,
  Minus,
  Hash,
  Signal,
  Smartphone,
  Headphones,
  Video,
  FileText,
  Image,
  Music,
  Mic,
  MicOff,
  PhoneCall,
  Search,
  RefreshCw,
  Filter,
  SortAsc,
  Edit,
  Share,
  Archive,
  Trash2,
  Star,
  Flag,
  Timer,
  Calendar,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Layers,
  Grid,
  List,
  Maximize,
  Minimize,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Move,
  Copy,
  ExternalLink,
  Info,
  HelpCircle,
  Bookmark,
  Map
} from 'lucide-react'
import { PortalData } from './constants/portalConfigs'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { Timeline } from './Timeline'
import MapPortal from './portals/MapPortal'
import CameraPortal from './portals/SimpleCameraPortal'
import NewTimelinePortal from './portals/TimelinePortal'
import DataViewPortal from './portals/DataViewPortal'
import AlertsPortal from './portals/AlertsPortal'
import WeatherPortalComponent from './portals/WeatherPortal'

interface PortalProps {
  portal: PortalData
  onClose: () => void
  onExpand: () => void
}

export function Portal({ portal, onClose, onExpand }: PortalProps) {
  const renderPortalContent = () => {
    switch (portal.type) {
      case 'system':
        return <SystemStatusPortal />
      case 'weather':
        return <WeatherPortalComponent level={2} onLevelChange={() => {}} onClose={onClose} />
      case 'calendar':
        return <CalendarPortal />
      case 'messages':
        return <MessagesPortal />
      case 'security':
        return <SecurityPortal />
      case 'power':
        return <PowerPortal />
      case 'network-diagram':
        return <NetworkDiagramPortal />
      case 'data-links':
        return <DataLinksPortal />
      case 'cyber-attack-surface':
        return <CyberAttackSurfacePortal />
      case 'media':
        return <MediaPortal />
      case 'documents':
        return <DocumentsPortal />
      case 'settings':
        return <SettingsPortal />
      case 'map':
        return <MapPortal level={2} onLevelChange={() => {}} onClose={onClose} />
      case 'timeline':
        return <NewTimelinePortal level={2} onLevelChange={() => {}} onClose={onClose} />
      case 'messenger':
        return <MessengerPortal />
      case 'alerts':
        return <AlertsPortal level={2} onLevelChange={() => {}} onClose={onClose} />
      case 'camera-capability':
        return <CameraPortal level={2} onLevelChange={() => {}} onClose={onClose} />
      case 'data-view':
        return <DataViewPortal level={2} onLevelChange={() => {}} onClose={onClose} />
      // AI Engine Portals
      case 'confidence-scoring':
        return <ConfidenceScoringPortal />
      case 'prioritization':
        return <PrioritizationPortal />
      case 'coa-generator':
        return <COAGeneratorPortal />
      case 'asset-tasking':
        return <AssetTaskingPortal />
      case 'human-teaming':
        return <HumanTeamingPortal />
      case 'context-correlator':
        return <ContextCorrelatorPortal />
      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-400">
            <span>{portal.title} Portal - Coming Soon</span>
          </div>
        )
    }
  }

  return (
    <motion.div
      className="w-full h-full bg-gray-900/90 backdrop-blur-md border border-gray-600/20 rounded-lg overflow-hidden relative group"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
    >
      {/* Header - Double-click to expand */}
      <div 
        className="flex items-center justify-between p-3 border-b border-gray-700 cursor-pointer hover:bg-gray-800/30 transition-colors duration-200"
        onDoubleClick={onExpand}
        title="Double-click to expand to fullscreen"
      >
        <div className="flex items-center gap-2">
          <div className="text-gray-300">
            {portal.icon}
          </div>
          <h3 className="text-gray-200">{portal.title}</h3>
        </div>
        
        <div className="flex items-center gap-1">
          {/* Expand button - visible on hover */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onExpand()
            }}
            className="text-gray-400 hover:text-purple-400 transition-colors p-1 rounded hover:bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            title="Expand to fullscreen"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
          
          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            className="text-gray-400 hover:text-red-400 transition-colors p-1 rounded hover:bg-red-500/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 h-full overflow-auto" style={{ height: 'calc(100% - 60px)' }}>
        {renderPortalContent()}
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 bg-purple-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg" />
    </motion.div>
  )
}

// System Status Portal - Level 2
function SystemStatusPortal() {
  const systemMetrics = [
    { component: 'CPU Usage', value: 23, unit: '%', status: 'NORMAL', icon: <Cpu className="w-3 h-3" /> },
    { component: 'Memory', value: 67, unit: '%', status: 'NORMAL', icon: <MemoryStick className="w-3 h-3" /> },
    { component: 'Storage', value: 45, unit: '%', status: 'NORMAL', icon: <HardDrive className="w-3 h-3" /> },
    { component: 'Network', value: 89, unit: '%', status: 'ACTIVE', icon: <Network className="w-3 h-3" /> }
  ]

  const activeServices = [
    { name: 'JARVIS Core', status: 'RUNNING', uptime: '72h 15m' },
    { name: 'Tactical Network', status: 'RUNNING', uptime: '72h 15m' },
    { name: 'Data Correlation', status: 'RUNNING', uptime: '71h 42m' },
    { name: 'Threat Analysis', status: 'RUNNING', uptime: '72h 15m' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RUNNING': return 'text-green-400'
      case 'ACTIVE': return 'text-purple-400'
      case 'NORMAL': return 'text-green-400'
      case 'WARNING': return 'text-yellow-400'
      case 'CRITICAL': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getValueColor = (value: number, isNetwork = false) => {
    if (isNetwork) return value > 70 ? 'text-green-400' : 'text-yellow-400'
    if (value < 30) return 'text-green-400'
    if (value < 70) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="w-4 h-4 text-gray-300" />
        <div className="text-gray-200 text-xs">System Overview</div>
      </div>
      
      <div className="space-y-2">
        {systemMetrics.map((metric, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              <div className={getStatusColor(metric.status)}>
                {metric.icon}
              </div>
              <span className="text-xs text-gray-300">{metric.component}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={`text-xs ${getValueColor(metric.value, metric.component === 'Network')}`}>
                {metric.value}{metric.unit}
              </span>
              <span className={`text-xs ${getStatusColor(metric.status)}`}>
                {metric.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-700 pt-2">
        <div className="text-xs text-purple-300 mb-2">Active Services</div>
        <div className="space-y-1">
          {activeServices.map((service, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
                <span className="text-gray-300">{service.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">{service.uptime}</span>
                <span className={getStatusColor(service.status)}>{service.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-700 pt-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-400">System Health</span>
          <span className="text-green-400">OPTIMAL</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Last Boot</span>
          <span className="text-purple-400">3 days ago</span>
        </div>
      </div>
    </div>
  )
}



// Implementing stubs for remaining portals to keep the response focused
function CalendarPortal() { return <DefaultPortal title="Calendar" icon="📅" description="Mission scheduling and timeline management" /> }
function MessagesPortal() { return <DefaultPortal title="Messages" icon="💬" description="Secure tactical communications" /> }
function SecurityPortal() { return <DefaultPortal title="Security" icon="🛡️" description="Threat monitoring and system protection" /> }
function PowerPortal() { return <DefaultPortal title="Power" icon="⚡" description="Power grid and energy management" /> }
function NetworkDiagramPortal() { return <DefaultPortal title="Network" icon="🌐" description="Network topology and traffic analysis" /> }
function DataLinksPortal() { return <DefaultPortal title="Data Links" icon="📡" description="Tactical data link communications" /> }
function CyberAttackSurfacePortal() { return <DefaultPortal title="Cyber Security" icon="🛡️" description="Attack surface monitoring and analysis" /> }
function MediaPortal() { return <DefaultPortal title="Media" icon="🎵" description="Digital asset management and playback" /> }
function DocumentsPortal() { return <DefaultPortal title="Documents" icon="📄" description="Secure document library and sharing" /> }
function SettingsPortal() { return <DefaultPortal title="Settings" icon="⚙️" description="System configuration and preferences" /> }

function MessengerPortal() { return <DefaultPortal title="Messenger" icon="💬" description="Real-time secure messaging" /> }
// CameraCapabilityPortal now uses the dedicated CameraPortal component


// AI Engine Portals - Keep existing implementations
function ConfidenceScoringPortal() {
  const confidenceScores = [
    { source: 'Sensor Array Alpha', score: 94, trend: 'stable' },
    { source: 'COMMS Network', score: 87, trend: 'up' },
    { source: 'Intel Feed Beta', score: 76, trend: 'down' },
    { source: 'GPS Navigation', score: 98, trend: 'stable' }
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-green-400" />
      case 'down': return <TrendingDown className="w-3 h-3 text-red-400" />
      default: return <Activity className="w-3 h-3 text-gray-400" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400'
    if (score >= 75) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <Brain className="w-4 h-4 text-gray-300" />
        <div className="text-gray-200 text-xs">Confidence Engine</div>
      </div>
      
      <div className="space-y-2">
        {confidenceScores.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-1 flex-1 min-w-0">
              {getTrendIcon(item.trend)}
              <span className="text-xs text-gray-300 truncate">{item.source}</span>
            </div>
            <div className={`text-xs ${getScoreColor(item.score)} min-w-0`}>
              {item.score}%
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-700 pt-2">
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Avg Confidence</span>
          <span className="text-green-400">89%</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Data Integrity</span>
          <span className="text-purple-400">HIGH</span>
        </div>
      </div>
    </div>
  )
}

function PrioritizationPortal() { return <DefaultPortal title="Prioritization Engine" icon="🎯" description="Task prioritization and queue management" /> }
function COAGeneratorPortal() { return <DefaultPortal title="COA Generator" icon="🔀" description="Course of action analysis and planning" /> }
function AssetTaskingPortal() { return <DefaultPortal title="Asset Tasking" icon="🎛️" description="Asset optimization and task allocation" /> }
function HumanTeamingPortal() { return <DefaultPortal title="Human Teaming" icon="🤝" description="Human-machine collaboration interface" /> }
function ContextCorrelatorPortal() { return <DefaultPortal title="Context Correlator" icon="🌐" description="Multi-domain pattern analysis" /> }

// Default Portal template
function DefaultPortal({ title, icon, description }: { title: string, icon?: string, description?: string }) {
  return (
    <div className="space-y-3">
      <div className="text-center text-gray-400 mt-8">
        <div className="text-2xl mb-2">{icon || '⚡'}</div>
        <div className="text-gray-300">{title}</div>
        <div className="text-xs text-gray-500">{description || 'Level 2 - Portal Active'}</div>
        <div className="text-xs text-purple-400 mt-2">Comprehensive functionality available</div>
      </div>
    </div>
  )
}