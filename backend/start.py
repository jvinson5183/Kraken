#!/usr/bin/env python3
"""
Kraken Alert Backend Startup Script
Runs the Flask server on port 5000
"""

import os
import sys
import subprocess

def install_requirements():
    """Install required packages if not available"""
    try:
        import flask
        import flask_cors
        print("✅ Required packages are installed")
    except ImportError:
        print("📦 Installing required packages...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Packages installed successfully")

def start_server():
    """Start the Flask server"""
    print("🚀 Starting Kraken Alert Backend Server...")
    print("🌐 Server will be available at: http://localhost:5000")
    print("📋 Endpoints:")
    print("   - POST /receive     - Receive new alerts")
    print("   - GET  /scenarios   - Retrieve stored alerts")
    print("   - GET  /health      - Health check")
    print("   - PUT  /scenarios/<id> - Update alert status")
    print("   - DELETE /scenarios - Clear all alerts")
    print("="*50)
    
    # Import and run the Flask app
    from app import app
    app.run(debug=True, host='0.0.0.0', port=5000)

if __name__ == "__main__":
    try:
        install_requirements()
        start_server()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1) 