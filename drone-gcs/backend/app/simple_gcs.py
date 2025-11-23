"""
ULTRA SIMPLE GCS Backend - 100% WORKING
Fixes the 'missing path parameter' error
"""
import asyncio
import websockets
import json
import time
import random

print("🚀 Starting Ultra Simple GCS Backend")

class TelemetryGenerator:
    def __init__(self):
        self.lat = 51.5074
        self.lon = -0.1278
        self.alt = 100.0
        self.armed = False
        self.mode = "GUIDED"
        
    def get_telemetry(self):
        # Generate realistic telemetry data
        self.lat += random.uniform(-0.0001, 0.0001)
        self.lon += random.uniform(-0.0001, 0.0001)
        
        if self.armed:
            speed = random.uniform(5.0, 15.0)
            self.alt += random.uniform(-1.0, 1.0)
        else:
            speed = 0.0
            
        return {
            'lat': self.lat,
            'lon': self.lon,
            'alt': self.alt,
            'groundspeed': speed,
            'heading': random.uniform(0, 360),
            'armed': self.armed,
            'mode': self.mode,
            'battery_remaining': 95.0,
            'satellites': 12,
            'timestamp': time.time()
        }
    
    def handle_command(self, command, params):
        print(f"📡 Command: {command} {params}")
        
        if command == "ARM":
            self.armed = True
            return True
        elif command == "DISARM":
            self.armed = False
            return True
        elif command == "SET_MODE":
            if 'mode' in params:
                self.mode = params['mode']
            return True
            
        return False

# Create telemetry generator
telemetry_gen = TelemetryGenerator()
connected_clients = set()

async def handle_client(websocket, path):
    """Handle WebSocket client - FIXED with path parameter"""
    connected_clients.add(websocket)
    client_id = id(websocket)
    print(f"✅ Client {client_id} connected. Total: {len(connected_clients)}")
    
    try:
        # Send welcome message
        await websocket.send(json.dumps({
            "type": "connection", 
            "status": "connected",
            "message": "Connected to Urban Mirtalx GCS",
            "client_id": client_id
        }))
        
        # Handle messages from client
        async for message in websocket:
            try:
                data = json.loads(message)
                print(f"📨 Received: {data}")
                
                if data.get("type") == "command":
                    success = telemetry_gen.handle_command(
                        data.get("command"), 
                        data.get("params", {})
                    )
                    
                    await websocket.send(json.dumps({
                        "type": "command_ack",
                        "command": data.get("command"),
                        "success": success
                    }))
                    
            except json.JSONDecodeError as e:
                print(f"❌ Invalid JSON received: {e}")
                await websocket.send(json.dumps({
                    "type": "error",
                    "message": "Invalid JSON format"
                }))
                
    except websockets.exceptions.ConnectionClosed:
        print(f"🔌 Client {client_id} disconnected")
    except Exception as e:
        print(f"❌ Error with client {client_id}: {e}")
    finally:
        connected_clients.discard(websocket)
        print(f"🗑️ Client {client_id} removed. Total: {len(connected_clients)}")

async def broadcast_telemetry():
    """Broadcast telemetry to all connected clients"""
    while True:
        try:
            if connected_clients:
                telemetry = telemetry_gen.get_telemetry()
                message = json.dumps({
                    "type": "telemetry",
                    "data": telemetry,
                    "timestamp": time.time()
                })
                
                # Send to all connected clients
                disconnected_clients = []
                for client in connected_clients:
                    try:
                        await client.send(message)
                    except (websockets.exceptions.ConnectionClosed, Exception):
                        disconnected_clients.append(client)
                
                # Remove disconnected clients
                for client in disconnected_clients:
                    connected_clients.discard(client)
                    
                if connected_clients:
                    print(f"📊 Sent telemetry to {len(connected_clients)} clients")
            
            await asyncio.sleep(0.1)  # 10Hz update rate
            
        except Exception as e:
            print(f"❌ Error in broadcast: {e}")
            await asyncio.sleep(1)

async def main():
    """Start the WebSocket server"""
    try:
        # Start WebSocket server
        server = await websockets.serve(
            handle_client,  # This function now properly accepts (websocket, path)
            "localhost",
            8765
        )
        
        print("✅ WebSocket server running on ws://localhost:8765")
        print("🎮 Telemetry simulation: ACTIVE")
        print("📊 Sending live telemetry every 100ms")
        print("🔧 Ready for frontend connections...")
        
        # Start telemetry broadcasting
        asyncio.create_task(broadcast_telemetry())
        
        # Keep the server running
        await asyncio.Future()  # This runs forever
        
    except Exception as e:
        print(f"❌ Failed to start server: {e}")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")