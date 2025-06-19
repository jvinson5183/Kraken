import React from 'react'
import { motion } from 'framer-motion'
import { 
  Clock, 
  Shield, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  Radio, 
  Satellite, 
  Plane, 
  Users, 
  Bell,
  Activity,
  Zap,
  Eye,
  Navigation
} from 'lucide-react'

interface TimelineEvent {
  id: string
  time: string
  title: string
  description: string
  type: 'mission' | 'alert' | 'system' | 'intel' | 'comms'
  status: 'completed' | 'active' | 'pending' | 'critical'
  location?: string
}

const timelineEvents: TimelineEvent[] = [
  {
    id: '1',
    time: '14:32:15',
    title: 'Operation Thunder commenced',
    description: 'Alpha team deployed to sector 7-G. All systems operational.',
    type: 'mission',
    status: 'active',
    location: 'Sector 7-G'
  },
  {
    id: '2',
    time: '14:28:43',
    title: 'Satellite uplink established',
    description: 'Secure communication channel active with CENTCOM.',
    type: 'comms',
    status: 'completed',
    location: 'CENTCOM'
  },
  {
    id: '3',
    time: '14:25:12',
    title: 'Threat assessment updated',
    description: 'Enemy movement detected in grid reference 345.127. Adjusting patrol routes.',
    type: 'intel',
    status: 'critical',
    location: 'Grid 345.127'
  },
  {
    id: '4',
    time: '14:22:08',
    title: 'Asset repositioning',
    description: 'Bravo squad moving to overwatch position. ETA 5 minutes.',
    type: 'mission',
    status: 'active',
    location: 'Overwatch Point Alpha'
  },
  {
    id: '5',
    time: '14:18:55',
    title: 'System diagnostic completed',
    description: 'All defensive systems online. Battery levels at 98%.',
    type: 'system',
    status: 'completed'
  },
  {
    id: '6',
    time: '14:15:33',
    title: 'Perimeter breach alert',
    description: 'Motion detected at checkpoint Charlie. Investigating.',
    type: 'alert',
    status: 'completed',
    location: 'Checkpoint Charlie'
  },
  {
    id: '7',
    time: '14:12:21',
    title: 'Drone reconnaissance initiated',
    description: 'UAV-7 deployed for area surveillance. Flight path programmed.',
    type: 'intel',
    status: 'completed',
    location: 'AO Bravo'
  },
  {
    id: '8',
    time: '14:09:47',
    title: 'Communications check',
    description: 'All units report ready status. Frequency clear.',
    type: 'comms',
    status: 'completed'
  }
]

function getEventIcon(type: string, status: string) {
  const iconClass = status === 'critical' ? 'text-red-400' : 
                   status === 'active' ? 'text-purple-400' : 
                   status === 'completed' ? 'text-green-400' : 'text-gray-400'

  switch (type) {
    case 'mission':
      return <Target className={`w-5 h-5 ${iconClass}`} />
    case 'alert':
      return <AlertTriangle className={`w-5 h-5 ${iconClass}`} />
    case 'system':
      return <Activity className={`w-5 h-5 ${iconClass}`} />
    case 'intel':
      return <Eye className={`w-5 h-5 ${iconClass}`} />
    case 'comms':
      return <Radio className={`w-5 h-5 ${iconClass}`} />
    default:
      return <Clock className={`w-5 h-5 ${iconClass}`} />
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'critical':
      return 'border-red-500/50 bg-red-500/10'
    case 'active':
      return 'border-purple-500/50 bg-purple-500/10'
    case 'completed':
      return 'border-green-500/50 bg-green-500/10'
    case 'pending':
      return 'border-yellow-500/50 bg-yellow-500/10'
    default:
      return 'border-gray-500/50 bg-gray-500/10'
  }
}

function getStatusIndicator(status: string) {
  switch (status) {
    case 'critical':
      return 'bg-red-400'
    case 'active':
      return 'bg-purple-400'
    case 'completed':
      return 'bg-green-400'
    case 'pending':
      return 'bg-yellow-400'
    default:
      return 'bg-gray-400'
  }
}

export function Timeline() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-purple-400" />
        <h2 className="text-gray-300">Operational Timeline</h2>
        <div className="flex-1 h-px bg-gray-600/30"></div>
        <span className="text-xs text-gray-500">LIVE</span>
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-gray-600/30 to-transparent"></div>
          
          <div className="space-y-4">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-start gap-4"
              >
                {/* Timeline dot */}
                <div className="relative z-10 flex-shrink-0">
                  <div className={`w-3 h-3 rounded-full ${getStatusIndicator(event.status)} ring-2 ring-slate-800`}></div>
                </div>

                {/* Event card */}
                <div className={`flex-1 p-3 rounded-lg border backdrop-blur-sm ${getStatusColor(event.status)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {getEventIcon(event.type, event.status)}
                      <span className="text-sm text-gray-300 font-mono font-medium">{event.time}</span>
                      {event.location && (
                        <>
                          <span className="text-gray-600">•</span>
                          <span className="text-sm text-gray-400">{event.location}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {event.status === 'active' && (
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                      )}
                      <span className={`text-xs px-2 py-1 rounded ${
                        event.status === 'critical' ? 'bg-red-500/20 text-red-300' :
                        event.status === 'active' ? 'bg-purple-500/20 text-purple-300' :
                        event.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                        'bg-gray-500/20 text-gray-300'
                      }`}>
                        {event.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-gray-200 mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{event.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline controls */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-600/30">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span>Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span>Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Complete</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Navigation className="w-4 h-4" />
          <span>Auto-scroll enabled</span>
        </div>
      </div>
    </div>
  )
}