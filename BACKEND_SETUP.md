# ✅ Flask Backend Integration Complete

## What Was Created

### 🗂️ Backend Folder Structure
```
backend/
├── app.py              # Flask server with /receive and /scenarios endpoints
├── requirements.txt    # Flask dependencies  
├── start.py           # Auto-installing startup script
├── test_scenario.py   # Test scenario generator
└── README.md          # Detailed documentation
```

### 🔧 Frontend Integration
- **`components/hooks/useAlertsBackend.ts`** - Custom hook for backend polling
- **`components/JarvisInterface.tsx`** - Updated to handle new alerts and trigger AI responses
- **`components/portals/AlertsPortal.tsx`** - Modified to display backend alerts
- **`vite.config.ts`** - Added proxy configuration for API routes

## 🚀 How to Use

### 1. Start Backend Server
```bash
cd backend
python start.py
```
Server runs on `http://localhost:5000`

### 2. Start Frontend (separate terminal)
```bash
npm run dev  
```
Frontend runs on `http://localhost:5173`

### 3. Test Integration
```bash
cd backend
python test_scenario.py
```
Choose option 1 to send sample alerts.

## 🎯 What Happens When You Send an Alert

1. **Scenario generator** → POST to `/receive` endpoint
2. **Flask backend** stores alert with unique ID
3. **Frontend polls** backend every 2 seconds  
4. **New alert detected** → triggers callback
5. **Kraken AI** generates contextual message
6. **Alerts portal** automatically opens to Level 3
7. **Alert displays** in the interface with backend data

## 📡 API Endpoints

- **POST `/receive`** - Receive alerts from your scenario generator
- **GET `/scenarios`** - Retrieve stored alerts (with filtering)
- **PUT `/scenarios/<id>`** - Update alert status  
- **DELETE `/scenarios`** - Clear all alerts
- **GET `/health`** - Health check

## 🔗 Integration with Your Scenario Generator

Add this to your Python scenario generator at `C:\Users\jvins\Documents\Scenario Generator`:

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

# Example alert
alert = {
    "type": "threat",
    "severity": "critical", 
    "title": "Hostile Drone Swarm Detected",
    "description": "Multiple drones approaching from eastern sector",
    "source": "Sentinel Radar",
    "location": "Grid 345.127",
    "threatLevel": "imminent",
    "metadata": {
        "threatType": "drone",
        "confidence": 95,
        "coordinates": [32.0853, 34.7818]
    }
}

send_alert_to_kraken(alert)
```

## ✨ Key Features

- **Real-time polling** - Frontend checks for new alerts every 2 seconds
- **Automatic portal opening** - Alerts portal opens to Level 3 on new alerts
- **AI integration** - Kraken AI generates contextual messages
- **Alert conversion** - Backend alerts seamlessly integrate with existing UI
- **Status management** - Acknowledge, resolve, escalate alerts
- **Mock data merging** - Backend alerts appear alongside existing mock alerts

## 🧪 Testing

The system is ready to test! When you send an alert:

1. You should see it appear in the Kraken alerts portal
2. The portal should automatically open to fullscreen
3. Console should show Kraken AI response messages
4. Backend logs should confirm alert reception

All components are now integrated and ready for your scenario generator! 