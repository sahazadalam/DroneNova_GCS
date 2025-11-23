"""
ULTRA SIMPLE WORKING SERVER - No dependencies issues
"""
import asyncio
import websockets
import json
import time
import random

print("🚀 Starting Ultra Simple GCS Server")

connected = set()

async def echo(websocket, path):
    """Simple handler with correct signature"""
    connected.add(websocket)
    print(f"✅ Client connected via path: {path}")
    
    try:
        # Send welcome
        await websocket.send(json.dumps({"status": "connected", "message": "Welcome to GCS"}))
        
        # Handle messages
        async for message in websocket:
            print(f"Received: {message}")
            # Echo back
            await websocket.send(message)
            
    except websockets.ConnectionClosed:
        print("Client disconnected")
    finally:
        connected.discard(websocket)

async def send_data():
    """Send telemetry data"""
    data = {
        "lat": 12.9716,
        "lon": 77.5946,
        "alt": 100.0,
        "armed": False,
        "mode": "GUIDED",
        "battery_remaining": 95.0,
        "satellites": 15,
        "groundspeed": 0.0,
        "heading": 0
    }
    
    while True:
        if connected:
            # Update data
            data["lat"] += random.uniform(-0.0001, 0.0001)
            data["lon"] += random.uniform(-0.0001, 0.0001)
            data["alt"] += random.uniform(-0.5, 0.5)
            data["heading"] = random.uniform(0, 360)
            data["groundspeed"] = 10.0 if data["armed"] else 0.0
            data["battery_remaining"] = max(0, data["battery_remaining"] - 0.01)
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
    """Start server"""
    async with websockets.serve(echo, "localhost", 8765):
        print("✅ Server running on ws://localhost:8765")
        print("📊 Sending telemetry every 100ms")
        await send_data()  # This runs forever

if __name__ == "__main__":
    asyncio.run(main())