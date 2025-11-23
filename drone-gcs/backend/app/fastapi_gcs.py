"""
100% WORKING GCS Backend using FastAPI WebSockets
No more 'path parameter' errors!
"""
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
import time
import random
import uvicorn

print("🚀 Starting FastAPI GCS Backend")

app = FastAPI(title="Urban Mirtalx GCS")

# Allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store connected clients
connected_clients = set()

# Telemetry data
telemetry_data = {
    "lat": 51.5074,
    "lon": -0.1278,
    "alt": 100.0,
    "armed": False,
    "mode": "GUIDED",
    "battery_remaining": 95.0,
    "satellites": 12,
    "groundspeed": 0.0,
    "heading": 0.0
}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint - No path parameter issues!"""
    await websocket.accept()
    connected_clients.add(websocket)
    client_id = id(websocket)
    print(f"✅ Client {client_id} connected. Total: {len(connected_clients)}")
    
    try:
        # Send connection confirmation
        await websocket.send_json({
            "type": "connection",
            "status": "connected",
            "message": "Welcome to Urban Mirtalx GCS",
            "client_id": client_id
        })
        
        # Handle messages
        while True:
            try:
                data = await websocket.receive_text()
                message = json.loads(data)
                print(f"📨 Received: {message}")
                
                # Handle commands
                if message.get("type") == "command":
                    command = message.get("command")
                    success = False
                    
                    if command == "ARM":
                        telemetry_data["armed"] = True
                        success = True
                    elif command == "DISARM":
                        telemetry_data["armed"] = False
                        success = True
                    elif command == "SET_MODE":
                        if "mode" in message.get("params", {}):
                            telemetry_data["mode"] = message["params"]["mode"]
                        success = True
                    
                    # Send acknowledgment
                    await websocket.send_json({
                        "type": "command_ack",
                        "command": command,
                        "success": success
                    })
                    
            except json.JSONDecodeError:
                print("❌ Invalid JSON received")
            except Exception as e:
                print(f"❌ Error processing message: {e}")
                break
                
    except WebSocketDisconnect:
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
                # Update telemetry data
                telemetry_data["lat"] += random.uniform(-0.0001, 0.0001)
                telemetry_data["lon"] += random.uniform(-0.0001, 0.0001)
                telemetry_data["alt"] += random.uniform(-0.5, 0.5)
                telemetry_data["heading"] = random.uniform(0, 360)
                telemetry_data["groundspeed"] = 10.0 if telemetry_data["armed"] else 0.0
                telemetry_data["timestamp"] = time.time()
                
                # Create message
                message = {
                    "type": "telemetry",
                    "data": telemetry_data.copy()
                }
                
                # Send to all connected clients
                disconnected_clients = []
                for client in connected_clients:
                    try:
                        await client.send_json(message)
                    except Exception:
                        disconnected_clients.append(client)
                
                # Remove disconnected clients
                for client in disconnected_clients:
                    connected_clients.discard(client)
                
                # Log periodically
                if len(connected_clients) > 0 and int(time.time()) % 5 == 0:
                    print(f"📊 Telemetry sent to {len(connected_clients)} clients")
            
            # Wait before next broadcast
            await asyncio.sleep(0.1)  # 10Hz
            
        except Exception as e:
            print(f"❌ Error in telemetry broadcast: {e}")
            await asyncio.sleep(1)

@app.on_event("startup")
async def startup_event():
    """Start telemetry broadcasting when app starts"""
    asyncio.create_task(broadcast_telemetry())
    print("✅ Telemetry broadcasting started")

@app.get("/")
async def root():
    return {"message": "Urban Mirtalx GCS Backend", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy", "clients_connected": len(connected_clients)}

if __name__ == "__main__":
    print("🔧 Starting FastAPI server...")
    uvicorn.run(
        "fastapi_gcs:app",
        host="localhost",
        port=8000,
        reload=True,
        log_level="info"
    )