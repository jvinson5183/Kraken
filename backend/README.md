# Kraken Alert Backend

Flask backend server for handling real-time alerts in the Kraken interface system.

## Overview

This backend provides:
- **Alert Reception**: `/receive` endpoint for external scenario generators
- **Alert Storage**: In-memory storage (can be upgraded to database)
- **Alert Retrieval**: `/scenarios` endpoint for frontend polling
- **Real-time Integration**: Automatic frontend updates when new alerts arrive

## Quick Start

### 1. Start the Backend Server

```bash
cd backend
python start.py
```

The server will:
- Install required dependencies automatically
- Start on `http://localhost:5173/`
- Display available endpoints

### 2. Start the Frontend (in separate terminal)

```bash
# From the main Kraken directory
npm run dev
```

The frontend will automatically connect to the backend and start polling for alerts every 2 seconds.

### 3. Test with Sample Alerts

```bash
cd backend
python test_scenario.py
```

Choose option 1 to send sample alerts and watch them appear in the Kraken interface.

## API Endpoints

### POST `/receive`
Receive new alerts from scenario generators.

**Request Body:**
```json
{
  "type": "threat|system",
  "severity": "critical|high|medium|low", 
  "title": "Alert title",
  "description": "Alert description",
  "source": "Source system",
  "location": "Coordinates or location",
  "threatLevel": "imminent|probable|possible|unlikely",
  "metadata": {
    "threatType": "drone|aircraft|missile|ram",
    "coordinates": [lat, lon],
    "speed": 45,
    "heading": 225,
    "confidence": 92
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Alert received successfully",
  "alert_id": "uuid",
  "timestamp": "ISO timestamp"
}
```

### GET `/scenarios`
Retrieve stored alerts with optional filtering.

**Query Parameters:**
- `type`: Filter by alert type (`threat`, `system`)  
- `severity`: Filter by severity level
- `status`: Filter by status (`active`, `acknowledged`, `resolved`)
- `limit`: Number of results to return

### PUT `/scenarios/<alert_id>`
Update alert status.

**Request Body:**
```json
{
  "status": "acknowledged|resolved|escalated"
}
```

### DELETE `/scenarios`
Clear all stored alerts.

### GET `/health`
Health check endpoint.

## Integration with Your Scenario Generator

To integrate with your Python scenario generator at `C:\Users\jvins\Documents\Scenario Generator`:

1. **Install requests library:**
   ```bash
   pip install requests
   ```

2. **Add this function to your scenario generator:**
   ```python
   import requests
   
   def send_alert_to_kraken(alert_data):
       try:
           response = requests.post('http://localhost:5000/receive', json=alert_data)
           if response.status_code == 201:
               print(f"✅ Alert sent: {alert_data['title']}")
               return True
           else:
               print(f"❌ Failed: {response.status_code}")
               return False
       except Exception as e:
           print(f"❌ Error: {e}")
           return False
   
   # Example usage:
   alert = {
       "type": "threat",
       "severity": "critical",
       "title": "Hostile Drone Detected", 
       "description": "Multiple drones approaching from northeast",
       "source": "Sentinel Radar",
       "location": "Grid 345.127",
       "threatLevel": "imminent",
       "metadata": {
           "threatType": "drone",
           "confidence": 95
       }
   }
   send_alert_to_kraken(alert)
   ```

## What Happens When You Send an Alert

1. **Backend receives** the alert via `/receive` endpoint
2. **Alert is stored** in memory with unique ID and timestamp
3. **Frontend polls** backend every 2 seconds and detects new alert
4. **Kraken AI generates** contextual message about the alert
5. **Alerts portal opens** automatically to Level 3 (fullscreen)
6. **Small Kraken Eye** displays in command interface (planned feature)

## Files Structure

```
backend/
├── app.py              # Main Flask server
├── requirements.txt    # Python dependencies  
├── start.py           # Startup script
├── test_scenario.py   # Test/demo script
└── README.md          # This file
```

## Frontend Integration

The frontend automatically:
- Connects to backend on startup
- Polls for new alerts every 2 seconds
- Converts backend alerts to frontend format
- Merges backend alerts with mock data
- Triggers AI responses for critical alerts
- Opens alerts portal when new alerts arrive

## Troubleshooting

**Backend won't start:**
- Check if port 5000 is available
- Install Python dependencies: `pip install -r requirements.txt`

**Frontend can't connect:**
- Ensure backend is running on port 5000
- Check browser console for CORS errors
- Verify Vite proxy configuration

**No alerts appearing:**
- Check browser network tab for failed requests
- Verify backend `/health` endpoint returns 200
- Check console logs for polling errors

**AI not responding to alerts:**
- Check browser console for Kraken AI messages
- Verify OpenAI API key is configured (optional)
- Look for portal opening logic in console

## Next Steps

1. **Database Integration**: Replace in-memory storage with PostgreSQL/SQLite
2. **WebSocket Support**: Real-time push notifications instead of polling  
3. **Authentication**: Add secure API authentication
4. **Logging**: Enhanced logging and monitoring
5. **Docker**: Containerize the backend service 