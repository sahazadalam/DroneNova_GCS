"""
MINIMAL GCS Backend - Absolute simplest version
"""
import asyncio
import websockets
import json
import time
import random

print("🚀 Starting Minimal GCS Backend")

# Simple telemetry data
telemetry = {
    'lat': 51.5074,
    'lon': -0.1278, 
    'alt': 100.0,
    'armed': False,
    'mode': 'GUIDED'
}

connected_clients = set()

async def handler(websocket, path):
    """WebSocket handler with proper signature"""
    connected_clients.add(websocket)
    print(f"✅ Client connected. Total: {len(connected_clients)}")
    
    try:
        # Send welcome
        await websocket.send(json.dumps({"status": "connected"}))
        
        # Handle messages
        async for message in websocket:
            try:
                data = json.loads(message)
                print(f"Received: {data}")
            except:
                pass
                
    except websockets.exceptions.ConnectionClosed:
        print("🔌 Client disconnected")
    finally:
        connected_clients.discard(websocket)

async def send_telemetry():
    """Send telemetry to all clients"""
    while True:
        if connected_clients:
            # Update telemetry
            telemetry['lat'] += random.uniform(-0.0001, 0.0001)
            telemetry['lon'] += random.uniform(-0.0001, 0.0001)
            telemetry['alt'] += random.uniform(-0.5, 0.5)
            telemetry['heading'] = random.uniform(0, 360)
            telemetry['groundspeed'] = 10.0 if telemetry['armed'] else 0.0
            telemetry['battery_remaining'] = 95.0
            telemetry['timestamp'] = time.time()
            
            message = json.dumps({
                'type': 'telemetry',
                'data': telemetry
            })
            
            # Send to all clients
            for client in connected_clients.copy():
                try:
                    await client.send(message)
                except:
                    connected_clients.discard(client)
        
        await asyncio.sleep(0.1)

async def main():
    """Start server"""
    async with websockets.serve(handler, "localhost", 8765):
        print("✅ Server running on ws://localhost:8765")
        await send_telemetry()  # This runs forever

if __name__ == "__main__":
    asyncio.run(main())