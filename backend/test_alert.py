import requests
from datetime import datetime

alert_data = {
    'id': 'test-' + datetime.now().strftime('%H%M%S'),
    'type': 'missile',
    'severity': 'critical',
    'title': 'CONSOLE DEBUG TEST',
    'description': 'This alert is to test console debug logs',
    'location': 'Debug Grid 123.456',
    'source': 'Console Test',
    'status': 'active',
    'threatLevel': 'imminent',
    'timestamp': datetime.now().isoformat() + 'Z'
}

response = requests.post('http://localhost:5000/receive', json=alert_data)
print(f'Alert sent: {response.status_code} - {alert_data["title"]}') 