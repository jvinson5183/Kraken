# Kraken JARVIS Interface

A military-grade command and control interface inspired by JARVIS from Iron Man, featuring a modular portal system for tactical operations.

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