import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  AlertTriangle, 
  Bell, 
  Shield, 
  Target, 
  Radio, 
  Zap,
  Activity,
  WifiOff,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Eye,
  Settings,
  Volume2,
  VolumeX,
  RefreshCw,
  Filter,
  Maximize2,
  Minimize2,
  Download,
  Trash2,
  Archive,
  Play,
  Pause,
  RotateCcw,
  Users,
  Gauge,
  Smartphone,
  Satellite,
  Network,
  Database,
  Lock,
  Unlock,
  Skull,
  TrendingUp
} from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Alert, AlertDescription } from '../ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { useAlertsState, type ThreatAlert, type SystemAlert, type AlertSettings } from '../hooks/useAlertsState'
// Using simple button toggles instead of checkbox due to import issues

interface AlertsPortalProps {
  level: 2 | 3
  onLevelChange?: (level: 2 | 3) => void
  onClose?: () => void
}



const getThreatIcon = (type: string, severity: string) => {
  const colorClass = severity === 'critical' ? 'text-red-400' : 
                    severity === 'high' ? 'text-orange-400' : 
                    severity === 'medium' ? 'text-yellow-400' : 'text-blue-400'

  const className = `w-5 h-5 ${colorClass}`

  switch (type) {
    case 'drone': return <Target className={className} />
    case 'aircraft': return <Zap className={className} />
    case 'missile': return <TrendingUp className={className} />
    case 'ram': return <AlertTriangle className={className} />
    default: return <AlertCircle className={className} />
  }
}

const getSystemIcon = (type: string, severity: string) => {
  const colorClass = severity === 'critical' ? 'text-red-400' : 
                    severity === 'high' ? 'text-orange-400' : 
                    severity === 'medium' ? 'text-yellow-400' : 
                    severity === 'low' ? 'text-blue-400' : 'text-gray-400'

  const className = `w-5 h-5 ${colorClass}`

  switch (type) {
    case 'sensor': return <Activity className={className} />
    case 'effector': return <Shield className={className} />
    case 'network': return <Network className={className} />
    case 'power': return <Zap className={className} />
    case 'communication': return <Radio className={className} />
    case 'cyber': return <Skull className={className} />
    case 'ammo': return <Database className={className} />
    case 'interop': return <Satellite className={className} />
    default: return <AlertCircle className={className} />
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

const getThreatLevelColor = (level: string) => {
  switch (level) {
    case 'imminent': return 'bg-red-400'
    case 'probable': return 'bg-orange-400'
    case 'possible': return 'bg-yellow-400'
    case 'unlikely': return 'bg-blue-400'
    default: return 'bg-gray-400'
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active': return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Active</Badge>
    case 'acknowledged': return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Acknowledged</Badge>
    case 'resolved': return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Resolved</Badge>
    case 'escalated': return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Escalated</Badge>
    case 'maintenance': return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Maintenance</Badge>
    default: return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">{status}</Badge>
  }
}

const formatTimeAgo = (timestamp: Date) => {
  const now = new Date()
  const diff = now.getTime() - timestamp.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

const AlertsPortal: React.FC<AlertsPortalProps> = ({ level, onLevelChange, onClose }) => {
  // Use persistent state hook to maintain state across level changes (Level 2 ↔ Level 3)
  const {
    threatAlerts,
    systemAlerts,
    selectedAlertType,
    selectedSeverity,
    showResolved,
    settings,
    sortBy,
    refreshInterval,
    setSelectedAlertType,
    setSelectedSeverity,
    setShowResolved,
    setSettings,
    setSortBy,
    setRefreshInterval,
    handleAcknowledgeAlert,
    handleResolveAlert,
    handleEscalateAlert
  } = useAlertsState()

  const allAlerts = [...threatAlerts, ...systemAlerts].sort((a, b) => 
    sortBy === 'timestamp' ? b.timestamp.getTime() - a.timestamp.getTime() :
    sortBy === 'severity' ? (b.severity === 'critical' ? 1 : 0) - (a.severity === 'critical' ? 1 : 0) :
    0
  )

  const filteredAlerts = allAlerts.filter(alert => {
    if (selectedAlertType !== 'all') {
      if (selectedAlertType === 'threat' && !('threatLevel' in alert)) return false
      if (selectedAlertType === 'system' && !('system' in alert)) return false
    }
    if (selectedSeverity !== 'all' && alert.severity !== selectedSeverity) return false
    if (!showResolved && alert.status === 'resolved') return false
    return true
  })

  const criticalCount = allAlerts.filter(a => a.severity === 'critical' && a.status === 'active').length
  const activeCount = allAlerts.filter(a => a.status === 'active').length

  // Auto-refresh alerts
  useEffect(() => {
    const interval = setInterval(() => {
      // In real implementation, this would fetch new alerts from API
      console.log('Refreshing alerts...')
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [refreshInterval])



  const exportAlerts = () => {
    const data = JSON.stringify(filteredAlerts, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `alerts-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (level === 2) {
    return (
      <div className="flex flex-col h-full bg-gray-900/90 text-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
              {criticalCount} Critical
            </Badge>
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
              {activeCount} Active
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 p-4 border-b border-gray-700">
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Threat Alerts</span>
              <Target className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-xl font-bold text-orange-400">
              {threatAlerts.filter(a => a.status === 'active').length}
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">System Alerts</span>
              <Activity className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl font-bold text-blue-400">
              {systemAlerts.filter(a => a.status === 'active').length}
            </div>
          </div>
        </div>

        {/* Recent Alerts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredAlerts.slice(0, 6).map((alert) => (
            <motion.div
              key={alert.id}
              className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)} hover:bg-gray-800/30 transition-colors`}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {'threatLevel' in alert ? 
                    getThreatIcon(alert.type, alert.severity) : 
                    getSystemIcon(alert.type, alert.severity)
                  }
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">{alert.title}</span>
                      {getStatusBadge(alert.status)}
                    </div>
                    <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                      {alert.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">
                        {'system' in alert ? alert.system : alert.source}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(alert.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="border-t border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                className="border-gray-600 hover:bg-gray-800"
                onClick={() => setSettings(prev => ({ ...prev, audioEnabled: !prev.audioEnabled }))}
              >
                {settings.audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-gray-600 hover:bg-gray-800"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Level 3 Implementation
  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex flex-col h-full bg-gray-900/95 text-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
              {criticalCount} Critical
            </Badge>
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
              {activeCount} Active
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              {allAlerts.filter(a => a.status === 'resolved').length} Resolved
            </Badge>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-gray-600 hover:bg-gray-800"
            onClick={() => onLevelChange?.(2)}
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Controls */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center space-x-4">
              <Select value={selectedAlertType} onValueChange={setSelectedAlertType}>
                <SelectTrigger className="w-40 bg-gray-800 border-gray-600 text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600 text-gray-100">
                  <SelectItem value="all" className="text-gray-100 focus:bg-gray-700 focus:text-gray-100">All Alerts</SelectItem>
                  <SelectItem value="threat" className="text-gray-100 focus:bg-gray-700 focus:text-gray-100">Threat Alerts</SelectItem>
                  <SelectItem value="system" className="text-gray-100 focus:bg-gray-700 focus:text-gray-100">System Alerts</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger className="w-32 bg-gray-800 border-gray-600 text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600 text-gray-100">
                  <SelectItem value="all" className="text-gray-100 focus:bg-gray-700 focus:text-gray-100">All Levels</SelectItem>
                  <SelectItem value="critical" className="text-gray-100 focus:bg-gray-700 focus:text-gray-100">Critical</SelectItem>
                  <SelectItem value="high" className="text-gray-100 focus:bg-gray-700 focus:text-gray-100">High</SelectItem>
                  <SelectItem value="medium" className="text-gray-100 focus:bg-gray-700 focus:text-gray-100">Medium</SelectItem>
                  <SelectItem value="low" className="text-gray-100 focus:bg-gray-700 focus:text-gray-100">Low</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant={showResolved ? "default" : "outline"}
                  className={`w-6 h-6 p-0 ${showResolved ? 'bg-purple-600 hover:bg-purple-700' : 'border-gray-600 hover:bg-gray-800'}`}
                  onClick={() => setShowResolved(!showResolved)}
                >
                  {showResolved && <CheckCircle className="w-4 h-4" />}
                </Button>
                <span className="text-sm text-gray-300">Show Resolved</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                className="border-gray-600 hover:bg-gray-800"
                onClick={exportAlerts}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-gray-600 hover:bg-gray-800"
                onClick={() => setSettings(prev => ({ ...prev, audioEnabled: !prev.audioEnabled }))}
              >
                {settings.audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-gray-600 hover:bg-gray-800"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Alerts List */}
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-2 p-4">
              <AnimatePresence>
                {filteredAlerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)} hover:bg-gray-800/30 transition-colors`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="flex flex-col items-center space-y-2">
                          {'threatLevel' in alert ? 
                            getThreatIcon(alert.type, alert.severity) : 
                            getSystemIcon(alert.type, alert.severity)
                          }
                          {'threatLevel' in alert && (
                            <div className={`w-2 h-2 rounded-full ${getThreatLevelColor(alert.threatLevel)}`} />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <h3 className="font-semibold text-lg">{alert.title}</h3>
                              {getStatusBadge(alert.status)}
                              {'confidence' in alert && (
                                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                                  {alert.confidence}% Confidence
                                </Badge>
                              )}
                            </div>
                            <span className="text-sm text-gray-400">
                              {formatTimeAgo(alert.timestamp)}
                            </span>
                          </div>
                          
                          <p className="text-gray-300 mb-3">{alert.description}</p>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">Source: </span>
                              <span className="text-gray-200">
                                {'system' in alert ? alert.system : alert.source}
                              </span>
                            </div>
                            {'location' in alert && (
                              <div>
                                <span className="text-gray-400">Location: </span>
                                <span className="text-gray-200">{alert.location}</span>
                              </div>
                            )}
                            {'speed' in alert && alert.speed && (
                              <div>
                                <span className="text-gray-400">Speed: </span>
                                <span className="text-gray-200">{alert.speed} kt</span>
                              </div>
                            )}
                            {'altitude' in alert && alert.altitude && (
                              <div>
                                <span className="text-gray-400">Altitude: </span>
                                <span className="text-gray-200">{alert.altitude} ft</span>
                              </div>
                            )}
                          </div>

                          {'countermeasures' in alert && alert.countermeasures && (
                            <div className="mt-3">
                              <span className="text-gray-400 text-sm">Available Countermeasures: </span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {alert.countermeasures.map((cm, index) => (
                                  <Badge key={index} className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                                    {cm}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {'remediationSteps' in alert && alert.remediationSteps && (
                            <div className="mt-3">
                              <span className="text-gray-400 text-sm">Remediation Steps: </span>
                              <ul className="list-disc list-inside text-sm text-gray-300 mt-1">
                                {alert.remediationSteps.map((step, index) => (
                                  <li key={index}>{step}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2 ml-4">
                        {alert.status === 'active' && (
                          <>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-yellow-600 hover:bg-yellow-700/20"
                                  onClick={() => handleAcknowledgeAlert(alert.id)}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="bg-gray-800 text-gray-100 border border-gray-600">Acknowledge Alert</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-green-600 hover:bg-green-700/20"
                                  onClick={() => handleResolveAlert(alert.id)}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="bg-gray-800 text-gray-100 border border-gray-600">Resolve Alert</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-600 hover:bg-red-700/20"
                                  onClick={() => handleEscalateAlert(alert.id)}
                                >
                                  <TrendingUp className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="bg-gray-800 text-gray-100 border border-gray-600">Escalate Alert</TooltipContent>
                            </Tooltip>
                          </>
                        )}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-600 hover:bg-gray-700/20"
                            >
                              <MapPin className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-800 text-gray-100 border border-gray-600">View on Map</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        <div className="w-80 border-l border-gray-700 bg-gray-800/50">
          <div className="p-4 border-b border-gray-700">
            <h3 className="font-semibold mb-4">Alert Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Audio Alerts</span>
                <Button
                  size="sm"
                  variant={settings.audioEnabled ? "default" : "outline"}
                  className={`w-6 h-6 p-0 ${settings.audioEnabled ? 'bg-purple-600 hover:bg-purple-700' : 'border-gray-600 hover:bg-gray-800'}`}
                  onClick={() => setSettings(prev => ({ ...prev, audioEnabled: !prev.audioEnabled }))}
                >
                  {settings.audioEnabled && <CheckCircle className="w-4 h-4" />}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Visual Alerts</span>
                <Button
                  size="sm"
                  variant={settings.visualEnabled ? "default" : "outline"}
                  className={`w-6 h-6 p-0 ${settings.visualEnabled ? 'bg-purple-600 hover:bg-purple-700' : 'border-gray-600 hover:bg-gray-800'}`}
                  onClick={() => setSettings(prev => ({ ...prev, visualEnabled: !prev.visualEnabled }))}
                >
                  {settings.visualEnabled && <CheckCircle className="w-4 h-4" />}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Haptic Feedback</span>
                <Button
                  size="sm"
                  variant={settings.hapticEnabled ? "default" : "outline"}
                  className={`w-6 h-6 p-0 ${settings.hapticEnabled ? 'bg-purple-600 hover:bg-purple-700' : 'border-gray-600 hover:bg-gray-800'}`}
                  onClick={() => setSettings(prev => ({ ...prev, hapticEnabled: !prev.hapticEnabled }))}
                >
                  {settings.hapticEnabled && <CheckCircle className="w-4 h-4" />}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Auto-Acknowledge</span>
                <Button
                  size="sm"
                  variant={settings.autoAcknowledge ? "default" : "outline"}
                  className={`w-6 h-6 p-0 ${settings.autoAcknowledge ? 'bg-purple-600 hover:bg-purple-700' : 'border-gray-600 hover:bg-gray-800'}`}
                  onClick={() => setSettings(prev => ({ ...prev, autoAcknowledge: !prev.autoAcknowledge }))}
                >
                  {settings.autoAcknowledge && <CheckCircle className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>

          <div className="p-4 border-b border-gray-700">
            <h4 className="font-medium mb-3 text-sm">Priority Filtering</h4>
            <Select value={settings.priorityFilter} onValueChange={(value) => setSettings(prev => ({ ...prev, priorityFilter: value }))}>
              <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 text-gray-100">
                <SelectItem value="critical" className="text-gray-100 focus:bg-gray-600 focus:text-gray-100">Critical Only</SelectItem>
                <SelectItem value="high" className="text-gray-100 focus:bg-gray-600 focus:text-gray-100">High & Above</SelectItem>
                <SelectItem value="medium" className="text-gray-100 focus:bg-gray-600 focus:text-gray-100">Medium & Above</SelectItem>
                <SelectItem value="low" className="text-gray-100 focus:bg-gray-600 focus:text-gray-100">All Levels</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-4">
            <h4 className="font-medium mb-3 text-sm">Role-Based Alerts</h4>
            <Select value={settings.roleBasedFilter} onValueChange={(value) => setSettings(prev => ({ ...prev, roleBasedFilter: value }))}>
              <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600 text-gray-100">
                <SelectItem value="tactical" className="text-gray-100 focus:bg-gray-600 focus:text-gray-100">Tactical</SelectItem>
                <SelectItem value="strategic" className="text-gray-100 focus:bg-gray-600 focus:text-gray-100">Strategic</SelectItem>
                <SelectItem value="technical" className="text-gray-100 focus:bg-gray-600 focus:text-gray-100">Technical</SelectItem>
                <SelectItem value="all" className="text-gray-100 focus:bg-gray-600 focus:text-gray-100">All Roles</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
    </TooltipProvider>
  )
}

export default AlertsPortal 