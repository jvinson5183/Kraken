'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { X, Minimize2 } from 'lucide-react'
import { PortalData } from './constants/portalConfigs'
import { Portal } from './Portal'
import MapPortal from './portals/MapPortal'
import CameraPortal from './portals/SimpleCameraPortal'
import TimelinePortal from './portals/TimelinePortal'
import AlertsPortal from './portals/AlertsPortal'
import DataViewPortal from './portals/DataViewPortal'
import WeatherPortalComponent from './portals/WeatherPortal'

interface FullscreenPortalProps {
  portal: PortalData
  onClose: () => void
  onMinimize: () => void
}

export function FullscreenPortal({ portal, onClose, onMinimize }: FullscreenPortalProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="fixed z-[250] bg-gray-900/95 backdrop-blur-lg border border-gray-600/30 rounded-xl shadow-2xl shadow-purple-500/10"
      style={{
        top: '140px', // Below AI Avatar area (96px + margins)
        left: '120px', // Clear space for expanded left tray
        right: '120px', // Clear space for expanded right tray  
        bottom: '80px', // Leave space for bottom tray
      }}
    >
      {/* Single Portal Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-700 rounded-t-xl bg-gray-900/90 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="text-gray-300 text-xl">
              {portal.icon}
            </div>
            <div>
              <h2 className="text-xl text-gray-200">{portal.title}</h2>
              <div className="text-sm text-purple-400">Level 3 - Expanded View</div>
            </div>
          </div>
          
          {/* Status Information for Map Portal */}
          {portal.type === 'map' && (
            <div className="flex items-center gap-4 text-sm border-l border-gray-600 pl-6">
              <div className="text-center">
                <div className="text-gray-400 text-xs">Last Update</div>
                <div className="text-gray-200 font-mono text-xs" id="map-last-update">--:--:--</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400 text-xs">Active Assets</div>
                <div className="text-green-400 font-medium" id="map-assets-count">8</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400 text-xs">Threats Detected</div>
                <div className="text-red-400 font-medium" id="map-threats-count">3</div>
              </div>
            </div>
          )}
          
          {/* Status Information for Camera Portal */}
          {portal.type === 'camera-capability' && (
            <div className="flex items-center gap-4 text-sm border-l border-gray-600 pl-6">
              <div className="text-center">
                <div className="text-gray-400 text-xs">Last Update</div>
                <div className="text-gray-200 font-mono text-xs" id="camera-last-update">--:--:--</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400 text-xs">Active Feeds</div>
                <div className="text-green-400 font-medium" id="camera-feeds-count">2</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400 text-xs">Tracked Threats</div>
                <div className="text-orange-400 font-medium" id="camera-threats-count">2</div>
              </div>
            </div>
          )}
          
          {/* Status Information for Timeline Portal */}
          {portal.type === 'timeline' && (
            <div className="flex items-center gap-4 text-sm border-l border-gray-600 pl-6">
              <div className="text-center">
                <div className="text-gray-400 text-xs">Live Events</div>
                <div className="text-green-400 font-medium" id="timeline-events-count">12</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400 text-xs">Critical Events</div>
                <div className="text-red-400 font-medium" id="timeline-critical-count">3</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400 text-xs">Time Range</div>
                <div className="text-purple-300 font-medium" id="timeline-range">24H</div>
              </div>
            </div>
          )}
          
          {/* Status Information for Data View Portal */}
          {portal.type === 'data-view' && (
            <div className="flex items-center gap-4 text-sm border-l border-gray-600 pl-6">
              <div className="text-center">
                <div className="text-gray-400 text-xs">Data Streams</div>
                <div className="text-green-400 font-medium" id="data-streams-count">8</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400 text-xs">Systems Online</div>
                <div className="text-blue-400 font-medium" id="systems-online-count">6/8</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400 text-xs">Anomalies</div>
                <div className="text-orange-400 font-medium" id="anomalies-count">2</div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Minimize button - icon only */}
          <button
            onClick={onMinimize}
            className="p-2 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-all duration-200"
            title="Minimize to Level 2"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
            title="Close Portal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(rgba(156, 163, 175, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(156, 163, 175, 0.2) 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }}
          />
        </div>
        
        {/* Purple accent gradients */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-purple-500/10 to-transparent blur-3xl" />
        
        {/* Corner accents */}
        <div className="absolute top-16 right-0 w-32 h-32 bg-gradient-to-bl from-gray-600/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-gray-600/10 to-transparent" />
      </div>

      {/* Scrollable Content Area - No additional header */}
      <div className="relative z-10 flex flex-col" style={{ height: 'calc(100vh - 140px - 80px - 120px)' }}>
        <div className="flex-1 p-6 overflow-hidden min-h-0">
          {renderFullscreenPortalContent(portal, onClose, onMinimize)}
        </div>
      </div>

      {/* Status indicators */}
      <div className="absolute bottom-4 left-6 flex items-center gap-4 text-xs z-[260]">
        <div className="flex items-center gap-1 text-purple-400">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
          <span>Level 3 Active</span>
        </div>
        <div className="text-gray-500">
          Portal ID: {portal.id}
        </div>
        <div className="text-gray-500">
          Type: {portal.type.toUpperCase()}
        </div>
      </div>

      {/* Performance indicator */}
      <div className="absolute bottom-4 right-6 text-xs text-gray-500 z-[260]">
        <div className="flex items-center gap-1">
          <div className="w-1 h-1 bg-green-400 rounded-full" />
          <span>Optimal Performance</span>
        </div>
      </div>
    </motion.div>
  )
}

// Render fullscreen-optimized content based on portal type
function renderFullscreenPortalContent(portal: PortalData, onClose: () => void, onMinimize: () => void) {
  switch (portal.type) {
    case 'system':
      return <FullscreenSystemPortal />
    case 'weather':
      return <WeatherPortalComponent level={3} onLevelChange={(level) => {
        if (level === 2) {
          onMinimize()
        }
      }} onClose={onClose} />
    case 'map':
      return (
        <MapPortal 
          level={3} 
          onLevelChange={(level) => {
            if (level === 2) {
              onMinimize()
            }
          }} 
          onClose={onClose} 
          context={portal.context ? { action: portal.context.action as any, location: portal.context.location, zoomLevel: portal.context.zoomLevel } : undefined}
        />
      )
    case 'camera-capability':
      return (
        <CameraPortal 
          level={3} 
          onLevelChange={(level) => {
            if (level === 2) {
              onMinimize()
            }
          }} 
          onClose={onClose} 
        />
      )
    case 'data-view':
      return (
        <DataViewPortal 
          level={3} 
          onLevelChange={(level) => {
            if (level === 2) {
              onMinimize()
            }
          }} 
          onClose={onClose} 
        />
      )
    case 'timeline':
      return (
        <TimelinePortal 
          level={3} 
          onLevelChange={(level) => {
            if (level === 2) {
              onMinimize()
            }
          }} 
          onClose={onClose} 
        />
      )
    case 'alerts':
      return (
        <AlertsPortal 
          level={3} 
          onLevelChange={(level) => {
            if (level === 2) {
              onMinimize()
            }
          }} 
          onClose={onClose} 
          context={portal.context ? { action: portal.context.action || '', parameters: portal.context.parameters } : undefined}
        />
      )
    case 'network-diagram':
      return <FullscreenNetworkPortal />
    case 'confidence-scoring':
      return <FullscreenConfidencePortal />
    default:
      return (
        <div className="flex items-center justify-center h-full text-gray-400">
          <span>{portal.title} Portal - Level 3 Coming Soon</span>
        </div>
      )
  }
}

// Fullscreen System Portal
function FullscreenSystemPortal() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* System Overview */}
      <div className="bg-gray-800/30 rounded-lg p-6">
        <h4 className="text-lg text-gray-200 mb-4">System Overview</h4>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">CPU Usage</span>
            <span className="text-green-400">23%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-green-400 h-2 rounded-full" style={{ width: '23%' }}></div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Memory</span>
            <span className="text-yellow-400">67%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '67%' }}></div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Storage</span>
            <span className="text-green-400">45%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-green-400 h-2 rounded-full" style={{ width: '45%' }}></div>
          </div>
        </div>
      </div>

      {/* Active Services */}
      <div className="bg-gray-800/30 rounded-lg p-6">
        <h4 className="text-lg text-gray-200 mb-4">Active Services</h4>
        <div className="space-y-3">
          {['Kraken Core', 'Tactical Network', 'Data Correlation', 'Threat Analysis', 'Communications Hub', 'Sensor Array'].map((service, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-gray-300">{service}</span>
              </div>
              <span className="text-green-400 text-sm">RUNNING</span>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-gray-800/30 rounded-lg p-6">
        <h4 className="text-lg text-gray-200 mb-4">Performance</h4>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl text-green-400 mb-1">99.7%</div>
            <div className="text-gray-400 text-sm">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl text-purple-400 mb-1">1.2ms</div>
            <div className="text-gray-400 text-sm">Avg Response</div>
          </div>
          <div className="text-center">
            <div className="text-3xl text-blue-400 mb-1">847</div>
            <div className="text-gray-400 text-sm">Active Connections</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Fullscreen Weather Portal
function FullscreenWeatherPortal() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Current Weather */}
      <div className="bg-gray-800/30 rounded-lg p-6">
        <h4 className="text-lg text-gray-200 mb-4">Current Conditions</h4>
        <div className="text-center mb-6">
          <div className="text-6xl text-yellow-400 mb-2">☀️</div>
          <div className="text-4xl text-gray-200 mb-2">72°F</div>
          <div className="text-gray-400">Clear Skies</div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-gray-400 text-sm">Humidity</div>
            <div className="text-gray-200">45%</div>
          </div>
          <div className="text-center">
            <div className="text-gray-400 text-sm">Wind</div>
            <div className="text-gray-200">8 mph NW</div>
          </div>
          <div className="text-center">
            <div className="text-gray-400 text-sm">Pressure</div>
            <div className="text-gray-200">30.15 inHg</div>
          </div>
          <div className="text-center">
            <div className="text-gray-400 text-sm">Visibility</div>
            <div className="text-gray-200">10+ miles</div>
          </div>
        </div>
      </div>

      {/* Extended Forecast */}
      <div className="bg-gray-800/30 rounded-lg p-6">
        <h4 className="text-lg text-gray-200 mb-4">5-Day Forecast</h4>
        <div className="space-y-3">
          {[
            { day: 'Today', icon: '☀️', high: 74, low: 58, condition: 'Sunny' },
            { day: 'Tomorrow', icon: '⛅', high: 71, low: 55, condition: 'Partly Cloudy' },
            { day: 'Wednesday', icon: '🌧️', high: 68, low: 52, condition: 'Light Rain' },
            { day: 'Thursday', icon: '☀️', high: 75, low: 59, condition: 'Sunny' },
            { day: 'Friday', icon: '⛅', high: 73, low: 57, condition: 'Partly Cloudy' }
          ].map((forecast, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{forecast.icon}</span>
                <span className="text-gray-300">{forecast.day}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm">{forecast.condition}</span>
                <span className="text-gray-200">{forecast.high}°/{forecast.low}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Fullscreen Map Portal
function FullscreenMapPortal() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Map Display */}
      <div className="lg:col-span-2 bg-gray-800/30 rounded-lg p-6">
        <h4 className="text-lg text-gray-200 mb-4">Tactical Overview - AO THUNDER</h4>
        <div className="bg-gray-700/50 rounded h-96 relative overflow-hidden">
          {/* Grid overlay */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }}
          />
          
          {/* Center coordinates */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-purple-400 mb-2">CENTER POINT</div>
              <div className="text-gray-300">34.0522°, -118.2437°</div>
              <div className="text-gray-500 mt-1">MGRS: 11SMT 92834 25931</div>
            </div>
          </div>

          {/* Asset markers */}
          <div className="absolute top-4 left-8 w-3 h-3 bg-green-400 rounded-full animate-pulse" title="TEAM-A" />
          <div className="absolute top-12 right-16 w-3 h-3 bg-blue-400 rounded-full animate-pulse" title="UAV-302" />
          <div className="absolute bottom-8 left-12 w-3 h-3 bg-yellow-400 rounded-full" title="OVERWATCH" />
          <div className="absolute bottom-16 right-8 w-3 h-3 bg-orange-400 rounded-full animate-pulse" title="THREAT" />
          
          {/* Map controls */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            <button className="px-3 py-1 bg-gray-800/60 text-purple-400 rounded text-sm">TACTICAL</button>
            <button className="px-3 py-1 bg-gray-700/60 text-gray-400 rounded text-sm">SATELLITE</button>
          </div>
        </div>
      </div>

      {/* Assets & Waypoints */}
      <div className="space-y-6">
        <div className="bg-gray-800/30 rounded-lg p-6">
          <h4 className="text-lg text-gray-200 mb-4">Active Assets</h4>
          <div className="space-y-3">
            {[
              { id: 'UAV-302', type: 'DRONE', status: 'ACTIVE', pos: '34.0515, -118.2445' },
              { id: 'TEAM-A', type: 'GROUND', status: 'MOVING', pos: '34.0509, -118.2421' },
              { id: 'OVERWATCH', type: 'OBSERVER', status: 'STATIC', pos: '34.0534, -118.2401' }
            ].map((asset, index) => (
              <div key={index} className="p-3 bg-gray-700/30 rounded">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-300">{asset.id}</span>
                  <span className="text-green-400 text-sm">{asset.status}</span>
                </div>
                <div className="text-xs text-gray-500">{asset.pos}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800/30 rounded-lg p-6">
          <h4 className="text-lg text-gray-200 mb-4">Waypoints</h4>
          <div className="space-y-3">
            {[
              { id: 'WP001', name: 'Observation Point Alpha', priority: 'HIGH' },
              { id: 'WP002', name: 'Landing Zone Bravo', priority: 'MEDIUM' },
              { id: 'WP003', name: 'Rally Point Charlie', priority: 'LOW' },
              { id: 'WP004', name: 'Checkpoint Delta', priority: 'HIGH' }
            ].map((waypoint, index) => (
              <div key={index} className="p-3 bg-gray-700/30 rounded">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-300">{waypoint.id}</span>
                  <span className={`text-sm ${waypoint.priority === 'HIGH' ? 'text-red-400' : waypoint.priority === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400'}`}>
                    {waypoint.priority}
                  </span>
                </div>
                <div className="text-xs text-gray-500">{waypoint.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Placeholder fullscreen portals
function FullscreenNetworkPortal() {
  return <FullscreenDefaultPortal title="Network Diagram" type="network-diagram" />
}

function FullscreenConfidencePortal() {
  return <FullscreenDefaultPortal title="Confidence Scoring Engine" type="confidence-scoring" />
}

// Default fullscreen portal
function FullscreenDefaultPortal({ title, type }: { title: string, type: string }) {
  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-6">⚡</div>
      <h3 className="text-2xl text-gray-200 mb-4">{title}</h3>
      <div className="text-gray-400 mb-6">Level 3 - Expanded Mode Active</div>
      <div className="text-purple-400">Portal Type: {type.toUpperCase()}</div>
      <div className="text-gray-500 mt-4">Comprehensive functionality and enhanced data visualization</div>
    </div>
  )
}