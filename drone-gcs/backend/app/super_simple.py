"""
SUPER SIMPLE GCS - Minimal working version
"""
import asyncio
import websockets
import json
import time
import random

print("🚀 Starting Super Simple GCS")

connected = set()

async def hello(websocket, path):
    """Simple handler with correct signature"""
    connected.add(websocket)
    print(f"✅ Client connected. Total: {len(connected)}")
    
    try:
        await websocket.send(json.dumps({"status": "connected"}))
        await websocket.wait_closed()
    finally:
        connected.discard(websocket)

async def send_data():
    """Send telemetry data"""
    data = {
        "lat": 51.5074,
        "lon": -0.1278,
        "alt": 100.0,
        "armed": False
    }
    
    while True:
        if connected:
            # Update data
            data["lat"] += random.uniform(-0.0001, 0.0001)
            data["lon"] += random.uniform(-0.0001, 0.0001)
            data["alt"] += random.uniform(-0.5, 0.5)
            data["heading"] = random.uniform(0, 360)
            data["timestamp"] = time.time()
            
            message = json.dumps({
                "type": "telemetry",
                "data": data
            })
            
            # Send to all clients
            for ws in connected.copy():
                try:
                    await ws.send(message)
                except:
                    connected.discard(ws)
        
        await asyncio.sleep(0.1)

async def main():
    async with websockets.serve(hello, "localhost", 8765):
        print("✅ Server running on ws://localhost:8765")
        await send_data()

asyncio.run(main())