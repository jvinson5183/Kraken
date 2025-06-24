from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timezone
import uuid
import logging
from typing import List, Dict, Any

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# In-memory storage for alerts (could be replaced with database later)
alerts_storage: List[Dict[str, Any]] = []

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'alerts_count': len(alerts_storage)
    })

@app.route('/receive', methods=['POST'])
def receive_alert():
    """
    Receive alert data from scenario generator
    Expected JSON format:
    {
        "type": "threat|system",
        "severity": "critical|high|medium|low",
        "title": "Alert title",
        "description": "Alert description", 
        "source": "Source system",
        "location": "Coordinates or location",
        "metadata": {} // Additional data
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        # Validate required fields
        required_fields = ['type', 'severity', 'title', 'description']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Create alert with standard format
        alert = {
            'id': str(uuid.uuid4()),
            'type': data['type'],  # 'threat' or 'system'
            'severity': data['severity'],  # 'critical', 'high', 'medium', 'low'
            'title': data['title'],
            'description': data['description'],
            'source': data.get('source', 'External System'),
            'location': data.get('location', ''),
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'status': 'active',  # active, acknowledged, resolved, escalated
            'metadata': data.get('metadata', {}),
            # Additional fields for frontend compatibility
            'threatLevel': data.get('threatLevel', 'unknown'),
            'affectedSystems': data.get('affectedSystems', []),
            'recommendations': data.get('recommendations', [])
        }
        
        # Add to storage
        alerts_storage.append(alert)
        
        logger.info(f"Received new alert: {alert['id']} - {alert['title']} ({alert['severity']})")
        
        return jsonify({
            'success': True,
            'message': 'Alert received successfully',
            'alert_id': alert['id'],
            'timestamp': alert['timestamp']
        }), 201
        
    except Exception as e:
        logger.error(f"Error processing alert: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/scenarios', methods=['GET'])
def get_scenarios():
    """
    Retrieve all stored alerts/scenarios
    Supports query parameters:
    - type: filter by alert type (threat|system)
    - severity: filter by severity (critical|high|medium|low)
    - status: filter by status (active|acknowledged|resolved|escalated)
    - limit: number of results to return
    """
    try:
        # Get query parameters
        alert_type = request.args.get('type')
        severity = request.args.get('severity') 
        status = request.args.get('status')
        limit = request.args.get('limit', type=int)
        
        # Filter alerts
        filtered_alerts = alerts_storage.copy()
        
        if alert_type:
            filtered_alerts = [a for a in filtered_alerts if a.get('type') == alert_type]
        
        if severity:
            filtered_alerts = [a for a in filtered_alerts if a.get('severity') == severity]
            
        if status:
            filtered_alerts = [a for a in filtered_alerts if a.get('status') == status]
        
        # Sort by timestamp (newest first)
        filtered_alerts.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
        
        # Apply limit
        if limit:
            filtered_alerts = filtered_alerts[:limit]
        
        return jsonify({
            'alerts': filtered_alerts,
            'total_count': len(alerts_storage),
            'filtered_count': len(filtered_alerts),
            'timestamp': datetime.now(timezone.utc).isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error retrieving scenarios: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/scenarios/<alert_id>', methods=['PUT'])
def update_alert_status(alert_id):
    """
    Update alert status (acknowledge, resolve, escalate)
    Expected JSON: {"status": "acknowledged|resolved|escalated"}
    """
    try:
        data = request.get_json()
        if not data or 'status' not in data:
            return jsonify({'error': 'Status field required'}), 400
        
        new_status = data['status']
        valid_statuses = ['active', 'acknowledged', 'resolved', 'escalated']
        
        if new_status not in valid_statuses:
            return jsonify({'error': f'Invalid status. Must be one of: {valid_statuses}'}), 400
        
        # Find and update alert
        for alert in alerts_storage:
            if alert['id'] == alert_id:
                old_status = alert['status']
                alert['status'] = new_status
                alert['updated_at'] = datetime.now(timezone.utc).isoformat()
                
                logger.info(f"Updated alert {alert_id} status: {old_status} -> {new_status}")
                
                return jsonify({
                    'success': True,
                    'message': f'Alert status updated to {new_status}',
                    'alert': alert
                })
        
        return jsonify({'error': 'Alert not found'}), 404
        
    except Exception as e:
        logger.error(f"Error updating alert status: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/scenarios', methods=['DELETE'])
def clear_scenarios():
    """Clear all stored alerts"""
    try:
        count = len(alerts_storage)
        alerts_storage.clear()
        
        logger.info(f"Cleared {count} alerts from storage")
        
        return jsonify({
            'success': True,
            'message': f'Cleared {count} alerts',
            'timestamp': datetime.now(timezone.utc).isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error clearing scenarios: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    logger.info("Starting Kraken Alert Backend Server on port 5000")
    app.run(debug=True, host='0.0.0.0', port=5000) 