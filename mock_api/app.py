from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta
import random
import math

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
DEVICES = ["device_001", "device_002", "device_003"]

def generate_readings(device_id, start_time, end_time):
    readings = []
    current = start_time
    base_power = {"device_001": 1500, "device_002": 2000, "device_003": 1200}
    
    while current <= end_time:
        hour = current.hour
        time_factor = 0.3 + 0.7 * (1 + math.sin((hour - 6) * math.pi / 12)) / 2
        noise = random.gauss(1.0, 0.15)
        power_w = base_power[device_id] * time_factor * noise
        
        if random.random() < 0.05:
            power_w *= random.uniform(2.5, 4.0)
        
        energy_wh = power_w * (5 / 60)
        
        readings.append({
            "device_id": device_id,
            "timestamp": current.isoformat() + "Z",
            "power_w": round(power_w, 2),
            "energy_wh": round(energy_wh, 2),
            "voltage": round(random.gauss(120, 2), 1),
            "temp_c": round(random.gauss(22, 3), 1),
            "occupancy": hour >= 7 and hour <= 23,
            "source": "mock_api"
        })
        
        current += timedelta(minutes=5)
    
    return readings

@app.route('/devices', methods=['GET'])
def get_devices():
    return jsonify({
        "devices": [
            {"device_id": d, "name": f"Smart Meter {d.split('_')[1]}", "location": "Home"} 
            for d in DEVICES
        ]
    })

@app.route('/readings', methods=['GET'])
def get_readings():
    device_id = request.args.get('device_id')
    start = request.args.get('start')
    end = request.args.get('end')
    
    if not device_id or device_id not in DEVICES:
        return jsonify({"error": "Invalid device_id"}), 400
    
    if start:
        start_time = datetime.fromisoformat(start.replace('Z', ''))
    else:
        start_time = datetime.utcnow() - timedelta(days=1)
    
    if end:
        end_time = datetime.fromisoformat(end.replace('Z', ''))
    else:
        end_time = datetime.utcnow()
    
    readings = generate_readings(device_id, start_time, end_time)
    
    return jsonify({
        "device_id": device_id,
        "start": start_time.isoformat() + "Z",
        "end": end_time.isoformat() + "Z",
        "count": len(readings),
        "data": readings
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "timestamp": datetime.utcnow().isoformat()})

@app.route('/api/energy', methods=['GET'])
def get_energy_dashboard():
    """Dashboard endpoint for real-time energy data"""
    now = datetime.utcnow()
    
    # Generate 24 hours of historical data
    history = []
    for i in range(24):
        hour_time = now - timedelta(hours=23-i)
        hour = hour_time.hour
        
        # Usage pattern: higher during day, lower at night
        time_factor = 0.3 + 0.7 * (1 + math.sin((hour - 6) * math.pi / 12)) / 2
        usage = 30 + 40 * time_factor + random.gauss(0, 5)
        
        # Solar generation: higher during sunny hours
        if 6 <= hour <= 18:
            solar_factor = math.sin((hour - 6) * math.pi / 12)
            solar = 10 + 30 * solar_factor + random.gauss(0, 3)
        else:
            solar = 0
        
        history.append({
            "time": f"{hour}:00",
            "usage": round(max(0, usage), 1),
            "solar": round(max(0, solar), 1)
        })
    
    # Current stats
    current_usage = round(35 + random.gauss(0, 5), 1)
    daily_total = round(sum(h["usage"] for h in history) / 24 * 24, 1)
    cost_today = round(daily_total * 0.03, 2)  # $0.03 per kWh
    efficiency = round(85 + random.gauss(0, 5), 0)
    
    return jsonify({
        "history": history,
        "stats": {
            "current_usage": current_usage,
            "daily_total": daily_total,
            "cost_today": cost_today,
            "efficiency": min(100, max(0, efficiency))
        }
    })

if __name__ == '__main__':
    # Disable debug mode for stable background operation
    app.run(host='0.0.0.0', port=5000, debug=False)
