# Kraken JARVIS Interface

A military-grade command and control interface inspired by JARVIS from Iron Man, featuring a modular portal system for tactical operations and **natural language AI command interface**.

## ✨ New Feature: Natural Language Command Interface

The JARVIS interface now includes an advanced AI-powered command system that allows operators to control the interface using natural language commands.

### 🚀 Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install openai@4.67.3
   ```

2. **Configure OpenAI API Key**
   Create a `.env` file in your project root:
   ```bash
   # Get your API key from: https://platform.openai.com/api-keys
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Development Environment**
   For development, the interface will work without an API key but with limited functionality.

### 🎯 Command Examples

The JARVIS AI understands natural language commands such as:

**Portal Control:**
- "Open weather portal"
- "Show alerts fullscreen"
- "Display the map"
- "Close all portals"
- "Open camera capability in fullscreen"

**Weather Commands:**
- "Show weather for New York"
- "Display weather information for Tel Aviv"

**Threat Analysis:**
- "Analyze threats"
- "Show critical threats only"
- "Analyze air threats"

**Map Navigation:**
- "Navigate to Baghdad"
- "Center map on Israel"
- "Show threats on map"

**Interface Control:**
- "Minimize all windows"
- "Close everything"

### 🤖 Features

- **Voice Input**: Click the microphone button to use speech recognition
- **Text Input**: Type commands directly
- **OpenAI GPT-4**: Powered by OpenAI's latest language model
- **Function Calling**: AI determines appropriate portal actions
- **Smart Context**: Understands portal types and levels
- **Real-time Feedback**: Immediate visual and audio responses
- **Chat History**: Conversation history with JARVIS

### 🔧 Technical Implementation

**AI Service Layer** (`components/services/jarvisAI.ts`):
- OpenAI Function Calling integration
- Portal type recognition
- Command intent analysis
- Error handling and fallbacks

**Command Interface** (`components/SimpleCommandInterface.tsx`):
- Voice recognition using Web Speech API
- Chat-style interaction
- Real-time status indicators
- Mobile-responsive design

**Integration Hook** (`components/hooks/useCommandExecutor.ts`):
- Portal state management integration
- Command execution handling
- Action dispatching

### 🛡️ Security Considerations

- API key is client-side for development (use backend proxy in production)
- Input sanitization and validation
- Command execution safety checks
- Portal access control integration

## Recent Updates

### AlertsPortal Implementation
The AlertsPortal has been implemented following the PRD specifications with both Level 2 and Level 3 functionality.

#### Design Patterns Used:
- **Modular Portal Architecture**: AlertsPortal follows the established pattern with level-based rendering (Level 2 for compact view, Level 3 for expanded view)
- **TypeScript Interfaces**: Comprehensive type definitions for ThreatAlert and SystemAlert data structures
- **Framer Motion Animations**: Smooth transitions and hover effects following the established spring physics configuration
- **Radix UI Components**: Uses established UI primitives (Switch, Select, Tooltip, Badge) for consistency
- **Color System**: Follows military aesthetic with severity-based color coding (red for critical, orange for high, yellow for medium, blue for low)
- **State Management**: Persistent state management using custom hook (useAlertsState) to maintain state across Level 2 ↔ Level 3 transitions
- **Responsive Design**: Two-column layout in Level 3 with main content and settings panel

#### Components:
- **AlertsPortal**: Main component handling both Level 2 and Level 3 views
- **ThreatAlert Interface**: Defines structure for threat-based alerts with location, confidence, and countermeasures
- **SystemAlert Interface**: Defines structure for system status alerts with remediation steps and affected systems
- **Alert Settings**: Configurable notification preferences (audio, visual, haptic, role-based filtering)

#### Integration Points:
- Links to Map Portal for location context (MapPin button)
- Follows established portal lifecycle (acknowledge, resolve, escalate actions)
- Export functionality for operational reporting
- Real-time refresh capability with configurable intervals

#### State Persistence Solution:
**Problem**: State was being reset when toggling between Level 2 and Level 3 views because each level creates a new component instance.

**Solution**: Implemented `useAlertsState` custom hook that maintains global state outside of component lifecycle:
- **Global State Store**: Module-level state object that persists across component mounts/unmounts
- **Custom Hook**: Provides centralized state management with actions for all AlertsPortal operations
- **State Maintained**: Filters, sorting, settings, alert acknowledgments, and resolved states persist across level changes
- **Consistent Experience**: Users can now seamlessly switch between Level 2 and Level 3 without losing their work

## Technology Stack

- **React 18** with TypeScript
- **Tailwind CSS** with custom military styling
- **Radix UI** primitives for accessibility
- **Framer Motion** for animations
- **Leaflet** for geospatial mapping
- **Recharts** for data visualization
- **OpenAI GPT-4** for natural language processing

## Portal System

The interface uses a 3-level portal system:
- **Level 1**: Icons in edge trays
- **Level 2**: 3x3 grid portals (minimum 300x200px)
- **Level 3**: Fullscreen portals with expanded functionality

## Color System

Following military aesthetic guidelines:
- **Severity Indicators**: Red (critical), Orange (high), Yellow (medium), Blue (low), Gray (info)
- **Status Badges**: Green (resolved), Yellow (acknowledged), Red (active), Purple (escalated)
- **System Colors**: Purple accents for UI elements, Grayscale base with proper contrast

## Development Guidelines

1. **Modular Components**: Each portal should be self-contained with clear interfaces
2. **Type Safety**: Comprehensive TypeScript interfaces for all data structures
3. **Accessibility**: Use Radix UI primitives and proper ARIA labels
4. **Performance**: Optimize with React.memo, useMemo for heavy computations
5. **Military UX**: Maintain tactical aesthetic with clear information hierarchy
6. **AI Integration**: Follow established patterns for natural language command processing 