'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Send, Loader2, X } from 'lucide-react'
import { KrakenAI, CommandResult } from './services/jarvisAI'
import { PortalData } from './constants/portalConfigs.tsx'

// Animated three-dot loader component
const ThreeDotsLoader = () => (
  <div className="flex items-center space-x-1 py-1">
    {[0, 1, 2].map((index) => (
      <motion.div
        key={index}
        className="w-1.5 h-1.5 bg-purple-400/70 rounded-full"
        animate={{
          y: [0, -4, 0],
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: index * 0.2,
          ease: "easeInOut"
        }}
      />
    ))}
  </div>
)

interface KrakenAssistantProps {
  hasOpenPortals: boolean
  mousePosition: { x: number; y: number }
  className?: string
  style?: React.CSSProperties
  krakenAI: KrakenAI
  availablePortals: PortalData[]
  onCommandExecuted: (result: CommandResult) => void
  onAIPanelStateChange?: (isActive: boolean) => void
  shouldCloseAIPanel?: boolean
  shouldRestoreAIPanel?: boolean
  shouldTriggerSearch?: boolean
  shouldTriggerAIPanel?: boolean
}

interface KrakenEyeProps {
  mousePosition: { x: number; y: number }
  size?: number
  isInCenter?: boolean
  containerRef?: React.RefObject<HTMLDivElement>
}

interface ChatMessage {
  id: string
  type: 'user' | 'kraken'
  content: string
  timestamp: Date
  isExecuting?: boolean
}

// Enhanced Kraken Eye Component with random movement and mouse tracking
function KrakenEye({ mousePosition, size = 80, isInCenter = false, containerRef }: KrakenEyeProps) {
  const [randomPosition, setRandomPosition] = useState({ x: 0, y: 0 })
  const [isMouseMoving, setIsMouseMoving] = useState(false)
  const mouseTimeoutRef = useRef<NodeJS.Timeout>()
  const randomIntervalRef = useRef<NodeJS.Timeout>()
  const prevMousePosition = useRef(mousePosition)

  const centerX = size / 2
  const centerY = size / 2
  const maxOffset = size * 0.15

  // Detect mouse movement
  useEffect(() => {
    if (mousePosition.x !== prevMousePosition.current.x || mousePosition.y !== prevMousePosition.current.y) {
      setIsMouseMoving(true)
      prevMousePosition.current = mousePosition

      // Clear existing timeout
      if (mouseTimeoutRef.current) {
        clearTimeout(mouseTimeoutRef.current)
      }

      // Set mouse as not moving after 2 seconds of no movement
      mouseTimeoutRef.current = setTimeout(() => {
        setIsMouseMoving(false)
      }, 2000)
    }
  }, [mousePosition])

  // Random eye movement when in center and mouse not moving
  useEffect(() => {
    if (isInCenter && !isMouseMoving) {
      const startRandomMovement = () => {
        randomIntervalRef.current = setInterval(() => {
          setRandomPosition({
            x: (Math.random() - 0.5) * maxOffset * 2,
            y: (Math.random() - 0.5) * maxOffset * 2
          })
        }, 1500 + Math.random() * 1000) // Random interval between 1.5-2.5 seconds
      }

      startRandomMovement()

      return () => {
        if (randomIntervalRef.current) {
          clearInterval(randomIntervalRef.current)
        }
      }
    } else {
      if (randomIntervalRef.current) {
        clearInterval(randomIntervalRef.current)
      }
    }
  }, [isInCenter, isMouseMoving, maxOffset])

  // Calculate iris position
  let irisX = centerX
  let irisY = centerY

  if (isInCenter && !isMouseMoving) {
    // Use random position when in center and mouse not moving
    irisX = centerX + randomPosition.x
    irisY = centerY + randomPosition.y
  } else if (containerRef?.current) {
    // Track mouse in all other cases:
    // - In center position and mouse is moving
    // - In top-left position (always track mouse)
    const rect = containerRef.current.getBoundingClientRect()
    const avatarCenterX = rect.left + rect.width / 2
    const avatarCenterY = rect.top + rect.height / 2
    
    const deltaX = mousePosition.x - avatarCenterX
    const deltaY = mousePosition.y - avatarCenterY
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    
    const normalizedX = distance > 0 ? (deltaX / distance) * maxOffset : 0
    const normalizedY = distance > 0 ? (deltaY / distance) * maxOffset : 0
    
    irisX = centerX + normalizedX
    irisY = centerY + normalizedY
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-lg">
        <defs>
          <radialGradient id="krakenGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(162, 161, 255, 0.2)" />
            <stop offset="100%" stopColor="rgba(118, 53, 164, 0.4)" />
          </radialGradient>
          
          <radialGradient id="krakenIris" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(162, 161, 255, 1)" />
            <stop offset="100%" stopColor="rgba(118, 53, 164, 0.8)" />
          </radialGradient>

          <radialGradient id="krakenPupil" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(58, 0, 104, 0.9)" />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 0.8)" />
          </radialGradient>
        </defs>
        
        {/* Outer ring with purple glow */}
        <circle
          cx={centerX}
          cy={centerY}
          r={size * 0.4}
          fill="none"
          stroke="rgba(139, 92, 246, 0.6)"
          strokeWidth="2"
        />
        
        {/* Moving iris with purple gradient */}
        <motion.circle
          cx={irisX}
          cy={irisY}
          r={size * 0.12}
          fill="url(#krakenIris)"
          animate={{ cx: irisX, cy: irisY }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        />
        
        {/* Pupil with dark purple gradient */}
        <motion.circle
          cx={irisX}
          cy={irisY}
          r={size * 0.04}
          fill="url(#krakenPupil)"
          animate={{ cx: irisX, cy: irisY }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        />

        {/* Additional purple glow effect */}
        <circle
          cx={centerX}
          cy={centerY}
          r={size * 0.42}
          fill="none"
          stroke="rgba(162, 161, 255, 0.3)"
          strokeWidth="1"
          opacity="0.5"
        />
      </svg>
    </div>
  )
}

// Search Field Component with AI integration
function KrakenSearchField({ 
  onSearch, 
  onFocusChange, 
  krakenAI, 
  availablePortals, 
  onCommandExecuted
}: { 
  onSearch?: (query: string, result?: CommandResult) => void
  onFocusChange?: (isFocused: boolean) => void 
  krakenAI: KrakenAI
  availablePortals: PortalData[]
  onCommandExecuted: (result: CommandResult) => void
}) {
  const [query, setQuery] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const recognitionRef = useRef<any>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        try {
          recognitionRef.current = new SpeechRecognition()
          recognitionRef.current.continuous = false
          recognitionRef.current.interimResults = false
          recognitionRef.current.lang = 'en-US'
          
          recognitionRef.current.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript
            setQuery(transcript)
            setIsListening(false)
            // Auto-submit voice commands
            processCommand(transcript)
          }
          
          recognitionRef.current.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error)
            setIsListening(false)
          }
          
          recognitionRef.current.onend = () => {
            setIsListening(false)
          }
        } catch (error) {
          console.warn('Speech recognition initialization failed:', error)
        }
      }
    }
  }, [])

  const processCommand = async (command: string) => {
    if (!command.trim() || !krakenAI.isReady()) return

    setIsProcessing(true)
    
    try {
      const result = await krakenAI.processCommand(command, availablePortals)
      
      // Call the search callback FIRST to set AI panel state
      onSearch?.(command, result)
      
      if (result.success && result.action) {
        onCommandExecuted(result)
      }
      
    } catch (error) {
      console.error('Command processing error:', error)
      // Still call search callback even on error
      onSearch?.(command)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      processCommand(query.trim())
      setQuery('')
    }
  }

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition not supported in this browser.')
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      try {
        recognitionRef.current.start()
        setIsListening(true)
      } catch (error) {
        console.error('Failed to start speech recognition:', error)
        setIsListening(false)
      }
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
    onFocusChange?.(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
    onFocusChange?.(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="absolute"
      style={{ top: '130px' }} // Positioned 130px below eye center for proper spacing below the 2x scaled eye
    >
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={krakenAI.isReady() ? "Ask Kraken AI anything..." : "Configure API key first"}
          disabled={isProcessing || !krakenAI.isReady()}
          className="w-96 h-12 px-6 pr-20 bg-gray-900/90 backdrop-blur-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
          style={{ 
            border: '1px solid rgba(139, 92, 246, 0.5)',
            borderRadius: '24px' 
          }}
        />
        
        {/* Voice Input Button */}
        {recognitionRef.current && (
          <button
            type="button"
            onClick={handleVoiceInput}
            data-testid="voice-listen-button"
            disabled={isProcessing || !krakenAI.isReady()}
            className={`absolute right-12 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-200 ${
              isListening 
                ? 'bg-red-500/40 text-red-300 hover:bg-red-500/50 animate-pulse' 
                : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!query.trim() || isProcessing || !krakenAI.isReady()}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 disabled:opacity-50 transition-colors duration-200"
        >
          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>

      {/* Status indicators */}
      <div className="mt-2 text-xs text-gray-400 text-center">
        {!krakenAI.isReady() && (
          <span className="text-yellow-400">⚠️ AI service not initialized</span>
        )}
        {isListening && (
          <span className="text-red-400">🎤 Listening...</span>
        )}
        {isProcessing && (
          <div className="flex items-center justify-center">
            <ThreeDotsLoader />
          </div>
        )}
      </div>
    </motion.div>
  )
}

// AI Command Panel for top-left position
function AICommandPanel({ 
  krakenAI, 
  availablePortals, 
  onCommandExecuted, 
  onClose,
  conversationHistory,
  onUpdateConversation
}: {
  krakenAI: KrakenAI
  availablePortals: PortalData[]
  onCommandExecuted: (result: CommandResult) => void
  onClose: () => void
  conversationHistory: ChatMessage[]
  onUpdateConversation: (messages: ChatMessage[]) => void
}) {
  const [inputText, setInputText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversationHistory])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        try {
          recognitionRef.current = new SpeechRecognition()
          recognitionRef.current.continuous = false
          recognitionRef.current.interimResults = false
          recognitionRef.current.lang = 'en-US'
          
          recognitionRef.current.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript
            setInputText(transcript)
            setIsListening(false)
            // Auto-submit voice commands
            processCommand(transcript)
          }
          
          recognitionRef.current.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error)
            setIsListening(false)
          }
          
          recognitionRef.current.onend = () => {
            setIsListening(false)
          }
        } catch (error) {
          console.warn('Speech recognition initialization failed:', error)
        }
      }
    }
  }, [])

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition not supported in this browser.')
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      try {
        recognitionRef.current.start()
        setIsListening(true)
      } catch (error) {
        console.error('Failed to start speech recognition:', error)
        setIsListening(false)
      }
    }
  }

  const processCommand = async (command: string) => {
    if (!command.trim() || !krakenAI.isReady()) return

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString() + '_user',
      type: 'user',
      content: command,
      timestamp: new Date()
    }

    onUpdateConversation([...conversationHistory, userMessage])
    setInputText('')
    setIsProcessing(true)

    try {
      // Process with Kraken AI
      const result = await krakenAI.processCommand(command, availablePortals)
      
      // Add Kraken AI response
      const krakenMessage: ChatMessage = {
        id: Date.now().toString() + '_kraken',
        type: 'kraken',
        content: result.message,
        timestamp: new Date(),
        isExecuting: result.success && !!result.action
      }

      onUpdateConversation([...conversationHistory, userMessage, krakenMessage])

      // Execute command if successful
      if (result.success && result.action) {
        onCommandExecuted(result)
      }

    } catch (error) {
      console.error('Command processing error:', error)
      const errorMessage: ChatMessage = {
        id: Date.now().toString() + '_error',
        type: 'kraken',
        content: 'I encountered an error processing your command.',
        timestamp: new Date()
      }
      onUpdateConversation([...conversationHistory, userMessage, errorMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    processCommand(inputText)
  }

  return (
    <motion.div
      className="w-96 h-96 bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-lg shadow-2xl flex flex-col"
      initial={{ opacity: 0, scale: 0.9, x: -20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9, x: -20 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
          <span className="text-purple-300 font-medium">Kraken AI</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 bg-gray-800/50 border-b border-gray-700">
        <div className="text-xs">
          {!krakenAI.isReady() && (
            <span className="text-yellow-400">⚠️ AI service not initialized</span>
          )}
          {krakenAI.isReady() && (
            <span className="text-green-400">✅ AI service ready</span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {conversationHistory.map((message) => (
          <motion.div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className={`max-w-[85%] p-3 rounded-lg text-sm ${
                message.type === 'user'
                  ? 'bg-purple-600/50 text-purple-100'
                  : 'bg-gray-800/50 text-gray-200'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.isExecuting && (
                  <Loader2 className="w-3 h-3 mt-0.5 animate-spin text-purple-400 flex-shrink-0" />
                )}
                <span>{message.content}</span>
              </div>
              <div className="text-xs opacity-60 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={krakenAI.isReady() ? "Type a command..." : "Configure API key first"}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg 
                       text-gray-200 placeholder-gray-400 focus:outline-none focus:border-purple-500
                       focus:ring-1 focus:ring-purple-500 text-sm"
              disabled={isProcessing || !krakenAI.isReady()}
            />
          </div>
          
          {/* Voice Input Button */}
          {recognitionRef.current && (
            <button
              type="button"
              onClick={toggleListening}
              data-testid="voice-listen-button"
              className={`p-2 rounded-lg transition-colors ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
              disabled={isProcessing || !krakenAI.isReady()}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          )}

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isProcessing || !krakenAI.isReady()}
            className="p-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 
                     disabled:text-gray-500 text-white rounded-lg transition-colors"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>

        {/* Status indicators */}
        <div className="mt-2 text-xs text-gray-400 flex items-center justify-between">
          <div>
            {isListening && <span className="text-red-400">🎤 Listening...</span>}
            {isProcessing && <ThreeDotsLoader />}
          </div>
          <div className="text-gray-500">
            Press Enter to send
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function KrakenAssistant({ 
  hasOpenPortals, 
  mousePosition, 
  className, 
  style,
  krakenAI,
  availablePortals,
  onCommandExecuted,
  onAIPanelStateChange,
  shouldCloseAIPanel,
  shouldRestoreAIPanel,
  shouldTriggerSearch,
  shouldTriggerAIPanel
}: KrakenAssistantProps) {
  const [showAIPanel, setShowAIPanel] = useState(false)
  const [hasProcessedCommand, setHasProcessedCommand] = useState(false)
  const [isHoveringCenter, setIsHoveringCenter] = useState(false)
  const [isFieldActive, setIsFieldActive] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'kraken',
      content: 'Kraken AI interface active. Ready for commands.',
      timestamp: new Date()
    }
  ])
  const centerContainerRef = useRef<HTMLDivElement>(null)
  const topLeftContainerRef = useRef<HTMLDivElement>(null)
  const hideTimeoutRef = useRef<NodeJS.Timeout>()

  // Force expanded state when there's portals are open or AI panel is shown
  const isInUpperLeft = hasOpenPortals || showAIPanel || hasProcessedCommand

  // Notify parent about AI panel state changes
  useEffect(() => {
    const aiPanelActive = showAIPanel || hasProcessedCommand
    onAIPanelStateChange?.(aiPanelActive)
  }, [showAIPanel, hasProcessedCommand, onAIPanelStateChange])

  // Close AI panel when requested by parent (e.g., when fullscreen portal opens)
  useEffect(() => {
    if (shouldCloseAIPanel) {
      setShowAIPanel(false)
      // If no portals are open, reset to center
      if (!hasOpenPortals) {
        setHasProcessedCommand(false)
      }
    }
  }, [shouldCloseAIPanel, hasOpenPortals])

  // Restore AI panel when requested by parent (e.g., when fullscreen portal closes)
  useEffect(() => {
    if (shouldRestoreAIPanel) {
      setShowAIPanel(true)
      setHasProcessedCommand(true)
    }
  }, [shouldRestoreAIPanel])

  // Reset to center (large eye) when both portals and AI panel are closed
  useEffect(() => {
    if (!hasOpenPortals && !showAIPanel) {
      setHasProcessedCommand(false)
      setIsFieldActive(false)
      setIsHoveringCenter(false)
    }
  }, [hasOpenPortals, showAIPanel])

  // Handle keyboard shortcut to trigger search field (when no portals open)
  useEffect(() => {
    if (shouldTriggerSearch) {
      setIsFieldActive(true)
      setIsHoveringCenter(true)
      
      // Add a delay to ensure the search field is rendered before trying to start voice
      setTimeout(() => {
        // Focus the search field if it exists
        const searchInput = document.querySelector('input[placeholder*="Ask Kraken"]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        }
        
        // Start voice listening by finding and clicking the voice button
        const voiceButton = document.querySelector('[data-testid="voice-listen-button"]') as HTMLButtonElement
        if (voiceButton) {
          voiceButton.click()
        }
      }, 150) // Small delay to ensure component is rendered
    }
  }, [shouldTriggerSearch])

  // Handle keyboard shortcut to trigger AI panel (when portals are open)
  useEffect(() => {
    if (shouldTriggerAIPanel) {
      setShowAIPanel(true)
      setHasProcessedCommand(true)
      // Trigger voice listening after a brief delay to ensure panel is open
      setTimeout(() => {
        const listenButton = document.querySelector('[data-testid="voice-listen-button"]') as HTMLButtonElement
        if (listenButton) {
          listenButton.click()
        }
      }, 100)
    }
  }, [shouldTriggerAIPanel])

  // Calculate distance from mouse to center eye or search field area
  useEffect(() => {
    if (!isInUpperLeft && centerContainerRef.current) {
      const rect = centerContainerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      // Calculate distance from mouse to eye center
      const eyeDistance = Math.sqrt(
        Math.pow(mousePosition.x - centerX, 2) + Math.pow(mousePosition.y - centerY, 2)
      )
      
      // Define expanded interaction area that includes both eye and search field
      const interactionArea = {
        left: centerX - 200, // Slightly wider than search field
        right: centerX + 200,
        top: centerY - 80, // Above the eye
        bottom: centerY + 130 + 60 // Below the search field with extra padding
      }
      
      // Check if mouse is in the overall interaction area OR close to eye
      const isInInteractionArea = mousePosition.x >= interactionArea.left && 
                                 mousePosition.x <= interactionArea.right &&
                                 mousePosition.y >= interactionArea.top && 
                                 mousePosition.y <= interactionArea.bottom
      
      const shouldShow = eyeDistance <= 100 || isInInteractionArea
    
      if (shouldShow || isFieldActive) {
        // Show field if hovering or field is focused
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current)
          hideTimeoutRef.current = undefined
        }
        setIsHoveringCenter(true)
      } else if (isHoveringCenter) {
        // Start timeout to hide when not hovering and not focused
        if (!hideTimeoutRef.current) {
          hideTimeoutRef.current = setTimeout(() => {
            setIsHoveringCenter(false)
            hideTimeoutRef.current = undefined
          }, 300) // Longer delay to prevent flickering during mouse movement
        }
      }
    } else {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
        hideTimeoutRef.current = undefined
      }
      setIsHoveringCenter(false)
    }
  }, [mousePosition, isInUpperLeft, isHoveringCenter, isFieldActive])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }
    }
  }, [])

  const handleSearch = async (query: string, result?: CommandResult) => {
    console.log('Kraken AI query:', query)
    
    // Add user message to conversation history
    const userMessage: ChatMessage = {
      id: Date.now().toString() + '_user',
      type: 'user',
      content: query,
      timestamp: new Date()
    }
    
    setConversationHistory(prev => [...prev, userMessage])
    
    // Add AI response if provided
    if (result) {
      const krakenMessage: ChatMessage = {
        id: Date.now().toString() + '_kraken',
        type: 'kraken',
        content: result.message,
        timestamp: new Date(),
        isExecuting: result.success && !!result.action
      }
      
      setConversationHistory(prev => [...prev, krakenMessage])
    }
    
    setHasProcessedCommand(true)
    setShowAIPanel(true)
    
    // Immediately notify parent about AI panel state change
    onAIPanelStateChange?.(true)
  }

  const handleFieldFocusChange = (isFocused: boolean) => {
    setIsFieldActive(isFocused)
  }

  const handleAIPanelClose = () => {
    setShowAIPanel(false)
    // If no portals are open, reset to center
    if (!hasOpenPortals) {
      setHasProcessedCommand(false)
    }
  }

  const handleCommandExecuted = (result: CommandResult) => {
    onCommandExecuted(result)
  }

  if (isInUpperLeft) {
    // Small version in top-left when portals are open, alerts are present, or AI panel is shown
    return (
      <div className="relative">
        <motion.div
          ref={topLeftContainerRef}
          className={`w-24 h-24 ${className || ''}`}
          style={style}
          initial={{ scale: 1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <KrakenEye 
            mousePosition={mousePosition} 
            size={80} 
            isInCenter={false}
            containerRef={topLeftContainerRef}
          />
        </motion.div>

        {/* AI Command Panel - positioned to the right of the eye, aligned with eye top */}
        <AnimatePresence>
          {showAIPanel && (
            <div className="fixed z-[250]" style={{ 
              left: '136px', // 24px (avatar left) + 96px (avatar width) + 16px (gap) = 136px
              top: '64px'    // 56px (avatar top) + 8px (eye centering offset) = 64px
            }}>
              <AICommandPanel
                krakenAI={krakenAI}
                availablePortals={availablePortals}
                onCommandExecuted={handleCommandExecuted}
                onClose={handleAIPanelClose}
                conversationHistory={conversationHistory}
                onUpdateConversation={setConversationHistory}
              />
            </div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Large version in center when no portals are open and no alerts
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-[150] pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative flex flex-col items-center pointer-events-auto">
        <motion.div
          ref={centerContainerRef}
          className="relative"
          initial={{ scale: 1 }}
          animate={{ scale: 2 }}
          transition={{ duration: 0.5 }}
        >
          <KrakenEye 
            mousePosition={mousePosition} 
            size={80} 
            isInCenter={true}
            containerRef={centerContainerRef}
          />
        </motion.div>
        
        <AnimatePresence>
          {isHoveringCenter && (
            <KrakenSearchField 
              onSearch={handleSearch}
              onFocusChange={handleFieldFocusChange}
              krakenAI={krakenAI}
              availablePortals={availablePortals}
              onCommandExecuted={handleCommandExecuted}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
} 