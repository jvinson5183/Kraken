import React, { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Database, 
  Activity, 
  Wifi, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Download,
  Search,
  Filter,
  RefreshCw,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  MapPin,
  Bell,
  Server,
  Radio,
  Shield,
  Zap,
  Target,
  Signal,
  Clock,
  FileText,
  Grid,
  List,
  Settings,
  Layers,
  Info
} from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { TooltipProvider } from '../ui/tooltip'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

interface DataStream {
  id: string
  timestamp: Date
  source: string
  type: 'sensor' | 'effector' | 'communication' | 'system' | 'threat' | 'friendly'
  dataType: 'detection' | 'status' | 'telemetry' | 'command' | 'alert' | 'health'
  value: any
  unit?: string
  coordinates?: [number, number]
  confidence?: number
  status: 'normal' | 'warning' | 'critical' | 'offline'
  metadata?: Record<string, any>
  anomaly?: boolean
}

interface SystemHealth {
  id: string
  name: string
  type: 'sensor' | 'effector' | 'communication' | 'network'
  status: 'online' | 'offline' | 'maintenance' | 'degraded'
  connectivity: number
  lastUpdate: Date
  metrics?: {
    uptime?: number
    latency?: number
    errorRate?: number
    signalStrength?: number
    ammoCount?: number
    fuelLevel?: number
  }
}

interface DataViewPortalProps {
  level: 2 | 3
  onLevelChange?: (level: 2 | 3) => void
  onClose?: () => void
}

// Sample data streams - replace with real sensor feeds
const SAMPLE_DATA_STREAMS: DataStream[] = [
  {
    id: 'data-001',
    timestamp: new Date(Date.now() - 30 * 1000),
    source: 'Sentinel Radar',
    type: 'sensor',
    dataType: 'detection',
    value: { range: 2.5, bearing: 45, elevation: 15 },
    coordinates: [38.9072, -77.0369],
    confidence: 92,
    status: 'normal'
  },
  {
    id: 'data-002',
    timestamp: new Date(Date.now() - 45 * 1000),
    source: 'Phalanx CIWS',
    type: 'effector',
    dataType: 'status',
    value: { ammo: 1450, ready: true },
    status: 'normal'
  },
  {
    id: 'data-003',
    timestamp: new Date(Date.now() - 60 * 1000),
    source: 'Link 16',
    type: 'communication',
    dataType: 'telemetry',
    value: { latency: 45, packets: 2847, errors: 0 },
    unit: 'ms',
    status: 'normal'
  },
  {
    id: 'data-004',
    timestamp: new Date(Date.now() - 15 * 1000),
    source: 'EO/IR Camera',
    type: 'sensor',
    dataType: 'detection',
    value: { target_id: 'TGT-001', classification: 'quadcopter' },
    coordinates: [38.9200, -77.0200],
    confidence: 87,
    status: 'warning',
    anomaly: true
  },
  {
    id: 'data-005',
    timestamp: new Date(Date.now() - 20 * 1000),
    source: 'IBCS Network',
    type: 'system',
    dataType: 'health',
    value: { cpu: 67, memory: 78, disk: 45 },
    unit: '%',
    status: 'normal'
  }
]

const SAMPLE_SYSTEM_HEALTH: SystemHealth[] = [
  {
    id: 'sys-001',
    name: 'Sentinel Radar',
    type: 'sensor',
    status: 'online',
    connectivity: 98,
    lastUpdate: new Date(Date.now() - 30 * 1000),
    metrics: { uptime: 99.8, latency: 12, signalStrength: 95 }
  },
  {
    id: 'sys-002',
    name: 'Phalanx CIWS',
    type: 'effector',
    status: 'online',
    connectivity: 100,
    lastUpdate: new Date(Date.now() - 15 * 1000),
    metrics: { uptime: 99.9, ammoCount: 1450, errorRate: 0.1 }
  },
  {
    id: 'sys-003',
    name: 'Link 16 Terminal',
    type: 'communication',
    status: 'degraded',
    connectivity: 85,
    lastUpdate: new Date(Date.now() - 120 * 1000),
    metrics: { uptime: 97.2, latency: 67, errorRate: 2.3 }
  },
  {
    id: 'sys-004',
    name: 'IBCS Network',
    type: 'network',
    status: 'online',
    connectivity: 95,
    lastUpdate: new Date(Date.now() - 10 * 1000),
    metrics: { uptime: 99.5, latency: 8, errorRate: 0.5 }
  }
]

const getDataIcon = (type: string, dataType: string) => {
  const className = 'w-4 h-4'
  
  if (type === 'sensor') {
    switch (dataType) {
      case 'detection': return <Target className={`${className} text-orange-400`} />
      case 'health': return <Activity className={`${className} text-green-400`} />
      default: return <Eye className={`${className} text-blue-400`} />
    }
  } else if (type === 'effector') {
    return <Zap className={`${className} text-purple-400`} />
  } else if (type === 'communication') {
    return <Radio className={`${className} text-cyan-400`} />
  } else if (type === 'system') {
    return <Server className={`${className} text-yellow-400`} />
  }
  
  return <Database className={`${className} text-gray-400`} />
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'normal': return 'text-green-400'
    case 'warning': return 'text-yellow-400'
    case 'critical': return 'text-red-400'
    case 'offline': return 'text-gray-400'
    default: return 'text-gray-400'
  }
}

const getStatusIcon = (status: string) => {
  const baseClass = 'w-3 h-3'
  switch (status) {
    case 'online': return <CheckCircle className={`${baseClass} text-green-400`} />
    case 'degraded': return <AlertTriangle className={`${baseClass} text-yellow-400`} />
    case 'offline': return <XCircle className={`${baseClass} text-red-400`} />
    case 'maintenance': return <Settings className={`${baseClass} text-blue-400`} />
    default: return <Database className={`${baseClass} text-gray-400`} />
  }
}

const formatValue = (value: any, unit?: string) => {
  if (typeof value === 'object') {
    return Object.entries(value)
      .map(([key, val]) => `${key}: ${val}`)
      .join(', ')
  }
  return `${value}${unit ? ` ${unit}` : ''}`
}

const DataViewPortal: React.FC<DataViewPortalProps> = ({ level }) => {
  const [dataStreams] = useState<DataStream[]>(SAMPLE_DATA_STREAMS)
  const [systemHealth] = useState<SystemHealth[]>(SAMPLE_SYSTEM_HEALTH)
  const [selectedSource, setSelectedSource] = useState<string>('all')
  const [selectedDataType, setSelectedDataType] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAnomalies, setShowAnomalies] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!autoRefresh) return
    
    const interval = setInterval(() => {
      setLastUpdate(new Date())
    }, level === 2 ? 500 : 250) // 0.5s for Level 2, 0.25s for Level 3
    
    return () => clearInterval(interval)
  }, [autoRefresh, level])

  const filteredData = dataStreams.filter(stream => {
    const sourceMatch = selectedSource === 'all' || stream.source.toLowerCase().includes(selectedSource.toLowerCase())
    const dataTypeMatch = selectedDataType === 'all' || stream.dataType === selectedDataType
    const statusMatch = selectedStatus === 'all' || stream.status === selectedStatus
    const searchMatch = searchQuery === '' || 
      stream.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stream.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      JSON.stringify(stream.value).toLowerCase().includes(searchQuery.toLowerCase())
    const anomalyMatch = showAnomalies || !stream.anomaly

    return sourceMatch && dataTypeMatch && statusMatch && searchMatch && anomalyMatch
  }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  const exportDataAsCSV = () => {
    const headers = ['Timestamp', 'Source', 'Type', 'Data Type', 'Value', 'Status', 'Confidence', 'Coordinates']
    const csvContent = [
      headers.join(','),
      ...filteredData.map(stream => [
        stream.timestamp.toISOString(),
        stream.source,
        stream.type,
        stream.dataType,
        `"${formatValue(stream.value, stream.unit)}"`,
        stream.status,
        stream.confidence || '',
        stream.coordinates ? `"${stream.coordinates.join(',')}"` : ''
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `data-export-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (level === 2) {
    return (
      <TooltipProvider>
        <motion.div 
          className="h-full flex flex-col bg-gray-900/90 border border-gray-700 rounded-lg overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 bg-gray-800/50 border-b border-gray-700 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-gray-300">Data Streams</span>
              <Badge variant="outline" className="text-xs text-gray-100 border-gray-500 bg-gray-800/50">
                {filteredData.length} Active
              </Badge>
            </div>
            
            <div className="flex items-center gap-1">
              <Select value={selectedSource} onValueChange={setSelectedSource}>
                <SelectTrigger className="w-28 h-7 text-xs bg-gray-800 border-gray-600 text-gray-100 hover:bg-gray-700 focus:bg-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="all" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">All Sources</SelectItem>
                  <SelectItem value="radar" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">Radar</SelectItem>
                  <SelectItem value="camera" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">Camera</SelectItem>
                  <SelectItem value="ciws" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">CIWS</SelectItem>
                  <SelectItem value="link" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">Link 16</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`h-7 w-7 p-0 ${autoRefresh ? 'text-green-400' : 'text-gray-400'}`}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Data Table */}
          <div className="flex-1 overflow-y-auto" ref={scrollRef}>
            <div className="p-3 space-y-2">
              {filteredData.slice(0, 12).map((stream, index) => (
                <motion.div
                  key={stream.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`p-3 rounded-lg border backdrop-blur-sm ${
                    stream.status === 'critical' ? 'border-red-500/50 bg-red-500/10' :
                    stream.status === 'warning' ? 'border-yellow-500/50 bg-yellow-500/10' :
                    'border-gray-600/50 bg-gray-800/30'
                  } ${stream.anomaly ? 'ring-1 ring-orange-400/50' : ''}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getDataIcon(stream.type, stream.dataType)}
                      <span className="text-sm text-gray-300 font-mono">
                        {stream.timestamp.toLocaleTimeString()}
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-400">{stream.source}</span>
                      {stream.anomaly && (
                        <Badge variant="outline" className="text-xs border-orange-400 text-orange-300">
                          ANOMALY
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {stream.confidence && (
                        <span className="text-xs text-gray-500">{stream.confidence}%</span>
                      )}
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getStatusColor(stream.status)} border-current`}
                      >
                        {stream.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-200">
                    <span className="text-gray-500">{stream.dataType}:</span> {formatValue(stream.value, stream.unit)}
                  </div>
                  
                  {stream.coordinates && (
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-400">
                        {stream.coordinates[0].toFixed(4)}, {stream.coordinates[1].toFixed(4)}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* System Health Footer */}
          <div className="p-2 bg-gray-800/30 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {systemHealth.slice(0, 3).map(system => (
                  <div key={system.id} className="flex items-center gap-1">
                    {getStatusIcon(system.status)}
                    <span className="text-xs text-gray-400">{system.name}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>Updated: {lastUpdate.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </TooltipProvider>
    )
  }

  // Level 3 - Enhanced version
  return (
    <TooltipProvider>
      <motion.div 
        className="h-full flex flex-col bg-gray-900/95 border border-gray-700 rounded-lg overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Enhanced Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-800/70 to-gray-700/50 border-b border-gray-600">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>Updated: <span className="text-purple-300">{lastUpdate.toLocaleTimeString()}</span></span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost" 
              size="sm"
              onClick={exportDataAsCSV}
              className="h-8 text-xs text-gray-300 hover:text-purple-300"
            >
              <Download className="w-4 h-4 mr-1" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Advanced Controls Bar */}
        <div className="flex items-center justify-between p-3 bg-gray-800/30 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search data streams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 h-8 px-2 text-xs bg-gray-800 border border-gray-600 rounded text-gray-100 placeholder-gray-500 focus:border-purple-500 focus:outline-none"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Source:</span>
              <Select value={selectedSource} onValueChange={setSelectedSource}>
                <SelectTrigger className="w-32 h-8 text-xs bg-gray-800 border-gray-600 text-gray-100 hover:bg-gray-700 focus:bg-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="all" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">All Sources</SelectItem>
                  <SelectItem value="sentinel" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">Sentinel Radar</SelectItem>
                  <SelectItem value="phalanx" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">Phalanx CIWS</SelectItem>
                  <SelectItem value="camera" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">EO/IR Camera</SelectItem>
                  <SelectItem value="link" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">Link 16</SelectItem>
                  <SelectItem value="ibcs" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">IBCS Network</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Type:</span>
              <Select value={selectedDataType} onValueChange={setSelectedDataType}>
                <SelectTrigger className="w-24 h-8 text-xs bg-gray-800 border-gray-600 text-gray-100 hover:bg-gray-700 focus:bg-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="all" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">All</SelectItem>
                  <SelectItem value="detection" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">Detection</SelectItem>
                  <SelectItem value="status" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">Status</SelectItem>
                  <SelectItem value="telemetry" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">Telemetry</SelectItem>
                  <SelectItem value="health" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">Health</SelectItem>
                  <SelectItem value="alert" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">Alert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="ghost"
              size="sm" 
              onClick={() => setShowAnomalies(!showAnomalies)}
              className={`h-8 px-3 text-xs ${showAnomalies ? 'text-orange-300 bg-orange-500/20' : 'text-gray-400'}`}
            >
              <AlertTriangle className="w-4 h-4 mr-1" />
              Anomalies
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
              className="h-8 w-8 p-0 text-gray-400 hover:text-purple-300"
            >
              {viewMode === 'table' ? <Grid className="w-4 h-4" /> : <List className="w-4 h-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`h-8 w-8 p-0 ${autoRefresh ? 'text-green-400' : 'text-gray-400'}`}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Enhanced Data Display */}
        <div className="flex-1 overflow-y-auto" ref={scrollRef}>
          <div className="p-4">
            {viewMode === 'table' ? (
              // Enhanced Table View
              <div className="space-y-3">
                {filteredData.map((stream, index) => (
                  <motion.div
                    key={stream.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className={`p-4 rounded-lg border backdrop-blur-sm ${
                      stream.status === 'critical' ? 'border-red-500/50 bg-red-500/10' :
                      stream.status === 'warning' ? 'border-yellow-500/50 bg-yellow-500/10' :
                      'border-gray-600/50 bg-gray-800/30'
                    } ${stream.anomaly ? 'ring-1 ring-orange-400/50' : ''} hover:bg-opacity-20 transition-all duration-200`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getDataIcon(stream.type, stream.dataType)}
                        <div>
                          <span className="text-sm text-gray-300 font-mono font-medium">
                            {stream.timestamp.toLocaleTimeString()}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">
                            {stream.source} • {stream.type} • {stream.dataType}
                          </div>
                        </div>
                        {stream.anomaly && (
                          <Badge variant="outline" className="ml-2 text-xs border-orange-400 text-orange-300">
                            AI DETECTED ANOMALY
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {stream.confidence && (
                          <div className="text-xs text-gray-400">
                            Confidence: <span className="text-purple-300">{stream.confidence}%</span>
                          </div>
                        )}
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getStatusColor(stream.status)} border-current`}
                        >
                          {stream.status.toUpperCase()}
                        </Badge>
                        
                        {stream.coordinates && (
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-green-300">
                            <MapPin className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded p-3 mb-3">
                      <span className="text-xs text-gray-500">Data: </span>
                      <span className="text-sm text-gray-200">{formatValue(stream.value, stream.unit)}</span>
                    </div>
                    
                    {stream.metadata && (
                      <div className="text-xs text-gray-400">
                        <span className="text-gray-500">Metadata: </span>
                        {JSON.stringify(stream.metadata)}
                      </div>
                    )}
                    
                    {stream.coordinates && (
                      <div className="flex items-center gap-1 mt-2">
                        <MapPin className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-400">
                          Coordinates: {stream.coordinates[0].toFixed(6)}, {stream.coordinates[1].toFixed(6)}
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              // Grid View
              <div className="grid grid-cols-3 gap-4">
                {filteredData.map((stream, index) => (
                  <motion.div
                    key={stream.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className={`p-3 rounded-lg border backdrop-blur-sm ${
                      stream.status === 'critical' ? 'border-red-500/50 bg-red-500/10' :
                      stream.status === 'warning' ? 'border-yellow-500/50 bg-yellow-500/10' :
                      'border-gray-600/50 bg-gray-800/30'
                    } ${stream.anomaly ? 'ring-1 ring-orange-400/50' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      {getDataIcon(stream.type, stream.dataType)}
                      <Badge className={`text-xs ${getStatusColor(stream.status)}`}>
                        {stream.status}
                      </Badge>
                    </div>
                    
                    <div className="text-xs text-gray-400 mb-1">{stream.source}</div>
                    <div className="text-sm text-gray-200 mb-2">{formatValue(stream.value, stream.unit)}</div>
                    
                    <div className="text-xs text-gray-500">
                      {stream.timestamp.toLocaleTimeString()}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Enhanced System Health Panel */}
        <div className="p-3 bg-gray-800/50 border-t border-gray-600">
          <div className="grid grid-cols-4 gap-4">
            {systemHealth.map(system => (
              <div key={system.id} className="flex items-center gap-2">
                {getStatusIcon(system.status)}
                <div className="flex-1">
                  <div className="text-xs text-gray-300">{system.name}</div>
                  <div className="text-xs text-gray-500">
                    {system.connectivity}% • {system.metrics?.uptime}% uptime
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  )
}

export default DataViewPortal 