import OpenAI from 'openai'
import { PortalData } from '../constants/portalConfigs'

// Environment variable for OpenAI API key - fallback for development
const getApiKey = (): string => {
  try {
    return (import.meta as any).env.VITE_OPENAI_API_KEY || 'YOUR_API_KEY_HERE'
  } catch {
    return 'YOUR_API_KEY_HERE'
  }
}
const OPENAI_API_KEY = getApiKey()

// Function definitions for Kraken AI commands
export interface KrakenCommand {
  name: string
  description: string
  parameters: {
    type: string
    properties: Record<string, any>
    required?: string[]
  }
}

// Available portal types from your existing system
const PORTAL_TYPES = [
  'system', 'weather', 'calendar', 'network-diagram', 'data-links', 
  'cyber-attack-surface', 'power', 'media', 'documents',
  'map', 'timeline', 'messenger', 'alerts', 'camera-capability', 'data-view',
  'confidence-scoring', 'prioritization', 'coa-generator', 'asset-tasking', 
  'human-teaming', 'context-correlator'
] as const

export type PortalType = typeof PORTAL_TYPES[number]

// Function schemas for Kraken AI commands
export const KRAKEN_FUNCTIONS: KrakenCommand[] = [
  {
    name: 'open_portal',
    description: 'Open a specific portal in the Kraken interface at Level 2 (grid) or Level 3 (fullscreen)',
    parameters: {
      type: 'object',
      properties: {
        portal_type: {
          type: 'string',
          enum: PORTAL_TYPES,
          description: 'Type of portal to open (e.g., weather, alerts, map, timeline, camera-capability)'
        },
        level: {
          type: 'integer',
          enum: [2, 3],
          description: 'Portal level: 2 for grid view, 3 for fullscreen'
        }
      },
      required: ['portal_type']
    }
  },
  {
    name: 'close_portal',
    description: 'Close a specific portal or all portals',
    parameters: {
      type: 'object',
      properties: {
        portal_type: {
          type: 'string',
          enum: [...PORTAL_TYPES, 'all'],
          description: 'Type of portal to close, or "all" to close all portals'
        }
      },
      required: ['portal_type']
    }
  },
  {
    name: 'show_weather',
    description: 'Display weather information for a specific location',
    parameters: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'Location for weather information (e.g., "New York", "Tel Aviv")'
        },
        level: {
          type: 'integer',
          enum: [2, 3],
          description: 'Display level: 2 for compact view, 3 for detailed view'
        }
      }
    }
  },
  {
    name: 'analyze_threats',
    description: 'Analyze current threat situation and display alerts',
    parameters: {
      type: 'object',
      properties: {
        severity_filter: {
          type: 'string',
          enum: ['all', 'critical', 'high', 'medium', 'low'],
          description: 'Filter threats by severity level'
        },
        threat_type: {
          type: 'string',
          enum: ['all', 'air', 'ground', 'cyber', 'missile'],
          description: 'Filter by threat type'
        }
      }
    }
  },
  {
    name: 'navigate_map',
    description: 'Control map navigation and display specific areas or threats',
    parameters: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['zoom_to', 'show_threats', 'show_assets', 'center_on'],
          description: 'Map navigation action'
        },
        location: {
          type: 'string',
          description: 'Location name or coordinates'
        },
        zoom_level: {
          type: 'integer',
          minimum: 1,
          maximum: 20,
          description: 'Map zoom level (1-20)'
        }
      },
      required: ['action']
    }
  },
  {
    name: 'control_interface',
    description: 'Control general Kraken interface settings and appearance',
    parameters: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['minimize_all', 'maximize_all', 'toggle_grid', 'change_theme'],
          description: 'Interface control action'
        },
        setting: {
          type: 'string',
          description: 'Additional setting parameter if needed'
        }
      },
      required: ['action']
    }
  }
]

// Command execution result interface
export interface CommandResult {
  success: boolean
  message: string
  action?: {
    type: 'open_portal' | 'close_portal' | 'show_weather' | 'analyze_threats' | 'navigate_map' | 'control_interface'
    payload: any
  }
}

// Kraken AI Service Class
export class KrakenAI {
  private openai: OpenAI | null = null
  private isInitialized: boolean = false

  constructor() {
    if (OPENAI_API_KEY === 'YOUR_API_KEY_HERE') {
      console.warn('⚠️ OpenAI API key not set. Please add VITE_OPENAI_API_KEY to your environment variables.')
      this.isInitialized = false
      return
    }

    try {
      this.openai = new OpenAI({
        apiKey: OPENAI_API_KEY,
        dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
      })
      this.isInitialized = true
      console.log('✅ Kraken AI initialized successfully')
    } catch (error) {
      console.error('❌ Failed to initialize Kraken AI:', error)
      this.isInitialized = false
    }
  }

  async processCommand(userInput: string, availablePortals: PortalData[]): Promise<CommandResult> {
    if (!this.isInitialized || !this.openai) {
      return {
        success: false,
        message: 'Kraken AI is not properly initialized. Please check your API key configuration.'
      }
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are Kraken AI, an advanced AI assistant for a military command and control interface. 
            
            Available portals: ${availablePortals.map(p => `${p.id} (${p.title})`).join(', ')}
            
            You can control the interface through function calls. Always respond professionally and concisely.
            When a user asks to open or show something, determine the most appropriate portal and level.
            
            IMPORTANT LEVEL GUIDELINES:
            - Level 2 (grid view): Default for most requests like "show weather", "open alerts", "open camera"
            - Level 3 (fullscreen): Use when user explicitly asks for "fullscreen", "full screen", "maximize", "maximized", "expanded view", "expand", or similar terms
            
            Portal Categories:
            - System: weather, calendar, system status, network, power, security
            - Specialized: map, timeline, alerts, camera-capability, messenger, data-view  
            - AI Engine: confidence-scoring, prioritization, coa-generator, asset-tasking
            
            CRITICAL: For camera requests, ALWAYS use "camera-capability" as the portal_type.
            
            Examples:
            - "Show me the weather" → open_portal(weather, level 2)
            - "Open alerts fullscreen" → open_portal(alerts, level 3)
            - "Show map in full screen" → open_portal(map, level 3)
            - "Maximize the camera" → open_portal(camera-capability, level 3)
            - "Show camera feeds" → open_portal(camera-capability, level 2)
            - "Open camera portal fullscreen" → open_portal(camera-capability, level 3)
            - "Expand the camera view" → open_portal(camera-capability, level 3)
            - "Display the map" → open_portal(map, level 2)
            - "Close everything" → close_portal(all)
            
            Always use level 3 when the user requests fullscreen, maximized, expanded, or similar views.`
          },
          {
            role: 'user',
            content: userInput
          }
        ],
        functions: KRAKEN_FUNCTIONS.map(func => ({
          name: func.name,
          description: func.description,
          parameters: func.parameters
        })),
        function_call: 'auto',
        temperature: 0.3
      })

      const message = response.choices[0].message

      // Check if AI wants to call a function
      if (message.function_call) {
        const functionName = message.function_call.name
        const functionArgs = JSON.parse(message.function_call.arguments || '{}')

        console.log(`🤖 Kraken AI executing: ${functionName}`, functionArgs)

        return {
          success: true,
          message: this.generateResponseMessage(functionName, functionArgs),
          action: {
            type: functionName as any,
            payload: functionArgs
          }
        }
      } 
      // Regular response without function call
      else if (message.content) {
        return {
          success: true,
          message: message.content
        }
      }

      return {
        success: false,
        message: 'I did not understand that command. Please try rephrasing.'
      }

    } catch (error) {
      console.error('❌ Kraken AI error:', error)
      return {
        success: false,
        message: 'I encountered an error processing your command. Please try again.'
      }
    }
  }

  private generateResponseMessage(functionName: string, args: any): string {
    switch (functionName) {
      case 'open_portal':
        const level = args.level === 3 ? 'fullscreen' : 'grid view'
        const portalName = args.portal_type.replace(/-/g, ' ')
        return `Opening ${portalName} portal in ${level}.`
      
      case 'close_portal':
        return args.portal_type === 'all' 
          ? 'Closing all portals.' 
          : `Closing ${args.portal_type.replace(/-/g, ' ')} portal.`
      
      case 'show_weather':
        const location = args.location || 'current location'
        const weatherLevel = args.level === 3 ? 'fullscreen' : 'grid view'
        return `Displaying weather information for ${location} in ${weatherLevel}.`
      
      case 'analyze_threats':
        return `Analyzing threats with ${args.severity_filter || 'all'} severity levels.`
      
      case 'navigate_map':
        return `Performing map action: ${args.action}.`
      
      case 'control_interface':
        return `Executing interface control: ${args.action}.`
      
      default:
        return 'Command executed successfully.'
    }
  }

  // Check if AI service is ready
  isReady(): boolean {
    return this.isInitialized
  }

  // Get available commands for help
  getAvailableCommands(): string[] {
    return [
      'Open [portal name] - e.g., "Open weather portal", "Show alerts"',
      'Close [portal name] or "Close all" - e.g., "Close weather", "Close everything"', 
      'Show weather for [location] - e.g., "Show weather for New York"',
      'Analyze threats - Show current threat analysis',
      'Navigate map to [location] - Control map navigation',
      'Minimize/maximize interface - Control overall interface'
    ]
  }
} 