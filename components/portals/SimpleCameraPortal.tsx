import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Eye, Target, Grid3X3, Circle } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { TooltipProvider } from '../ui/tooltip'

interface CameraPortalProps {
  level: 2 | 3
  onLevelChange?: (level: 2 | 3) => void
  onClose?: () => void
}

const CameraPortal: React.FC<CameraPortalProps> = ({ level }) => {
  const [selectedFeed, setSelectedFeed] = useState<string>('feed-1')
  const [isRecording, setIsRecording] = useState(false)
  const [showOverlays, setShowOverlays] = useState(true)
  const [showGrid, setShowGrid] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date())
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])

  // Sample feeds data
  const FEEDS = [
    {
      id: 'feed-1',
      name: 'Perimeter EO/IR',
      type: 'EO',
      url: 'https://www.youtube.com/embed/PNnxdiKRoBA?si=ZESBUBdCa0AuztHp&autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&vq=hd1080&playsinline=1',
      preset: 'North Sector'
    },
    {
      id: 'feed-2',
      name: 'Tower EO/IR',
      type: 'EO',
      url: 'https://www.youtube.com/embed/h2m8RQLtcrM?si=SgjHI1LFC5UDPBRj&autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&vq=hd1080&playsinline=1',
      preset: 'East Approach'
    }
  ]

  const currentFeed = FEEDS.find(feed => feed.id === selectedFeed) || FEEDS[0]

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
              <span className="text-sm text-gray-300">Camera Feed</span>
              <Badge 
                variant="outline" 
                className="text-xs"
                style={{
                  borderColor: currentFeed.type === 'EO' ? '#22c55e' : '#f97316',
                  color: currentFeed.type === 'EO' ? '#22c55e' : '#f97316'
                }}
              >
                {currentFeed.type}
              </Badge>
            </div>
            
            <div className="flex items-center gap-1">
              {isRecording && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-xs text-red-400">REC</span>
                </div>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsRecording(!isRecording)}
                className={`h-7 w-7 p-0 ${isRecording ? 'text-red-400' : 'text-gray-400'}`}
              >
                <Circle className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Feed Container */}
          <div className="flex-1 relative overflow-hidden bg-black">
            <div className="absolute inset-0 w-full h-full">
              <iframe
                key={currentFeed.id}
                src={currentFeed.url}
                className="absolute border-0"
                style={{
                  width: '300%',
                  height: '300%',
                  left: '-100%',
                  top: '-100%',
                  minWidth: '300%',
                  minHeight: '300%'
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            
            {/* Grid Overlay */}
            {showGrid && (
              <div className="absolute inset-0 pointer-events-none">
                <svg className="w-full h-full">
                  <defs>
                    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#4b5563" strokeWidth="1" opacity="0.3"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
            )}
            
            {/* Feed Info Overlay */}
            <div className="absolute top-2 left-2 bg-gray-900/70 rounded px-2 py-1">
              <div className="text-xs text-gray-300">
                <div className="font-medium">{currentFeed.name}</div>
                <div className="text-gray-400">{currentFeed.preset}</div>
              </div>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-2 p-2 bg-gray-800/30 border-t border-gray-700">
            <span className="text-xs text-gray-400">{currentFeed.name}</span>
            
            <div className="flex items-center gap-1 ml-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOverlays(!showOverlays)}
                className={`h-7 w-7 p-0 ${showOverlays ? 'text-purple-400' : 'text-gray-400'}`}
              >
                <Target className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowGrid(!showGrid)}
                className={`h-7 w-7 p-0 ${showGrid ? 'text-green-400' : 'text-gray-400'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
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
            <Eye className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="text-lg font-medium text-purple-300">Tel Aviv</h3>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>Feeds: <span className="text-green-400">2</span></span>
                <span>Threats: <span className="text-orange-400">0</span></span>
                <span>Updated: <span className="text-purple-300">{lastUpdate.toLocaleTimeString()}</span></span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isRecording && (
              <div className="flex items-center gap-2 bg-red-900/50 rounded px-3 py-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm text-red-400 font-medium">RECORDING</span>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsRecording(!isRecording)}
              className={`h-8 w-8 p-0 ${isRecording ? 'text-red-400' : 'text-gray-400'}`}
            >
              <Circle className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Main Feed Display */}
        <div className="flex-1 relative bg-black overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <iframe
              key={currentFeed.id}
              src={currentFeed.url}
              className="absolute border-0"
              style={{
                width: '130%',
                height: '130%',
                left: '-15%',
                top: '-15%',
                minWidth: '130%',
                minHeight: '130%'
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          
          {/* Enhanced Grid Overlay */}
          {showGrid && (
            <div className="absolute inset-0 pointer-events-none">
              <svg className="w-full h-full">
                <defs>
                  <pattern id="grid-level3" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#6366f1" strokeWidth="1" opacity="0.4"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-level3)" />
                {/* Center crosshairs */}
                <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#6366f1" strokeWidth="2" opacity="0.6"/>
                <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#6366f1" strokeWidth="2" opacity="0.6"/>
              </svg>
            </div>
          )}
          
          {/* Enhanced Feed Info */}
          <div className="absolute top-4 left-4 bg-gray-900/80 border border-gray-600 rounded px-3 py-2">
            <div className="text-sm">
              <div className="flex items-center gap-2 mb-1">
                <div className="font-medium text-purple-300">{currentFeed.name}</div>
                <Badge 
                  variant="outline" 
                  className="text-xs"
                  style={{
                    borderColor: currentFeed.type === 'EO' ? '#22c55e' : '#f97316',
                    color: currentFeed.type === 'EO' ? '#22c55e' : '#f97316'
                  }}
                >
                  {currentFeed.type}
                </Badge>
              </div>
              <div className="text-xs text-gray-400">{currentFeed.preset}</div>
              <div className="text-xs text-green-400 mt-1">LIVE FEED</div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Controls */}
        <div className="flex items-center justify-between p-3 bg-gray-800/50 border-t border-gray-600">
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              className="h-8 text-xs bg-gray-700 hover:bg-gray-600 text-gray-100 border-gray-600"
              onClick={() => {
                const currentIndex = FEEDS.findIndex(feed => feed.id === selectedFeed)
                const nextIndex = (currentIndex + 1) % FEEDS.length
                setSelectedFeed(FEEDS[nextIndex].id)
              }}
            >
              Switch Feed ({FEEDS.length - FEEDS.findIndex(feed => feed.id === selectedFeed) === 1 ? FEEDS[1].name : FEEDS[0].name})
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowGrid(!showGrid)}
              className={`h-8 w-8 p-0 ${showGrid ? 'text-green-400' : 'text-gray-400'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span>Live</span>
            </div>
            <div>•</div>
            <div>Latency: &lt;100ms</div>
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  )
}

export default CameraPortal 