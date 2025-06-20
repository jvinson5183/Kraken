import React, { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Clock, 
  Shield, 
  Target, 
  Radio, 
  Users, 
  Bell,
  Activity,
  Zap,
  Eye,
  Navigation,
  Play,
  Pause,
  Download,
  MapPin,
  Camera,
  Timer,
  RefreshCw,
  TrendingUp
} from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { TooltipProvider } from '../ui/tooltip'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

interface TimelineEvent {
  id: string
  timestamp: Date
  title: string
  description: string
  type: 'threat-detection' | 'engagement' | 'c-uas' | 'c-ram' | 'sensor-alert' | 'engagement-order' | 'intel' | 'comms' | 'system' | 'mission'
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
  source: string
  location?: string
  context?: string
  linkedAssets?: string[]
  predictive?: boolean
  mapTrackId?: string
  cameraFeedId?: string
}

interface TimelinePortalProps {
  level: 2 | 3
  onLevelChange?: (level: 2 | 3) => void
  onClose?: () => void
}

// Sample timeline events - replace with real mission data
const SAMPLE_EVENTS: TimelineEvent[] = [
  {
    id: 'evt-001',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    title: 'UAS Threat Detected',
    description: 'Small quadcopter identified approaching from northwest sector',
    type: 'threat-detection',
    severity: 'high',
    source: 'Sentinel Radar',
    location: 'Grid 345.127',
    context: 'Potential hostile intent, maintaining course toward facility',
    linkedAssets: ['sensor-1', 'effector-1'],
    mapTrackId: 'threat-1'
  },
  {
    id: 'evt-002',
    timestamp: new Date(Date.now() - 3 * 60 * 1000),
    title: 'Engagement Authorization',
    description: 'C-UAS system authorized to engage target TGT-001',
    type: 'engagement-order',
    severity: 'critical',
    source: 'Command Center',
    location: 'Grid 345.127',
    context: 'Rules of engagement approved, clear to fire',
    linkedAssets: ['effector-1']
  },
  {
    id: 'evt-003',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    title: 'Target Neutralized',
    description: 'UAS threat successfully eliminated by Phalanx CIWS',
    type: 'engagement',
    severity: 'medium',
    source: 'Phalanx CIWS',
    location: 'Grid 345.127',
    context: 'Target destroyed, no collateral damage reported',
    linkedAssets: ['effector-1']
  },
  {
    id: 'evt-004',
    timestamp: new Date(Date.now() - 1 * 60 * 1000),
    title: 'Area Sweep Complete',
    description: 'All-clear signal from reconnaissance drone patrol',
    type: 'intel',
    severity: 'info',
    source: 'UAV-7',
    location: 'AO Bravo',
    context: 'No additional threats detected in immediate area'
  },
  {
    id: 'evt-005',
    timestamp: new Date(Date.now() + 3 * 60 * 1000),
    title: 'Predicted Intercept Window',
    description: 'Estimated optimal engagement time for incoming missile threat',
    type: 'engagement-order',
    severity: 'critical',
    source: 'AI Targeting System',
    location: 'Grid 234.889',
    context: 'Based on current trajectory and speed analysis',
    predictive: true,
    linkedAssets: ['effector-2', 'sensor-3']
  },
  {
    id: 'evt-006',
    timestamp: new Date(Date.now() + 7 * 60 * 1000),
    title: 'Friendly Aircraft Transit',
    description: 'F-16 flight path conflicts with engagement zone Alpha',
    type: 'mission',
    severity: 'high',
    source: 'Air Traffic Control',
    location: 'Zone Alpha',
    context: 'Coordination required to avoid blue-on-blue incident',
    predictive: true,
    linkedAssets: ['friendly-1']
  }
]

const getEventIcon = (type: string, severity: string, predictive?: boolean) => {
  const baseClass = predictive ? 'opacity-70' : ''
  const colorClass = severity === 'critical' ? 'text-red-400' : 
                    severity === 'high' ? 'text-orange-400' : 
                    severity === 'medium' ? 'text-yellow-400' : 
                    severity === 'low' ? 'text-blue-400' : 'text-gray-400'

  const className = `w-4 h-4 ${colorClass} ${baseClass}`

  switch (type) {
    case 'threat-detection': return <Target className={className} />
    case 'engagement': return <Zap className={className} />
    case 'c-uas': case 'c-ram': return <Shield className={className} />
    case 'sensor-alert': return <Bell className={className} />
    case 'engagement-order': return <Navigation className={className} />
    case 'intel': return <Eye className={className} />
    case 'comms': return <Radio className={className} />
    case 'system': return <Activity className={className} />
    case 'mission': return <Users className={className} />
    default: return <Clock className={className} />
  }
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'border-red-500/50 bg-red-500/10'
    case 'high': return 'border-orange-500/50 bg-orange-500/10'
    case 'medium': return 'border-yellow-500/50 bg-yellow-500/10'
    case 'low': return 'border-blue-500/50 bg-blue-500/10'
    case 'info': return 'border-gray-500/50 bg-gray-500/10'
    default: return 'border-gray-500/50 bg-gray-500/10'
  }
}

const getSeverityIndicator = (severity: string) => {
  switch (severity) {
    case 'critical': return 'bg-red-400'
    case 'high': return 'bg-orange-400'
    case 'medium': return 'bg-yellow-400'
    case 'low': return 'bg-blue-400'
    case 'info': return 'bg-gray-400'
    default: return 'bg-gray-400'
  }
}

const formatTimeRange = (timestamp: Date) => {
  const now = new Date()
  const diff = timestamp.getTime() - now.getTime()
  const minutes = Math.abs(Math.floor(diff / (1000 * 60)))
  
  if (diff > 0) {
    return `T+${minutes}m`
  } else if (minutes < 60) {
    return `T-${minutes}m`
  } else {
    const hours = Math.floor(minutes / 60)
    return `T-${hours}h${minutes % 60}m`
  }
}

const TimelinePortal: React.FC<TimelinePortalProps> = ({ level }) => {
  const [events] = useState<TimelineEvent[]>(SAMPLE_EVENTS)
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all')
  const [selectedEventType, setSelectedEventType] = useState<string>('all')
  const [timeRange, setTimeRange] = useState<string>('1h')
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed] = useState(1)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showPredictive, setShowPredictive] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const filteredEvents = events.filter(event => {
    const timeDiff = Math.abs(event.timestamp.getTime() - currentTime.getTime()) / (1000 * 60)
    const withinTimeRange = timeDiff <= (timeRange === '1h' ? 60 : timeRange === '6h' ? 360 : 1440)
    
    // Event type filter for Level 3
    const eventTypeMatch = selectedEventType === 'all' || event.type === selectedEventType
    
    // Severity filter for Level 3
    const severityMatch = selectedSeverity === 'all' || event.severity === selectedSeverity
    
    // Predictive events filter
    const predictiveMatch = showPredictive || !event.predictive
    
    return withinTimeRange && eventTypeMatch && severityMatch && predictiveMatch
  }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  const exportData = () => {
    const dataStr = JSON.stringify(filteredEvents, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `timeline-export-${new Date().toISOString().split('T')[0]}.json`
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
              <span className="text-sm text-gray-300">Mission Timeline</span>
              {!showPredictive && (
                <Badge variant="outline" className="text-xs text-gray-400 border-gray-600">
                  No Predictive
                </Badge>
              )}
              {timeRange !== '1h' && (
                <Badge variant="outline" className="text-xs text-purple-300 border-purple-500">
                  {timeRange.toUpperCase()}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-16 h-7 text-xs bg-gray-800 border-gray-600 text-gray-100 hover:bg-gray-700 focus:bg-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="1h" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">1H</SelectItem>
                  <SelectItem value="6h" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">6H</SelectItem>
                  <SelectItem value="24h" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">24H</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPredictive(!showPredictive)}
                className={`h-7 w-7 p-0 ${showPredictive ? 'text-purple-400' : 'text-gray-400'}`}
              >
                <TrendingUp className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Timeline Container */}
          <div className="flex-1 overflow-y-auto" ref={scrollRef}>
            <div className="relative p-3">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-gray-600/30 to-transparent"></div>
              
              <div className="space-y-3">
                {filteredEvents.slice(0, 8).map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative flex items-start gap-3"
                  >
                    {/* Timeline dot */}
                    <div className="relative z-10 flex-shrink-0 mt-1">
                      <div className={`w-2.5 h-2.5 rounded-full ${getSeverityIndicator(event.severity)} ring-2 ring-gray-800 ${event.predictive ? 'opacity-70 ring-dashed' : ''}`}></div>
                    </div>

                    {/* Event card */}
                    <div className={`flex-1 p-2 rounded-lg border backdrop-blur-sm ${getSeverityColor(event.severity)} ${event.predictive ? 'opacity-70' : ''}`}>
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {getEventIcon(event.type, event.severity, event.predictive)}
                          <span className="text-xs text-gray-300 font-mono">
                            {event.predictive ? formatTimeRange(event.timestamp) : event.timestamp.toLocaleTimeString()}
                          </span>
                          {event.location && (
                            <>
                              <span className="text-gray-600">•</span>
                              <span className="text-xs text-gray-400">{event.location}</span>
                            </>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs text-gray-100 border-gray-500 bg-gray-800/50">
                          {event.severity.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <h4 className="text-sm text-gray-200 mb-1">{event.title}</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">{event.description}</p>
                      
                      {event.source && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs text-gray-500">Source:</span>
                          <span className="text-xs text-purple-300">{event.source}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between p-2 bg-gray-800/30 border-t border-gray-700">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span>Critical</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span>High</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-400 rounded-full opacity-70 ring-1 ring-dashed ring-gray-400"></div>
                <span>Future</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <RefreshCw className="w-3 h-3" />
              <span>Live</span>
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
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Updated: <span className="text-purple-300">{currentTime.toLocaleTimeString()}</span></span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                {selectedEventType !== 'all' && (
                  <Badge variant="outline" className="text-xs text-blue-300 border-blue-500">
                    {selectedEventType}
                  </Badge>
                )}
                {selectedSeverity !== 'all' && (
                  <Badge variant="outline" className="text-xs text-orange-300 border-orange-500">
                    {selectedSeverity}
                  </Badge>
                )}
                {!showPredictive && (
                  <Badge variant="outline" className="text-xs text-gray-400 border-gray-600">
                    No Predictive
                  </Badge>
                )}
                {timeRange !== '1h' && (
                  <Badge variant="outline" className="text-xs text-purple-300 border-purple-500">
                    {timeRange.toUpperCase()}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost" 
              size="sm"
              onClick={exportData}
              className="h-8 text-xs text-gray-300 hover:text-purple-300"
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex items-center justify-between p-3 bg-gray-800/30 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Type:</span>
              <Select value={selectedEventType} onValueChange={setSelectedEventType}>
                <SelectTrigger className="w-32 h-8 text-xs bg-gray-800 border-gray-600 text-gray-100 hover:bg-gray-700 focus:bg-gray-700">
                  <SelectValue placeholder="Event Type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="all" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">All Types</SelectItem>
                  <SelectItem value="threat-detection" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">Threats</SelectItem>
                  <SelectItem value="engagement" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">Engagements</SelectItem>
                  <SelectItem value="engagement-order" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">Orders</SelectItem>
                  <SelectItem value="intel" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">Intelligence</SelectItem>
                  <SelectItem value="system" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">System</SelectItem>
                  <SelectItem value="mission" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">Mission</SelectItem>
                  <SelectItem value="c-uas" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">C-UAS</SelectItem>
                  <SelectItem value="c-ram" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">C-RAM</SelectItem>
                  <SelectItem value="sensor-alert" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">Sensors</SelectItem>
                  <SelectItem value="comms" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">Comms</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Severity:</span>
              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger className="w-24 h-8 text-xs bg-gray-800 border-gray-600 text-gray-100 hover:bg-gray-700 focus:bg-gray-700">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="all" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">All</SelectItem>
                  <SelectItem value="critical" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">Critical</SelectItem>
                  <SelectItem value="high" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">High</SelectItem>
                  <SelectItem value="medium" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">Medium</SelectItem>
                  <SelectItem value="low" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">Low</SelectItem>
                  <SelectItem value="info" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Range:</span>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-20 h-8 text-xs bg-gray-800 border-gray-600 text-gray-100 hover:bg-gray-700 focus:bg-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="1h" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">1 Hour</SelectItem>
                  <SelectItem value="6h" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">6 Hours</SelectItem>
                  <SelectItem value="24h" className="text-gray-100 hover:bg-gray-700 focus:bg-gray-700">24 Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="ghost"
              size="sm" 
              onClick={() => setShowPredictive(!showPredictive)}
              className={`h-8 px-3 text-xs ${showPredictive ? 'text-purple-300 bg-purple-500/20' : 'text-gray-400'}`}
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              Predictive
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedEventType('all')
                setSelectedSeverity('all')
                setTimeRange('1h')
                setShowPredictive(true)
              }}
              className="h-8 px-3 text-xs text-gray-400 hover:text-gray-200"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Clear
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="h-8 w-8 p-0 text-gray-400 hover:text-purple-300"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Timer className="w-4 h-4" />
              <span>{playbackSpeed}x</span>
            </div>
          </div>
        </div>

        {/* Enhanced Timeline */}
        <div className="flex-1 overflow-y-auto" ref={scrollRef}>
          <div className="relative p-4">
            {/* Enhanced timeline line with time markers */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-gray-600/30 to-transparent"></div>
            
            {/* Time scale markers */}
            <div className="absolute left-0 top-0 w-6 h-full">
              {[...Array(24)].map((_, i) => (
                <div key={i} className="absolute text-xs text-gray-600" style={{ top: `${i * 4}%` }}>
                  {String(i).padStart(2, '0')}:00
                </div>
              ))}
            </div>
            
            <div className="ml-4 space-y-4">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="relative flex items-start gap-4"
                >
                  {/* Enhanced timeline dot */}
                  <div className="relative z-10 flex-shrink-0 mt-2">
                    <div className={`w-4 h-4 rounded-full ${getSeverityIndicator(event.severity)} ring-2 ring-gray-800 ${event.predictive ? 'opacity-70 ring-dashed animate-pulse' : ''}`}>
                      <div className="absolute inset-1 rounded-full bg-white/20"></div>
                    </div>
                  </div>

                  {/* Enhanced event card */}
                  <div className={`flex-1 p-4 rounded-lg border backdrop-blur-sm ${getSeverityColor(event.severity)} ${event.predictive ? 'opacity-80 border-dashed' : ''} hover:bg-opacity-20 transition-all duration-200`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getEventIcon(event.type, event.severity, event.predictive)}
                        <div>
                          <span className="text-sm text-gray-300 font-mono font-medium">
                            {event.predictive ? formatTimeRange(event.timestamp) : event.timestamp.toLocaleTimeString()}
                          </span>
                          {event.predictive && (
                            <Badge variant="outline" className="ml-2 text-xs border-purple-400 text-purple-300">
                              PREDICTED
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            event.severity === 'critical' ? 'border-red-400 text-red-300' :
                            event.severity === 'high' ? 'border-orange-400 text-orange-300' :
                            event.severity === 'medium' ? 'border-yellow-400 text-yellow-300' :
                            'border-blue-400 text-blue-300'
                          }`}
                        >
                          {event.severity.toUpperCase()}
                        </Badge>
                        
                        {event.mapTrackId && (
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-green-300">
                            <MapPin className="w-3 h-3" />
                          </Button>
                        )}
                        
                        {event.cameraFeedId && (
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-blue-300">
                            <Camera className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <h4 className="text-base text-gray-200 mb-2 font-medium">{event.title}</h4>
                    <p className="text-sm text-gray-400 leading-relaxed mb-3">{event.description}</p>
                    
                    {event.context && (
                      <div className="bg-gray-800/50 rounded p-2 mb-3">
                        <span className="text-xs text-gray-500">Context: </span>
                        <span className="text-xs text-gray-300">{event.context}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">Source:</span>
                          <span className="text-purple-300">{event.source}</span>
                        </div>
                        
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gray-500" />
                            <span className="text-gray-400">{event.location}</span>
                          </div>
                        )}
                      </div>
                      
                      {event.linkedAssets && event.linkedAssets.length > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="text-gray-500">Assets:</span>
                          <span className="text-blue-300">{event.linkedAssets.length}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="flex items-center justify-between p-3 bg-gray-800/50 border-t border-gray-600">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span>Critical ({filteredEvents.filter(e => e.severity === 'critical').length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span>High ({filteredEvents.filter(e => e.severity === 'high').length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full opacity-70 animate-pulse"></div>
              <span>Predicted ({filteredEvents.filter(e => e.predictive).length})</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Live Tracking</span>
            </div>
            <div>•</div>
            <div>Updated: {currentTime.toLocaleTimeString()}</div>
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  )
}

export default TimelinePortal 