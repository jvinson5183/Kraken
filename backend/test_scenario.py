#!/usr/bin/env python3
"""
Test Scenario Generator for Kraken Alert Backend
Sends sample alerts to test the system integration
"""

import requests
import json
import time
import random
from datetime import datetime, timezone

BACKEND_URL = "http://localhost:5000"

# Sample alert templates
THREAT_ALERTS = [
    {
        "type": "threat",
        "severity": "critical",
        "title": "Hostile Drone Swarm Detected",
        "description": "Multiple small drones approaching from eastern sector at high speed",
        "source": "Sentinel Radar Array",
        "location": "Grid 345.127",
        "threatLevel": "imminent",
        "metadata": {
            "threatType": "drone",
            "coordinates": [32.0853, 34.7818],
            "speed": 45,
            "heading": 225,
            "altitude": 150,
            "confidence": 92,
            "countermeasures": ["C-UAS Engagement", "Electronic Jamming"]
        }
    },
    {
        "type": "threat", 
        "severity": "high",
        "title": "Unidentified Aircraft in Restricted Airspace",
        "description": "Unknown aircraft contact detected violating restricted zone",
        "source": "Air Defense Radar",
        "location": "Zone Alpha-7",
        "threatLevel": "probable",
        "metadata": {
            "threatType": "aircraft",
            "coordinates": [32.1200, 34.8500],
            "speed": 350,
            "heading": 90,
            "altitude": 8000,
            "confidence": 78,
            "countermeasures": ["Intercept Mission", "IFF Interrogation"]
        }
    },
    {
        "type": "threat",
        "severity": "critical", 
        "title": "Incoming Ballistic Missile",
        "description": "Long-range ballistic missile detected on intercept trajectory",
        "source": "TPY-2 Radar",
        "location": "Grid 234.889",
        "threatLevel": "imminent",
        "metadata": {
            "threatType": "missile",
            "coordinates": [32.4000, 35.2000],
            "speed": 1200,
            "heading": 180,
            "altitude": 25000,
            "confidence": 98,
            "countermeasures": ["Iron Dome", "David's Sling", "Arrow System"]
        }
    }
]

SYSTEM_ALERTS = [
    {
        "type": "system",
        "severity": "critical",
        "title": "Primary Radar Offline",
        "description": "Sentinel radar system has lost power and is not responding to commands",
        "source": "Sentinel Radar Array",
        "location": "Site Alpha",
        "metadata": {
            "systemType": "sensor", 
            "component": "Power Supply Unit",
            "estimatedRepair": (datetime.now(timezone.utc).timestamp() + 1800) * 1000  # 30 min from now
        }
    },
    {
        "type": "system",
        "severity": "high",
        "title": "Network Link Degraded",
        "description": "Intermittent connectivity issues with tactical data network",
        "source": "Link 16 Terminal",
        "location": "Command Center",
        "metadata": {
            "systemType": "network",
            "component": "Network Interface"
        }
    },
    {
        "type": "system",
        "severity": "medium",
        "title": "Low Interceptor Count",
        "description": "Iron Dome battery has less than 25% interceptors remaining",
        "source": "Iron Dome Battery Alpha",
        "location": "Battery Position 1",
        "metadata": {
            "systemType": "effector",
            "component": "Interceptor Magazine"
        }
    }
]

def send_alert(alert_data):
    """Send a single alert to the backend"""
    try:
        response = requests.post(f"{BACKEND_URL}/receive", json=alert_data)
        if response.status_code == 201:
            result = response.json()
            print(f"✅ Alert sent successfully: {alert_data['title']}")
            print(f"   Alert ID: {result['alert_id']}")
            return True
        else:
            print(f"❌ Failed to send alert: {response.status_code} - {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Connection error: {e}")
        return False

def test_backend_connection():
    """Test if the backend is running"""
    try:
        response = requests.get(f"{BACKEND_URL}/health")
        if response.status_code == 200:
            print("✅ Backend connection successful")
            data = response.json()
            print(f"   Status: {data['status']}")
            print(f"   Current alerts: {data['alerts_count']}")
            return True
        else:
            print(f"❌ Backend health check failed: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Cannot connect to backend: {e}")
        print("   Make sure the Flask server is running on port 5000")
        return False

def send_sample_alerts():
    """Send a few sample alerts"""
    print("🎯 Sending sample alerts...")
    
    # Send one critical threat alert
    critical_threat = random.choice([a for a in THREAT_ALERTS if a['severity'] == 'critical'])
    if send_alert(critical_threat):
        print("   Critical threat alert sent - should trigger AI response and open alerts portal")
    
    time.sleep(2)
    
    # Send a system alert
    system_alert = random.choice(SYSTEM_ALERTS)
    if send_alert(system_alert):
        print("   System alert sent")
    
    time.sleep(2)
    
    # Send another threat alert
    threat_alert = random.choice([a for a in THREAT_ALERTS if a['severity'] != 'critical'])
    if send_alert(threat_alert):
        print("   Additional threat alert sent")

def interactive_mode():
    """Interactive mode for sending custom alerts"""
    print("\n🎮 Interactive Mode - Enter alerts manually")
    print("Commands: threat, system, quit")
    
    while True:
        command = input("\nEnter command (threat/system/quit): ").strip().lower()
        
        if command == 'quit':
            break
        elif command == 'threat':
            alert = random.choice(THREAT_ALERTS).copy()
            alert['title'] = f"[TEST] {alert['title']}"
            send_alert(alert)
        elif command == 'system':
            alert = random.choice(SYSTEM_ALERTS).copy()
            alert['title'] = f"[TEST] {alert['title']}"
            send_alert(alert)
        else:
            print("Invalid command. Use: threat, system, or quit")

def main():
    print("🚀 Kraken Alert Backend Test Scenario Generator")
    print("=" * 50)
    
    # Test connection
    if not test_backend_connection():
        print("\n💡 To start the backend server:")
        print("   cd backend")
        print("   python start.py")
        return
    
    print("\nSelect mode:")
    print("1. Send sample alerts automatically")
    print("2. Interactive mode")
    print("3. Continuous stress test")
    
    choice = input("\nEnter choice (1-3): ").strip()
    
    if choice == '1':
        send_sample_alerts()
        print("\n✅ Sample alerts sent! Check the Kraken interface.")
    elif choice == '2':
        interactive_mode()
    elif choice == '3':
        print("🔄 Starting continuous stress test (Ctrl+C to stop)...")
        try:
            while True:
                alert = random.choice(THREAT_ALERTS + SYSTEM_ALERTS).copy()
                alert['title'] = f"[AUTO] {alert['title']}"
                alert['severity'] = random.choice(['critical', 'high', 'medium', 'low'])
                send_alert(alert)
                time.sleep(random.uniform(3, 10))  # Random delay between alerts
        except KeyboardInterrupt:
            print("\n🛑 Stress test stopped")
    else:
        print("Invalid choice")

if __name__ == "__main__":
    main() 