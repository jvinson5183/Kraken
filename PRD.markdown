# JARVIS Interface Requirements Document

## Overview
This document outlines the requirements for developing a domain-agnostic, modular open systems architecture interface inspired by JARVIS from Iron Man. The interface is a high-definition, military-grade command and control system with a grayscale color scheme accented by purple highlights, integrating with real APIs for enhanced functionality. The system features a 3x3 portal grid, edge trays, an AI avatar, and a Kraken logo, all built using Radix UI primitives and Radix Scale for consistent theming.

## General Requirements
- **Technology Stack**: React, TypeScript, Tailwind CSS, Radix UI primitives, Framer Motion for animations, Recharts for charts.
- **Color Scheme**: Grayscale base (Radix Gray) with purple accents (Radix Purple) per Radix Scale.
  - Default icons: `gray-300` → Radix `gray-10` (#D1D5DB).
  - Active/selected icons: `purple-300` → Radix `purple-9` (#C084FC).
  - Hover states: `purple-400` → Radix `purple-10` (#A855F7).
  - Status indicators: Green (`green-400` → Radix `green-10` #4ADE80), Yellow (`yellow-400` → Radix `yellow-10` #FACC15), Red (`red-400` → Radix `red-10` #F87171).
- **Type**: Font will be Roboto. Body 18dp, Labels 16dp, Captions 14dp, Heading 4 20dp, Heading 3 24dp, Heading 2 28dp, Heading 4 35dp.
- **Primitives**: Use Radix primitives.
- **Responsive Design**: Adapts to various screen sizes, ensuring usability on desktop and larger displays.
- **Military Aesthetic**: Tactical, professional design with grid overlays, real-time data, and status indicators.
- **API Integration**: Real-time data from NOAA Weather API, OpenWeatherMap, and military communication APIs (e.g., Link 16, SIPR/NIPR) with proper authentication and error handling.

## Interface Layout
### Main Components
- **JarvisInterface**: Full-screen layout managing the experience.
  - Background: Grayscale gradient (`from-gray-900 via-gray-800 to-gray-900` → Radix `gray-12` to `gray-11`).
  - Grid overlay: Subtle gray lines (`rgba(156, 163, 175, 0.2)` → Radix `gray-8`).
- **EdgeTrays**: Four trays (top, bottom, left, right) that appear on cursor proximity (~40px from edge).
  - Width: 80px, with 40px padding for hover effects.
  - Background: `bg-gray-900/90` → Radix `gray-12/90`.
  - Icons: 24x24px, `text-gray-300` → Radix `gray-10`, active state `text-purple-9`.
  - Tooltips: Display portal name and "Single-click: Level 2, Double-click: Level 3" using Radix Tooltip.
- **PortalGrid**: 3x3 grid in the center, dynamically filling available space.
  - Margins: 120px on all sides to avoid tray overlap.
  - Hidden by default until portals are opened.
  - Uses Radix `gray-12` background with `purple-9` accents for active portals.
- **AI Avatar**: Customizable avatar in upper-left corner (96x96px).
  - Options: Kraken Eye (default), Human Face, Robot Face.
  - Kraken Eye: SVG with purple strokes (`purple-9`), transparent background, iris tracks mouse.
  - Click to open Radix Dropdown Menu for avatar selection.
- **User Profile**: Upper-right corner below classification banner.
  - Displays "Logged In As: Captain Malone" with Radix Avatar (32x32px).
  - Background: `bg-gray-900/60` → Radix `gray-12/60`.
- **Kraken Logo**: 40x40px SVG in upper-right, right of User Profile, no background.
  - Uses original purple colors (`purple-9` to `purple-12`).
- **Close All Portals Button**: Bottom-left corner (16px from edges), only visible when portals are open.
  - Circular, `bg-gray-900/20` → Radix `gray-12/20`, `border-purple-9/50` on hover.
  - X icon (`text-purple-9`), tooltip: "Close All Portals".
- **Classification Banner**: Fixed at top, green "UNCLASSIFIED" (`green-10`).

### Portal System
- **Levels**:
  - Level 1: Icons in edge trays.
  - Level 2: 3x3 grid portals (min 300x200px).
  - Level 3: Fullscreen portal (120px margins left/right, 140px top, 80px bottom).
- **Interactions**:
  - Single-click tray icon: Opens/closes Level 2 portal.
  - Double-click tray icon: Opens Level 3 portal.
  - Double-click Level 2 header: Expands to Level 3.
  - ESC key or minimize icon (`Minimize2`) returns Level 3 to Level 2.
- **Styling**:
  - Level 2: `bg-gray-900/90` → Radix `gray-12/90`, `border-gray-700` → Radix `gray-9`.
  - Level 3: Single header, `bg-gray-900/95` → Radix `gray-12/95`, purple gradients (`purple-9` to `purple-11`).
  - Headers: `text-purple-9`, icons `gray-10`.

## Portal Content
### System Portals (Top Tray)
1. **System Status**:
   - Level 2: CPU, memory, storage, network metrics, service status.
   - Level 3: Detailed dashboard with performance charts, service logs.
   - Charts: Static Recharts with `isAnimationActive={false}`, `gray-10` lines.
2. **Weather**:
   - Level 2: Current temperature, humidity, wind, 6-hour forecast, alerts.
   - Level 3: 24-hour forecast, wind/pressure charts, satellite view with NOAA imagery.
   - API: NOAA Weather API for real-time data (https://api.weather.gov).
   - Imagery: Satellite weather map (provided Figma asset).
3. **Calendar**:
   - Level 2: Today’s schedule, event priorities, completion status.
   - Level 3: Multi-day view, event details, statistics dashboard.
4. **Messages**:
   - Level 2: Message previews, unread counters, channel status.
   - Level 3: Full communication hub with channel filters, encryption status.
5. **Security**:
   - Level 2: Threat levels, active events, DEFCON status.
   - Level 3: Detailed threat analysis, access control, emergency controls.
6. **Power**:
   - Level 2: Grid status, consumption, UPS monitoring.
   - Level 3: Power management dashboard, critical load controls.
7. **Network Diagram**:
   - Level 2: Topology, traffic flow, node status.
   - Level 3: Interactive network map, bandwidth/latency metrics.
8. **Data Links**:
   - Level 2: NIPR, SIPR, Link 16, TektoNet status, signal strength.
   - Level 3: Network topology, traffic analysis, encryption monitoring.
   - API: Simulated military communication APIs for real-time status.
9. **Cyber Attack Surface**:
   - Level 2: Threat dashboard, attack events, vulnerabilities.
   - Level 3: Threat vector analysis, vulnerability management, defense status.

### Specialized Portals (Left Tray)
## 1. Map Portal
The Map Portal provides geospatial situational awareness, visualizing assets and threats.

### Level 2: Map Portal
- **Basic Geospatial Display**:
  - 2D map with terrain and airspace layers, showing friendly and enemy assets (e.g., drones, aircraft).
  - Plot threats and assets using data from primary sensors (e.g., Sentinel radar).
- **Threat Visualization**:
  - Display threat tracks with basic identifiers (e.g., friend-or-foe status).
  - Show engagement zones and no-fly areas with static boundaries.
- **Asset Status**:
  - Indicate sensor and effector locations with simple status icons (e.g., online/offline).
- **Interoperability**:
  - Connect to core Army systems (e.g., IBCS) for basic air picture sharing.
- **User Interaction**:
  - Support basic zoom and pan on touchscreen devices.
  - Operate on tablets with online connectivity.
- **Performance**:
  - Update map every 0.5s for real-time tracking.

### Level 3: Map Portal
- **Advanced Geospatial Visualization**:
  - 2D/3D interactive map with customizable overlays (e.g., terrain, weather, operational zones).
  - Dynamic zoom and layered views for detailed analysis.
- **Threat Tracking and Identification**:
  - Visualize detailed threat trajectories, predicted impact points, and engagement envelopes.
  - Use AI to prioritize threats based on proximity, speed, and intent, with unique IDs (e.g., IFF codes).
- **Asset Management**:
  - Display detailed asset information (e.g., ammo levels, readiness) via clickable icons.
  - Monitor sensor/effector health and connectivity in real-time.
- **Interoperability**:
  - Integrate with NATO Link 16, JTIDS, and ABCS for shared air picture.
  - Support data feeds from AMDWS and emerging systems.
- **User Interaction**:
  - Enable drawing of engagement zones, annotations, and geofences.
  - Support offline map caching for low-connectivity environments.
- **Performance**:
  - Update map in <0.25s, handling high-density scenarios (e.g., drone swarms).
   - Imagery: Provided Figma drone imagery.

## 2. Timeline Portal
The Timeline Portal tracks mission events chronologically.

### Level 2: Timeline Portal
- **Basic Event Logging**:
  - Log key events (e.g., threat detection, engagement) with timestamps.
  - Categorize events by type (e.g., C-UAS, C-RAM).
- **Simple Timeline View**:
  - Display a linear timeline with event markers.
  - Allow basic filtering by event type.
- **Integration**:
  - Link events to Map Portal for basic context.
- **Playback**:
  - Support limited event review for recent activities (last 1 hour).

### Level 3: Timeline Portal
- **Detailed Event Logging**:
  - Record all events (e.g., sensor alerts, engagement orders) with timestamps, source, and context.
  - Categorize by type and severity (e.g., critical, warning).
- **Interactive Timeline**:
  - Scrollable, zoomable timeline with color-coded markers.
  - Filter by event type, time range, or asset involvement.
  - Link events to Map Portal tracks and Camera Portal feeds.
- **Predictive Analysis**:
  - Project future events (e.g., intercept times) based on threat trajectories.
  - Highlight potential conflicts (e.g., friendly aircraft in engagement zones).
- **Historical Playback**:
  - Replay mission segments with synchronized Map and Camera views.
  - Export timeline data in CSV/JSON for reporting.
- **Integration**:
  - Sync with Alerts and Messenger Portals for comprehensive event correlation.

## 3. Messenger Portal
The Messenger Portal enables secure communication.

### Level 2: Messenger Portal
- **Basic Communication**:
  - Support encrypted text messaging for operators and units.
  - Enable point-to-point chats with basic user authentication.
- **Interoperability**:
  - Connect to core Army communication systems (e.g., IBCS).
- **Message Logging**:
  - Store messages with timestamps for basic audit.
- **Mobile Support**:
  - Operate on tablets with online connectivity.

### Level 3: Messenger Portal
- **Secure Communication**:
  - Support encrypted text, voice, and data messaging, compliant with DoD standards.
  - Enable group chats with role-based access (e.g., commanders, operators).
- **Interoperability**:
  - Integrate with NATO Link 16, VMF, and Army systems (e.g., AMDWS).
- **Contextual Messaging**:
  - Attach Map Portal tracks, Timeline events, or Camera clips to messages.
  - Provide pre-defined templates for rapid reporting (e.g., threat alerts).
- **Auditability**:
  - Log all messages with sender/recipient details, searchable by keyword.
- **Mobile Support**:
  - Function in low-bandwidth environments with offline message queuing.

## 4. Alerts Portal
The Alerts Portal delivers prioritized notifications.

### Level 2: Alerts Portal
- **Basic Threat Alerts**:
  - Notify operators of detected threats (e.g., drones, RAM) with type and location.
  - Use pre-set priority levels.
- **System Alerts**:
  - Report critical sensor/effector issues (e.g., offline status).
- **Notification Delivery**:
  - Display visual alerts with basic audible cues.
- **Integration**:
  - Link alerts to Map Portal for location context.

### Level 3: Alerts Portal
- **Advanced Threat Alerts**:
  - Generate detailed notifications with threat details (e.g., speed, trajectory).
  - Prioritize alerts using AI-driven assessment (AI, called Kraken, coming later), with customizable thresholds.
- **System Status Alerts**:
  - Monitor sensor/effector connectivity, ammo, and cyber threats.
  - Notify of interoperability issues (e.g., dropped Link 16).
- **Customizable Notifications**:
  - Configure alert types, delivery methods (e.g., visual, audible, haptic), and escalation paths.
  - Support role-based alerts (e.g., tactical vs. strategic).
- **Integration**:
  - Link to Map, Timeline, and Camera Portals for full context.
  - Interface with C-RAM warning systems for base-wide alerts.
- **Reliability**:
  - Deliver alerts in <0.5s, with redundancy for network disruptions.

## 5. Camera Portal
The Camera Portal integrates visual feeds for threat confirmation.

### Level 2: Camera Portal
- **Basic Live Feeds**:
  - Stream video from primary EO/IR sensors.
  - Display single feed at a time.
- **Threat Correlation**:
  - Show basic Map Portal track overlays (e.g., threat ID).
- **Recording**:
  - Record feeds with timestamps for recent events (last 1 hour).
- **Access**:
  - Operate on tablets with online connectivity.

### Level 3: Camera Portal
- **Advanced Live Feeds**:
  - Stream multiple feeds (EO/IR, radar-linked cameras) in tiled or picture-in-picture views.
- **Threat Correlation**:
  - Overlay detailed Map Portal track data (e.g., trajectories, IDs) on feeds.
  - Select Map Portal tracks to view corresponding feeds.
- **Control Features**:
  - Support PTZ control with AI-assisted threat tracking.
  - Use presets for known threat vectors.
- **Recording and Playback**:
  - Record all feeds, linked to Timeline events for synchronized review.
  - Export clips in DoD-compliant formats.
- **Bandwidth Optimization**:
  - Use adaptive streaming and local caching for low-connectivity environments.
- **Security**:
  - Encrypt streams with role-based access controls.

## 6. Data View Portal
The **Data View Portal** provides a comprehensive interface for accessing, analyzing, and managing raw and processed data from sensors, effectors, and integrated systems. It enables operators to monitor system performance, verify data integrity, and generate reports, enhancing situational awareness and operational efficiency.

### Level 2: Data View Portal
- **Basic Data Access**:
  - Display real-time data streams from primary sensors (e.g., Sentinel radar, EO/IR) in tabular or list format.
  - Show key data points (e.g., threat coordinates, sensor status, detection timestamps).
- **Data Filtering**:
  - Allow basic filtering by data source (e.g., radar, IFF) or event type (e.g., C-UAS, C-RAM).
  - Provide simple search functionality for recent data (last 1 hour).
- **System Health Monitoring**:
  - Show basic sensor and effector status (e.g., online/offline, error codes).
  - Display connectivity status for core Army systems (e.g., IBCS).
- **Data Export**:
  - Export data snapshots in CSV format for basic reporting.
- **Integration**:
  - Link data to Map Portal for spatial context and Alerts Portal for triggered notifications.
- **User Interface**:
  - Provide a simple, tabular dashboard accessible on tablets with online connectivity.
- **Performance**:
  - Update data displays every 0.5s to support real-time operations.

### Level 3: Data View Portal
- **Comprehensive Data Access**:
  - Aggregate and display raw and processed data from all integrated sensors (e.g., AN/TPQ-53, EO/IR, Link 16) and effectors (e.g., Coyote interceptors, directed energy weapons).
  - Present data in customizable formats (e.g., tables, graphs, heatmaps) with drill-down capabilities for detailed metrics (e.g., signal strength, detection confidence).
- **Advanced Data Analysis**:
  - Enable advanced filtering by data source, time range, threat type, or system component.
  - Support search with regex or natural language queries for historical and real-time data.
  - Provide AI-driven anomaly detection to highlight unusual data patterns (e.g., sensor drift, jamming).
- **System Health and Diagnostics**:
  - Monitor detailed system metrics (e.g., sensor calibration, effector ammo levels, network latency).
  - Offer diagnostic tools to troubleshoot issues, with recommendations for corrective actions (e.g., switch to backup sensor).
- **Data Visualization**:
  - Generate dynamic visualizations (e.g., time-series graphs, data distribution charts) for operator analysis.
  - Link data points to Map Portal tracks, Timeline Portal events, and Camera Portal feeds for cross-portal correlation.
- **Data Export and Reporting**:
  - Export data in multiple formats (e.g., CSV, JSON, PDF) with customizable templates for after-action reports.
  - Support automated report generation for mission summaries, compliant with Army and NATO standards.
- **Interoperability**:
  - Integrate with NATO systems (e.g., Link 16, JTIDS), IBCS, AMDWS, and AFATDS for seamless data sharing.
  - Support API access for third-party systems to pull or push data.
- **Security**:
  - Encrypt all data streams and storage, compliant with DoD cybersecurity standards.
  - Implement role-based access controls to restrict sensitive data (e.g., raw IFF codes) to authorized users.
- **Mobile and Offline Support**:
  - Operate on tablets with offline data caching for low-connectivity environments.
  - Sync cached data when connectivity is restored.
- **Performance**:
  - Update data in <0.25s, handling high-density scenarios (e.g., drone swarms).
  - Optimize for low-latency processing in multi-domain operations.

### AI Engine Portals (Right Tray)
## 1. Confidence Scoring Engine
The Confidence Scoring Engine assesses reliability of detections and plans.

### Level 2: Confidence Scoring Engine
- **Basic Threat Scoring**:
  - Assign confidence scores to threat detections based on primary sensor data.
  - Differentiate between drones, aircraft, and clutter.
- **Engagement Scoring**:
  - Provide basic scores for weapon-target pairings (e.g., feasibility).
- **Integration**:
  - Display scores on Map and Alerts Portals.
- **Performance**:
  - Generate scores in <0.5s.

### Level 3: Confidence Scoring Engine
- **Advanced Threat Scoring**:
  - Use machine learning to score threats based on multi-sensor fusion (e.g., radar, EO/IR, IFF).
  - Update scores in real-time, reducing false positives.
- **Engagement Plan Scoring**:
  - Evaluate kinetic and non-kinetic options for effectiveness and safety.
  - Provide explainable AI outputs (e.g., “90% confidence due to radar lock”).
- **Sensor Reliability Scoring**:
  - Score sensor performance based on calibration and environmental factors.
  - Recommend fallback sensors if needed.
- **Integration**:
  - Feed scores to Map, Alerts, and Messenger Portals.
  - Share scores with IBCS and NATO systems.
- **Performance**:
  - Generate scores in <0.25s for high-density scenarios.
- **Security and Ethics**:
  - Ensure auditable AI models, compliant with DoD ethics guidelines.

2. **Prioritization Engine**:
   - Icon: Custom Group-2016-62 (Figma).
   - Level 2: Priority queue, urgency indicators.
   - Level 3: Task prioritization dashboard, ETA tracking.
3. **Course of Action (COA) Generator**:
   - Icon: Custom Group-2016-86 (Figma).
   - Level 2: COA options, viability scores.
   - Level 3: Detailed COA analysis, risk assessments.
4. **Asset Tasking Optimizer**:
   - Icon: Custom Vector (Figma).
   - Level 2: Asset utilization, status monitoring.
   - Level 3: Resource allocation dashboard, health tracking.
5. **Adaptive Human-Machine Teaming**:
   - Icon: Custom Group73073 (Figma).
   - Level 2: Collaboration metrics, trust indicators.
   - Level 3: Operator behavior analysis, autonomy adjustments.
6. **Multi-Domain Context Correlator**:
   - Icon: Custom Group-2018-78 (Figma).
   - Level 2: Cross-domain correlations, threat insights.
   - Level 3: Multi-domain analysis, pattern visualization.

## Additional Requirements
- **Animations**: Use Framer Motion for smooth transitions (spring physics, damping: 35, stiffness: 400).
- **Charts**: Recharts for data visualization, static with `isAnimationActive={false}` to prevent flickering.
- **Performance**: Optimize with `React.memo`, `useMemo`, and stable keys.
- **Accessibility**: Tooltips, keyboard navigation (ESC key), Radix primitives for ARIA compliance.
- **Error Handling**: Comprehensive handling for API failures with fallback UI.
- **Security**: Placeholder API keys (`YOUR_API_KEY_HERE`), environment variable configuration.

## API Integrations
- **NOAA Weather API**:
  - Endpoint: https://api.weather.gov/points/{lat},{lon}/forecast
  - Data: Temperature, humidity, wind, forecasts, alerts.
  - Authentication: User-Agent header required.
- **Military Communication APIs** (Simulated for NIPR, SIPR, Link 16, TektoNet):
  - Provide real-time status, signal strength, encryption status.
  - Mock endpoints for development, replace with actual APIs in production.
- **Error Handling**: Display fallback data and user-friendly error messages if APIs fail.

## Future Enhancements
- Voice recognition and text-to-speech for true Kraken AI interaction.
- Customizable portal layouts and user preferences.
- Audio feedback for portal interactions.
- Radar/satellite imagery integration for Weather Portal.
- Custom military weather thresholds for operations.