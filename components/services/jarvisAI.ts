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
    description: 'Control map navigation, zoom to cities, and display specific areas or threats. Can navigate to any city worldwide.',
    parameters: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['zoom_to', 'show_threats', 'show_assets', 'center_on'],
          description: 'Map navigation action - zoom_to/center_on for cities, show_threats/show_assets for filtering'
        },
        location: {
          type: 'string',
          description: 'City name, address, or location (e.g., "New York", "London", "Tel Aviv", "Tokyo")'
        },
        zoom_level: {
          type: 'integer',
          minimum: 10,
          maximum: 18,
          description: 'Map zoom level: 10-12 for country/region view, 13-15 for city view, 16-18 for street level'
        }
      },
      required: ['action']
    }
  },
  {
    name: 'expand_portal',
    description: 'Expand/maximize an existing portal to fullscreen view',
    parameters: {
      type: 'object',
      properties: {
        portal_type: {
          type: 'string',
          enum: PORTAL_TYPES,
          description: 'Type of portal to expand to fullscreen'
        }
      },
      required: ['portal_type']
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
  },
  {
    name: 'filter_alerts',
    description: 'Filter and sort alerts by type, severity, or status. Controls the alert portal filter dropdowns.',
    parameters: {
      type: 'object',
      properties: {
        alert_type: {
          type: 'string',
          enum: ['all', 'threat', 'system'],
          description: 'Filter by alert type: all alerts, threat alerts only, or system alerts only'
        },
        severity: {
          type: 'string',
          enum: ['all', 'critical', 'high', 'medium', 'low'],
          description: 'Filter by severity level: all levels, critical, high, medium, or low'
        },
        show_resolved: {
          type: 'boolean',
          description: 'Whether to include resolved alerts in the view'
        },
        sort_by: {
          type: 'string',
          enum: ['timestamp', 'severity'],
          description: 'Sort alerts by timestamp (newest first) or severity (critical first)'
        }
      }
    }
  },
  {
    name: 'acknowledge_alert',
    description: 'Acknowledge a specific alert by ID or title to mark it as seen',
    parameters: {
      type: 'object',
      properties: {
        alert_id: {
          type: 'string',
          description: 'Specific alert ID to acknowledge'
        },
        alert_title: {
          type: 'string',
          description: 'Alert title or partial title to find and acknowledge'
        }
      }
    }
  },
  {
    name: 'resolve_alert',
    description: 'Resolve a specific alert by ID or title to mark it as handled',
    parameters: {
      type: 'object',
      properties: {
        alert_id: {
          type: 'string',
          description: 'Specific alert ID to resolve'
        },
        alert_title: {
          type: 'string',
          description: 'Alert title or partial title to find and resolve'
        }
      }
    }
  },
  {
    name: 'escalate_alert',
    description: 'Escalate a specific alert by ID or title for higher priority handling',
    parameters: {
      type: 'object',
      properties: {
        alert_id: {
          type: 'string',
          description: 'Specific alert ID to escalate'
        },
        alert_title: {
          type: 'string',
          description: 'Alert title or partial title to find and escalate'
        }
      }
    }
  }
]

// Command execution result interface
export interface CommandResult {
  success: boolean
  message: string
  action?: {
    type: 'open_portal' | 'close_portal' | 'show_weather' | 'analyze_threats' | 'navigate_map' | 'expand_portal' | 'control_interface' | 'filter_alerts' | 'acknowledge_alert' | 'resolve_alert' | 'escalate_alert'
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
            
            EXPAND/MAXIMIZE COMMANDS:
            - When user says "expand [portal]", "maximize [portal]", "fullscreen [portal]" → use expand_portal function
            - When user says "open [portal] fullscreen" → use open_portal with level 3
            - "Expand weather" → expand_portal(weather)
            - "Maximize map" → expand_portal(map)
            - "Fullscreen alerts" → expand_portal(alerts)
            
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
            - "Expand weather portal" → expand_portal(weather)
            - "Maximize alerts" → expand_portal(alerts)
            - "Fullscreen timeline" → expand_portal(timeline)
            - "Expand data view" → expand_portal(data-view)
            - "Maximize the map" → expand_portal(map)
            - "Expand camera" → expand_portal(camera-capability)
            - "Display the map" → open_portal(map, level 2)
            - "Close everything" → close_portal(all)
            - "Navigate to New York" → navigate_map(zoom_to, "New York", 14)
            - "Go to London" → navigate_map(zoom_to, "London", 14)
            - "Show me Tokyo on the map" → navigate_map(center_on, "Tokyo", 13) 
            - "Take me to Paris" → navigate_map(zoom_to, "Paris", 14)
            - "Zoom into Berlin" → navigate_map(zoom_to, "Berlin", 16)
            - "Head to Los Angeles" → navigate_map(center_on, "Los Angeles", 13)
            - "Find Chicago" → navigate_map(zoom_to, "Chicago", 14)
            - "Focus on threats" → navigate_map(show_threats)
            - "Display assets only" → navigate_map(show_assets)
            
            ALERT MANAGEMENT:
            - "Show all alerts" → filter_alerts(alert_type: "all")
            - "Show only threat alerts" → filter_alerts(alert_type: "threat")
            - "Show system alerts" → filter_alerts(alert_type: "system")
            - "Filter by critical alerts" → filter_alerts(severity: "critical")
            - "Show high priority alerts" → filter_alerts(severity: "high")
            - "Show medium alerts" → filter_alerts(severity: "medium") 
            - "Show low priority alerts" → filter_alerts(severity: "low")
            - "Show all levels" → filter_alerts(severity: "all")
            - "Include resolved alerts" → filter_alerts(show_resolved: true)
            - "Hide resolved alerts" → filter_alerts(show_resolved: false)
            - "Sort by time" → filter_alerts(sort_by: "timestamp")
            - "Sort by severity" → filter_alerts(sort_by: "severity")
            - "Acknowledge the drone alert" → acknowledge_alert(alert_title: "drone")
            - "Resolve the radar alert" → resolve_alert(alert_title: "radar")
            - "Escalate the missile threat" → escalate_alert(alert_title: "missile")
            - "Acknowledge hostile UAS" → acknowledge_alert(alert_title: "UAS")
            - "Resolve network issue" → resolve_alert(alert_title: "network")
            
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
        if (args.action === 'zoom_to' || args.action === 'center_on') {
          const zoomText = args.zoom_level ? ` with zoom level ${args.zoom_level}` : ''
          return `Navigating map to ${args.location}${zoomText}.`
        } else if (args.action === 'show_threats') {
          return 'Focusing map on threat locations.'
        } else if (args.action === 'show_assets') {
          return 'Displaying friendly assets on the map.'
        }
        return `Performing map action: ${args.action}.`
      
      case 'expand_portal':
        const expandPortalName = args.portal_type.replace(/-/g, ' ')
        return `Expanding ${expandPortalName} portal to fullscreen.`
      
      case 'control_interface':
        return `Executing interface control: ${args.action}.`
      
      case 'filter_alerts':
        let filterMessage = 'Filtering alerts'
        if (args.alert_type && args.alert_type !== 'all') {
          filterMessage += ` to show ${args.alert_type} alerts only`
        }
        if (args.severity && args.severity !== 'all') {
          filterMessage += ` with ${args.severity} severity`
        }
        if (args.show_resolved !== undefined) {
          filterMessage += args.show_resolved ? ', including resolved alerts' : ', hiding resolved alerts'
        }
        if (args.sort_by) {
          filterMessage += `, sorted by ${args.sort_by}`
        }
        return filterMessage + '.'
      
      case 'acknowledge_alert':
        if (args.alert_id) {
          return `Acknowledging alert ${args.alert_id}.`
        } else if (args.alert_title) {
          return `Acknowledging alert: ${args.alert_title}.`
        }
        return 'Acknowledging alert.'
      
      case 'resolve_alert':
        if (args.alert_id) {
          return `Resolving alert ${args.alert_id}.`
        } else if (args.alert_title) {
          return `Resolving alert: ${args.alert_title}.`
        }
        return 'Resolving alert.'
      
      case 'escalate_alert':
        if (args.alert_id) {
          return `Escalating alert ${args.alert_id}.`
        } else if (args.alert_title) {
          return `Escalating alert: ${args.alert_title}.`
        }
        return 'Escalating alert.'
      
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
      'Navigate to [city] - e.g., "Go to London", "Navigate to Tokyo", "Take me to Paris"',
      'Map controls - e.g., "Focus on threats", "Show assets", "Zoom to New York"',
      'Expand portals - e.g., "Expand weather", "Maximize map", "Fullscreen alerts"',
      'Filter alerts - e.g., "Show threat alerts", "Show critical alerts", "Show all levels"',
      'Alert actions - e.g., "Acknowledge drone alert", "Resolve radar alert", "Escalate missile threat"',
      'Minimize/maximize interface - Control overall interface'
    ]
  }
} 