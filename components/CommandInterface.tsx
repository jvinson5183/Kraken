'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Send, Volume2, VolumeX, MessageCircle, X, Loader2 } from 'lucide-react'
import { JarvisAI, CommandResult } from './services/jarvisAI'
import { PortalData } from './constants/portalConfigs'

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
}

interface CommandInterfaceProps {
  jarvisAI: JarvisAI
  availablePortals: PortalData[]
  onCommandExecuted: (result: CommandResult) => void
  className?: string
}

interface ChatMessage {
  id: string
  type: 'user' | 'jarvis'
  content: string
  timestamp: Date
  isExecuting?: boolean
}

export function CommandInterface({ jarvisAI, availablePortals, onCommandExecuted, className }: CommandInterfaceProps) {
  // State management
  const [isOpen, setIsOpen] = useState(false)
  const [inputText, setInputText] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'jarvis',
      content: 'Good morning. JARVIS interface online. How may I assist you?',
      timestamp: new Date()
    }
  ])

  // Refs
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Speech Recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = 'en-US'
        
        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript
          setInputText(transcript)
          setIsListening(false)
        }
        
        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error)
          setIsListening(false)
        }
        
        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      }

      // Speech Synthesis
      synthRef.current = window.speechSynthesis
    }
  }, [])

  // Handle voice input
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition not supported in this browser.')
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  // Handle text-to-speech
  const speakText = (text: string) => {
    if (!synthRef.current) return

    // Stop any ongoing speech
    synthRef.current.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 0.8
    utterance.volume = 0.7

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    synthRef.current.speak(utterance)
  }

  // Stop speech
  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  // Process command
  const processCommand = async (command: string) => {
    if (!command.trim() || !jarvisAI.isReady()) return

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString() + '_user',
      type: 'user',
      content: command,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsProcessing(true)

    try {
      // Process with JARVIS AI
      const result = await jarvisAI.processCommand(command, availablePortals)
      
      // Add JARVIS response
      const jarvisMessage: ChatMessage = {
        id: Date.now().toString() + '_jarvis',
        type: 'jarvis',
        content: result.message,
        timestamp: new Date(),
        isExecuting: result.success && !!result.action
      }

      setMessages(prev => [...prev, jarvisMessage])

      // Execute command if successful
      if (result.success && result.action) {
        onCommandExecuted(result)
      }

      // Speak response
      if (result.success) {
        speakText(result.message)
      }

    } catch (error) {
      console.error('Command processing error:', error)
      const errorMessage: ChatMessage = {
        id: Date.now().toString() + '_error',
        type: 'jarvis',
        content: 'I encountered an error processing your command.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    processCommand(inputText)
  }

  // Focus input when opening
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  return (
    <>
      {/* Command Interface Toggle Button */}
      <motion.button
        className={`fixed bottom-6 right-6 w-14 h-14 bg-purple-600/90 hover:bg-purple-500 
                   text-white rounded-full shadow-lg backdrop-blur-sm z-[250] 
                   flex items-center justify-center transition-colors ${className}`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Command Interface Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 w-96 h-96 bg-gray-900/95 backdrop-blur-md 
                       border border-gray-700 rounded-lg shadow-2xl z-[240] flex flex-col"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                <span className="text-purple-300 font-medium">JARVIS Command Interface</span>
              </div>
              <div className="flex items-center space-x-2">
                {/* TTS Control */}
                <button
                  onClick={isSpeaking ? stopSpeaking : undefined}
                  className={`p-1 rounded ${isSpeaking ? 'text-purple-300 hover:text-purple-200' : 'text-gray-500'}`}
                  disabled={!isSpeaking}
                >
                  {isSpeaking ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                
                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      message.type === 'user'
                        ? 'bg-purple-600/50 text-purple-100 ml-4'
                        : 'bg-gray-800/50 text-gray-200 mr-4'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.isExecuting && (
                        <Loader2 className="w-3 h-3 mt-0.5 animate-spin text-purple-400 flex-shrink-0" />
                      )}
                      <span>{message.content}</span>
                    </div>
                    <div className="text-xs opacity-60 mt-1">
                      {message.timestamp.toLocaleTimeString()}
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
                    placeholder="Say a command or type here..."
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg 
                             text-gray-200 placeholder-gray-400 focus:outline-none focus:border-purple-500
                             focus:ring-1 focus:ring-purple-500 text-sm"
                    disabled={isProcessing}
                  />
                </div>
                
                {/* Voice Input Button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-2 rounded-lg transition-colors ${
                    isListening 
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                  disabled={isProcessing}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!inputText.trim() || isProcessing}
                  className="p-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 
                           disabled:text-gray-500 text-white rounded-lg transition-colors"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </form>

              {/* Status */}
              <div className="mt-2 text-xs text-gray-400">
                {!jarvisAI.isReady() && (
                  <span className="text-yellow-400">⚠️ AI service not initialized</span>
                )}
                {isListening && (
                  <span className="text-red-400">🎤 Listening...</span>
                )}
                {isProcessing && (
                  <span className="text-blue-400">🤖 Processing command...</span>
                )}
                {isSpeaking && (
                  <span className="text-purple-400">🔊 JARVIS speaking...</span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 