import React, { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet'
import { Icon } from 'leaflet'
import { motion } from 'framer-motion'
import { Maximize2, Minimize2, ZoomIn, ZoomOut, Layers, Target, Shield, X } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default icon issue with webpack
delete (Icon.Default.prototype as any)._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjUgMEMxOS40MDM2IDAgMjUgNS41OTY0NCAyNSAxMi41QzI1IDE5LjQwMzYgMTkuNDAzNiAyNSAxMi41IDI1QzUuNTk2NDQgMjUgMCAxOS40MDM2IDAgMTIuNUMwIDUuNTk2NDQgNS41OTY0NCAwIDEyLjUgMFoiIGZpbGw9IiNBODU1RjciLz4KPHBhdGggZD0iTTEyLjUgMzVMMTIuNSA0MSIgc3Ryb2tlPSIjQTg1NUY3IiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+',
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjUgMEMxOS40MDM2IDAgMjUgNS41OTY0NCAyNSAxMi41QzI1IDE5LjQwMzYgMTkuNDAzNiAyNSAxMi41IDI1QzUuNTk2NDQgMjUgMCAxOS40MDM2IDAgMTIuNUMwIDUuNTk2NDQgNS41OTY0NCAwIDEyLjUgMFoiIGZpbGw9IiNBODU1RjciLz4KPHBhdGggZD0iTTEyLjUgMzVMMTIuNSA0MSIgc3Ryb2tlPSIjQTg1NUY3IiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+',
  shadowUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDEiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCA0MSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGVsbGlwc2UgY3g9IjIwLjUiIGN5PSIyMC41IiByeD0iMjAuNSIgcnk9IjIwLjUiIGZpbGw9InJnYmEoMCwwLDAsMC4yKSIvPgo8L3N2Zz4=',
})

interface Asset {
  id: string
  type: 'friendly' | 'enemy' | 'unknown' | 'sensor' | 'effector'
  position: [number, number]
  name: string
  status: 'online' | 'offline' | 'maintenance'
  details?: {
    speed?: number
    altitude?: number
    heading?: number
    ammo?: number
    fuel?: number
  }
}

interface ThreatTrack {
  id: string
  position: [number, number]
  trajectory: [number, number][]
  type: 'drone' | 'aircraft' | 'missile' | 'unknown'
  confidence: number
  threat_level: 'low' | 'medium' | 'high' | 'critical'
  speed: number
  heading: number
  altitude: number
  iff_status: 'friend' | 'foe' | 'unknown'
}

interface EngagementZone {
  id: string
  center: [number, number]
  radius: number
  type: 'no_fly' | 'engagement' | 'restricted'
  active: boolean
}

interface MapPortalProps {
  level: 2 | 3
  onLevelChange?: (level: 2 | 3) => void
  onClose?: () => void
  context?: {
    action?: 'zoom_to' | 'show_threats' | 'show_assets' | 'center_on'
    location?: string
    zoomLevel?: number
  }
}

// Sample data - replace with real sensor feeds - Tel Aviv Area of Operations
const SAMPLE_ASSETS = [
  {
    id: 'sensor-1',
    type: 'sensor',
    position: [32.0853, 34.7818] as [number, number],
    name: 'Sentinel Radar',
    status: 'online'
  },
  {
    id: 'effector-1', 
    type: 'effector',
    position: [32.0890, 34.7750] as [number, number],
    name: 'Iron Dome Battery',
    status: 'online'
  },
  {
    id: 'friendly-1',
    type: 'friendly',
    position: [32.0820, 34.7900] as [number, number],
    name: 'Apache-01',
    status: 'online'
  },
  {
    id: 'sensor-2',
    type: 'sensor',
    position: [32.0950, 34.7850] as [number, number],
    name: 'Aegis Radar',
    status: 'online'
  },
  {
    id: 'friendly-2',
    type: 'friendly',
    position: [32.0780, 34.7700] as [number, number],
    name: 'Blackhawk-02',
    status: 'online'
  }
]

const SAMPLE_THREATS = [
  {
    id: 'threat-1',
    position: [32.4000, 35.2000] as [number, number],
    trajectory: [
      [32.6000, 48.5000] as [number, number], // Iran origin
      [32.5500, 46.0000] as [number, number], // Over Iraq
      [32.5000, 43.0000] as [number, number], // Eastern Syria
      [32.4500, 40.0000] as [number, number], // Western Syria
      [32.4200, 37.5000] as [number, number], // Eastern Turkey/Syria border
      [32.4000, 35.2000] as [number, number]  // Current position approaching Tel Aviv
    ],
    type: 'drone',
    confidence: 85,
    threat_level: 'medium' as const
  },
  {
    id: 'threat-2',
    position: [32.3000, 35.5000] as [number, number],
    trajectory: [
      [32.4000, 53.7000] as [number, number], // Iran origin (Isfahan area)
      [32.3800, 50.0000] as [number, number], // Central Iran
      [32.3600, 46.5000] as [number, number], // Iran-Iraq border
      [32.3400, 42.0000] as [number, number], // Over Iraq
      [32.3200, 38.5000] as [number, number], // Syria
      [32.3000, 35.5000] as [number, number]  // Current position approaching Tel Aviv
    ],
    type: 'missile',
    confidence: 92,
    threat_level: 'high' as const
  }
]

const SAMPLE_ZONES = [
  {
    id: 'zone-1',
    center: [32.0853, 34.7818] as [number, number],
    radius: 1500,
    type: 'engagement' as const,
    active: true
  },
  {
    id: 'zone-2',
    center: [32.0800, 34.7700] as [number, number],
    radius: 1000,
    type: 'no_fly' as const,
    active: true
  }
]

const createAssetIcon = (type: string, status: string) => {
  const color = status === 'online' ? '#22c55e' : '#ef4444'
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12.5" cy="12.5" r="10" fill="${color}" stroke="#1f2937" stroke-width="2"/>
      </svg>
    `)}`,
    iconSize: [25, 25],
    iconAnchor: [12.5, 12.5]
  })
}

const getThreatColor = (level: string) => {
  switch (level) {
    case 'critical': return '#ef4444'
    case 'high': return '#f97316'
    case 'medium': return '#eab308'
    case 'low': return '#22c55e'
    default: return '#6b7280'
  }
}

const getZoneColor = (type: string) => {
  switch (type) {
    case 'no_fly': return '#ef4444'
    case 'engagement': return '#a855f7'
    case 'restricted': return '#f59e0b'
    default: return '#6b7280'
  }
}

// Function to calculate bounds that include all data points
const calculateMapBounds = () => {
  const allPoints: [number, number][] = []
  
  // Add all asset positions
  SAMPLE_ASSETS.forEach(asset => allPoints.push(asset.position))
  
  // Add all threat positions and trajectory points
  SAMPLE_THREATS.forEach(threat => {
    allPoints.push(threat.position)
    threat.trajectory.forEach(point => allPoints.push(point))
  })
  
  // Add zone centers with radius consideration
  SAMPLE_ZONES.forEach(zone => {
    const radiusInDegrees = zone.radius / 111320 // Convert meters to degrees (approximate)
    allPoints.push([zone.center[0] + radiusInDegrees, zone.center[1] + radiusInDegrees])
    allPoints.push([zone.center[0] - radiusInDegrees, zone.center[1] - radiusInDegrees])
  })
  
  if (allPoints.length === 0) return null
  
  const lats = allPoints.map(point => point[0])
  const lngs = allPoints.map(point => point[1])
  
  return {
    north: Math.max(...lats),
    south: Math.min(...lats),
    east: Math.max(...lngs),
    west: Math.min(...lngs)
  }
}

// Component to handle map resizing and fitting bounds when level changes
const MapResizeHandler: React.FC<{ level: number }> = ({ level }) => {
  const map = useMap()
  
  useEffect(() => {
    // Small delay to ensure DOM has updated
    const timer = setTimeout(() => {
      map.invalidateSize()
      
      // Fit map to show all data points
      const bounds = calculateMapBounds()
      if (bounds) {
        map.fitBounds([
          [bounds.south, bounds.west],
          [bounds.north, bounds.east]
        ], {
          padding: [20, 20], // Add padding around the bounds
          maxZoom: level === 2 ? 14 : 16 // Different max zoom for different levels
        })
      }
    }, 100)
    
    return () => clearTimeout(timer)
  }, [level, map])
  
  return null
}

// Component to handle programmatic map navigation
const MapNavigationHandler: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap()

  useEffect(() => {
    console.log('🗺️ MapNavigationHandler: Setting view to', center, 'zoom', zoom)
    map.setView(center, zoom, { animate: true, duration: 1.5 })
  }, [center, zoom, map])

  return null
}

// Geocoding function to convert location names to coordinates
const geocodeLocation = async (location: string): Promise<{ lat: number; lon: number } | null> => {
  try {
    console.log('🗺️ Geocoding location:', location)
    
    const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=10&language=en&format=json`
    console.log('🌍 Geocoding URL:', geocodeUrl)
    
    const response = await fetch(geocodeUrl)
    console.log('📍 Geocoding response status:', response.status)
    
    if (response.ok) {
      const data = await response.json()
      console.log('🎯 Geocoding response data:', data)
      if (data.results && data.results.length > 0) {
        console.log(`✅ Found ${data.results.length} geocoding results`)
        
        const bestMatch = data.results[0]
        console.log('🏙️ Using first result:', bestMatch)
        
        const coords = { lat: bestMatch.latitude, lon: bestMatch.longitude }
        console.log('📍 Selected coordinates:', coords, 'for location:', `${bestMatch.name}, ${bestMatch.admin1 || ''}, ${bestMatch.country}`)
        return coords
      } else {
        console.log('❌ No results found in geocoding response')
      }
    } else {
      console.error('🚫 Geocoding API failed with status:', response.status)
    }
    
    // Fallback to hardcoded coordinates for common locations
    const locationMap: { [key: string]: { lat: number; lon: number } } = {
      'tel aviv, israel': { lat: 32.0853, lon: 34.7818 },
      'tel aviv': { lat: 32.0853, lon: 34.7818 },
      'new york, ny': { lat: 40.7128, lon: -74.0060 },
      'new york': { lat: 40.7128, lon: -74.0060 },
      'london, uk': { lat: 51.5074, lon: -0.1278 },
      'london': { lat: 51.5074, lon: -0.1278 },
      'tokyo, japan': { lat: 35.6762, lon: 139.6503 },
      'tokyo': { lat: 35.6762, lon: 139.6503 },
      'paris, france': { lat: 48.8566, lon: 2.3522 },
      'paris': { lat: 48.8566, lon: 2.3522 },
      'sydney, australia': { lat: -33.8688, lon: 151.2093 },
      'sydney': { lat: -33.8688, lon: 151.2093 },
      'washington, dc': { lat: 38.9072, lon: -77.0369 },
      'los angeles, ca': { lat: 34.0522, lon: -118.2437 },
      'chicago, il': { lat: 41.8781, lon: -87.6298 },
      'miami, fl': { lat: 25.7617, lon: -80.1918 },
      'berlin, germany': { lat: 52.5200, lon: 13.4050 },
      'madrid, spain': { lat: 40.4168, lon: -3.7038 },
      'rome, italy': { lat: 41.9028, lon: 12.4964 },
      'amsterdam, netherlands': { lat: 52.3676, lon: 4.9041 },
      'beijing, china': { lat: 39.9042, lon: 116.4074 },
      'moscow, russia': { lat: 55.7558, lon: 37.6176 },
      'dubai, uae': { lat: 25.2048, lon: 55.2708 },
      'singapore': { lat: 1.3521, lon: 103.8198 },
      'hong kong': { lat: 22.3193, lon: 114.1694 },
      'mumbai, india': { lat: 19.0760, lon: 72.8777 },
      'cairo, egypt': { lat: 30.0444, lon: 31.2357 }
    }
    
    const normalized = location.toLowerCase().trim()
    return locationMap[normalized] || { lat: 32.0853, lon: 34.7818 } // Default to Tel Aviv
    
  } catch (error) {
    console.error('🚫 Geocoding error:', error)
    return { lat: 32.0853, lon: 34.7818 } // Default to Tel Aviv
  }
}

// Global state to persist map settings across component remounts
let globalMapState = {
  center: [32.0853, 34.7818] as [number, number],
  zoom: 13,
  layer: 'terrain' as 'satellite' | 'terrain' | 'street',
  showThreats: true,
  showAssets: true,
  showZones: true
}

const MapPortal: React.FC<MapPortalProps> = ({ level, onLevelChange, onClose, context }) => {
  // Use persistent state that doesn't reset on level changes
  const [mapCenter, setMapCenter] = useState<[number, number]>(globalMapState.center)
  const [mapZoom, setMapZoom] = useState(globalMapState.zoom)
  const [selectedLayer, setSelectedLayer] = useState<'satellite' | 'terrain' | 'street'>(globalMapState.layer)
  const [showThreats, setShowThreats] = useState(globalMapState.showThreats)
  const [showAssets, setShowAssets] = useState(globalMapState.showAssets)
  const [showZones, setShowZones] = useState(globalMapState.showZones)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [isNavigating, setIsNavigating] = useState(false)
  const mapRef = useRef<any>(null)
  
  // Update global state whenever local state changes
  useEffect(() => {
    globalMapState = {
      center: mapCenter,
      zoom: mapZoom,
      layer: selectedLayer,
      showThreats,
      showAssets,
      showZones
    }
  }, [mapCenter, mapZoom, selectedLayer, showThreats, showAssets, showZones])
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date())
    }, 500)
    
    return () => clearInterval(interval)
  }, [])

  // Note: Removed automatic zoom reset on level changes to preserve navigation state

  // Handle navigation commands from AI
  useEffect(() => {
    if (!context) return

    const handleNavigation = async () => {
      console.log('🗺️ MapPortal received context:', context)
      setIsNavigating(true)

      try {
        if (context.action === 'zoom_to' || context.action === 'center_on') {
          if (context.location) {
            console.log('🎯 Navigating to location:', context.location)
            const coords = await geocodeLocation(context.location)
            if (coords) {
              console.log('📍 Setting map center to:', coords)
              setMapCenter([coords.lat, coords.lon])
              
              // Set zoom level based on context or maintain current zoom
              const newZoom = context.zoomLevel || Math.max(mapZoom, 14) // Don't zoom out too much
              setMapZoom(newZoom)
              console.log('🔍 Setting zoom to:', newZoom)
            }
          }
        } else if (context.action === 'show_threats') {
          console.log('⚠️ Focusing on threats')
          setShowThreats(true)
          setShowAssets(false)
          setShowZones(false)
          // Center on threats if available
          if (SAMPLE_THREATS.length > 0) {
            const threatCenter = SAMPLE_THREATS[0].position
            setMapCenter(threatCenter)
            setMapZoom(15)
          }
        } else if (context.action === 'show_assets') {
          console.log('🛡️ Focusing on assets')
          setShowAssets(true)
          setShowThreats(false)
          setShowZones(false)
          // Center on assets if available
          if (SAMPLE_ASSETS.length > 0) {
            const assetCenter = SAMPLE_ASSETS[0].position
            setMapCenter(assetCenter)
            setMapZoom(14)
          }
        }
      } catch (error) {
        console.error('🚫 Navigation error:', error)
      } finally {
        setTimeout(() => setIsNavigating(false), 1000)
      }
    }

    handleNavigation()
  }, [context, level])

  // Update main header status for Level 3
  useEffect(() => {
    if (level === 3) {
      // Update the main header elements
      const updateElement = document.getElementById('map-last-update')
      const assetsElement = document.getElementById('map-assets-count')
      const threatsElement = document.getElementById('map-threats-count')
      
      if (updateElement) updateElement.textContent = lastUpdate.toLocaleTimeString()
      if (assetsElement) assetsElement.textContent = SAMPLE_ASSETS.length.toString()
      if (threatsElement) threatsElement.textContent = SAMPLE_THREATS.length.toString()
    }
  }, [level, lastUpdate])
  
  const getTileLayerUrl = () => {
    switch (selectedLayer) {
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      case 'terrain':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
      case 'street':
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    }
  }

  if (level === 2) {
    return (
      <TooltipProvider>
        <style>{`
          .leaflet-container {
            height: 100% !important;
            width: 100% !important;
            max-height: 100% !important;
            background: #1f2937;
            overflow: hidden !important;
            position: relative !important;
          }
          .leaflet-control-container {
            display: none;
          }
          .leaflet-popup-content-wrapper {
            background: #1f2937;
            color: white;
            border: 1px solid #374151;
          }
          .leaflet-popup-tip {
            background: #1f2937;
          }
        `}</style>
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
            </div>
            

          </div>
          
          {/* Map Container */}
          <div className="flex-1 relative overflow-hidden">
            <div className="absolute inset-0">
              <MapContainer
                key="persistent-map"
                center={mapCenter}
                zoom={mapZoom}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
                attributionControl={false}
              >
              <MapResizeHandler level={level} />
              <MapNavigationHandler center={mapCenter} zoom={mapZoom} />
              <TileLayer
                url={getTileLayerUrl()}
                attribution=""
              />
              
              {/* Assets */}
              {showAssets && SAMPLE_ASSETS.map(asset => (
                <Marker
                  key={asset.id}
                  position={asset.position}
                  icon={createAssetIcon(asset.type, asset.status)}
                >
                  <Popup>
                    <div className="text-sm">
                      <div className="font-medium text-purple-300">{asset.name}</div>
                      <div className="text-gray-300">Type: {asset.type}</div>
                      <div className="text-gray-300">Status: {asset.status}</div>
                    </div>
                  </Popup>
                </Marker>
              ))}
              
              {/* Threat Tracks */}
              {showThreats && SAMPLE_THREATS.map(threat => (
                <React.Fragment key={threat.id}>
                  <Marker
                    position={threat.position}
                    icon={new Icon({
                      iconUrl: `data:image/svg+xml;base64,${btoa(`
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 2L18 18H2L10 2Z" fill="${getThreatColor(threat.threat_level)}" stroke="#1f2937" stroke-width="1"/>
                        </svg>
                      `)}`,
                      iconSize: [20, 20],
                      iconAnchor: [10, 10]
                    })}
                  >
                    <Popup>
                      <div className="text-sm">
                        <div className="font-medium text-red-400">Threat {threat.id}</div>
                        <div className="text-gray-300">Type: {threat.type}</div>
                        <div className="text-gray-300">Confidence: {threat.confidence}%</div>
                      </div>
                    </Popup>
                  </Marker>
                  
                  <Polyline
                    positions={threat.trajectory}
                    color={getThreatColor(threat.threat_level)}
                    weight={2}
                    opacity={0.7}
                    dashArray="5, 5"
                  />
                </React.Fragment>
              ))}
              
              {/* Engagement Zones */}
              {showZones && SAMPLE_ZONES.map(zone => (
                <Circle
                  key={zone.id}
                  center={zone.center}
                  radius={zone.radius}
                  color={getZoneColor(zone.type)}
                  fillColor={getZoneColor(zone.type)}
                  fillOpacity={0.1}
                  weight={2}
                />
              ))}
              </MapContainer>
            </div>
            

          </div>
        </motion.div>
      </TooltipProvider>
    )
  }

  // Level 3 - Enhanced version
  return (
    <TooltipProvider>
             <style>{`
         .leaflet-container {
           height: 100% !important;
           width: 100% !important;
           max-height: 100% !important;
           max-width: 100% !important;
           background: #1f2937;
           overflow: hidden !important;
           position: absolute !important;
           top: 0 !important;
           left: 0 !important;
           right: 0 !important;
           bottom: 0 !important;
           box-sizing: border-box !important;
         }
         .leaflet-control-container {
           display: none;
         }
         .leaflet-popup-content-wrapper {
           background: #1f2937;
           color: white;
           border: 1px solid #374151;
         }
         .leaflet-popup-tip {
           background: #1f2937;
         }
       `}</style>
      <motion.div 
        className="h-full max-h-full flex flex-col bg-gray-900/95 border border-gray-700 rounded-lg overflow-hidden"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        style={{ maxHeight: '100%', height: '100%' }}
      >
        {/* Enhanced Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-900 to-purple-800 border-b border-purple-700 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          </div>
          
          <div className="flex items-center gap-2">
            {/* Layer Selection */}
            <Select value={selectedLayer} onValueChange={(value: any) => setSelectedLayer(value)}>
              <SelectTrigger className="w-32 h-8 bg-purple-800 border-purple-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-purple-900 border-purple-700">
                <SelectItem value="terrain" className="text-white hover:bg-purple-800 focus:bg-purple-800">Terrain</SelectItem>
                <SelectItem value="satellite" className="text-white hover:bg-purple-800 focus:bg-purple-800">Satellite</SelectItem>
                <SelectItem value="street" className="text-white hover:bg-purple-800 focus:bg-purple-800">Street</SelectItem>
              </SelectContent>
            </Select>
            
            {/* View Controls */}
            <div className="flex items-center gap-1 bg-purple-800/50 rounded p-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAssets(!showAssets)}
                    className={`h-7 w-7 p-0 ${showAssets ? 'text-green-400' : 'text-gray-400'}`}
                  >
                    <Shield className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipPrimitive.Portal>
                  <TooltipPrimitive.Content
                    className="bg-gray-900 text-white border border-gray-700 shadow-lg rounded-md px-3 py-1.5 text-xs z-50"
                    sideOffset={5}
                  >
                    Toggle Assets
                    <TooltipPrimitive.Arrow className="fill-gray-900" />
                  </TooltipPrimitive.Content>
                </TooltipPrimitive.Portal>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowThreats(!showThreats)}
                    className={`h-7 w-7 p-0 ${showThreats ? 'text-red-400' : 'text-gray-400'}`}
                  >
                    <Target className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipPrimitive.Portal>
                  <TooltipPrimitive.Content
                    className="bg-gray-900 text-white border border-gray-700 shadow-lg rounded-md px-3 py-1.5 text-xs z-50"
                    sideOffset={5}
                  >
                    Toggle Threats
                    <TooltipPrimitive.Arrow className="fill-gray-900" />
                  </TooltipPrimitive.Content>
                </TooltipPrimitive.Portal>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowZones(!showZones)}
                    className={`h-7 w-7 p-0 ${showZones ? 'text-purple-400' : 'text-gray-400'}`}
                  >
                    <Layers className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipPrimitive.Portal>
                  <TooltipPrimitive.Content
                    className="bg-gray-900 text-white border border-gray-700 shadow-lg rounded-md px-3 py-1.5 text-xs z-50"
                    sideOffset={5}
                  >
                    Toggle Zones
                    <TooltipPrimitive.Arrow className="fill-gray-900" />
                  </TooltipPrimitive.Content>
                </TooltipPrimitive.Portal>
              </Tooltip>
            </div>
          </div>
        </div>
        
                 {/* Map Container */}
         <div className="flex-1 relative overflow-hidden min-h-0 max-h-full" style={{ maxHeight: '100%' }}>
                                   <div className="absolute inset-0 overflow-hidden max-h-full" style={{ maxHeight: '100%' }}>
             <MapContainer
               key="persistent-map"
               center={mapCenter}
               zoom={mapZoom}
               style={{ height: '100%', width: '100%' }}
               zoomControl={false}
               attributionControl={false}
             >
            <MapResizeHandler level={level} />
            <MapNavigationHandler center={mapCenter} zoom={mapZoom} />
            <TileLayer
              url={getTileLayerUrl()}
              attribution=""
            />
            
            {/* Enhanced Asset Markers */}
            {showAssets && SAMPLE_ASSETS.map(asset => (
              <Marker
                key={asset.id}
                position={asset.position}
                icon={createAssetIcon(asset.type, asset.status)}
              >
                <Popup>
                  <div className="text-sm min-w-48">
                    <div className="font-medium text-purple-300 border-b border-gray-600 pb-1 mb-2">
                      {asset.name}
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type:</span>
                        <span className="text-white capitalize">{asset.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            asset.status === 'online' ? 'border-green-400 text-green-400' :
                            'border-red-400 text-red-400'
                          }`}
                        >
                          {asset.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
            
            {/* Enhanced Threat Visualization */}
            {showThreats && SAMPLE_THREATS.map(threat => (
              <React.Fragment key={threat.id}>
                <Marker
                  position={threat.position}
                  icon={new Icon({
                    iconUrl: `data:image/svg+xml;base64,${btoa(`
                      <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.5 2L22 22H3L12.5 2Z" fill="${getThreatColor(threat.threat_level)}" stroke="#1f2937" stroke-width="2"/>
                        <circle cx="12.5" cy="8" r="2" fill="#1f2937"/>
                      </svg>
                    `)}`,
                    iconSize: [25, 25],
                    iconAnchor: [12.5, 12.5]
                  })}
                >
                  <Popup>
                    <div className="text-sm min-w-52">
                      <div className="font-medium text-red-400 border-b border-gray-600 pb-1 mb-2">
                        Threat Track {threat.id}
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Type:</span>
                          <span className="text-white capitalize">{threat.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Confidence:</span>
                          <span className="text-white">{threat.confidence}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Threat Level:</span>
                          <Badge 
                            variant="outline" 
                            className="text-xs border-orange-400 text-orange-400"
                          >
                            {threat.threat_level}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
                
                <Polyline
                  positions={threat.trajectory}
                  color={getThreatColor(threat.threat_level)}
                  weight={3}
                  opacity={0.8}
                  dashArray="8, 4"
                />
              </React.Fragment>
            ))}
            
            {/* Enhanced Engagement Zones */}
            {showZones && SAMPLE_ZONES.map(zone => (
              <Circle
                key={zone.id}
                center={zone.center}
                radius={zone.radius}
                color={getZoneColor(zone.type)}
                fillColor={getZoneColor(zone.type)}
                fillOpacity={zone.active ? 0.15 : 0.05}
                weight={zone.active ? 3 : 1}
                dashArray={zone.active ? undefined : "10, 5"}
              />
            ))}
          </MapContainer>
          </div>
          

          
          {/* Zoom Controls */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMapZoom(Math.min(mapZoom + 1, 18))}
              className="w-8 h-8 p-0 bg-gray-900/80 border-gray-700 text-gray-300 hover:text-purple-300"
            >
              <ZoomIn className="w-3 h-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMapZoom(Math.max(mapZoom - 1, 10))}
              className="w-8 h-8 p-0 bg-gray-900/80 border-gray-700 text-gray-300 hover:text-purple-300"
            >
              <ZoomOut className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  )
}

export default MapPortal 