"""
WebSocket Server for real-time telemetry and command transmission
"""
import asyncio
import websockets
import json
import logging
from typing import Set
import time

logger = logging.getLogger(__name__)

class WebSocketServer:
    def __init__(self, host='localhost', port=8765):
        self.host = host
        self.port = port
        self.connected_clients: Set = set()
        self.mavlink_handler = None
        self.network_manager = None
        
    def set_mavlink_handler(self, handler):
        self.mavlink_handler = handler
        
    def set_network_manager(self, manager):
        self.network_manager = manager
        
    async def handle_client(self, websocket, path):
        """Handle WebSocket client connection"""
        client_id = id(websocket)
        self.connected_clients.add(websocket)
        logger.info(f"✅ Client connected: {client_id}. Total: {len(self.connected_clients)}")
        
        try:
            # Send initial connection data
            await websocket.send(json.dumps({
                'type': 'connection',
                'status': 'connected',
                'client_id': client_id,
                'message': 'Connected to Urban Mirtalx GCS',
                'timestamp': time.time(),
                'system_info': {
                    'version': '2.0.0',
                    'features': ['MAVLink', 'WebRTC', '4G/LTE', 'ZeroTier']
                }
            }))
            
            # Send initial network status
            if self.network_manager:
                await websocket.send(json.dumps({
                    'type': 'network_status',
                    'data': self.network_manager.get_network_status()
                }))
            
            # Handle incoming messages
            async for message in websocket:
                try:
                    data = json.loads(message)
                    await self.handle_message(data, websocket)
                except json.JSONDecodeError as e:
                    logger.error(f"❌ Invalid JSON received: {e}")
                    await websocket.send(json.dumps({
                        'type': 'error',
                        'message': 'Invalid JSON format'
                    }))
                    
        except websockets.exceptions.ConnectionClosed:
            logger.info(f"🔌 Client disconnected: {client_id}")
        except Exception as e:
            logger.error(f"❌ Client handler error: {e}")
        finally:
            self.connected_clients.remove(websocket)
            logger.info(f"🗑️ Client removed: {client_id}. Total: {len(self.connected_clients)}")
    
    async def handle_message(self, data: dict, websocket):
        """Handle incoming WebSocket messages"""
        try:
            message_type = data.get('type')
            
            if message_type == 'command' and self.mavlink_handler:
                command = data.get('command')
                params = data.get('params', {})
                
                success = self.mavlink_handler.send_command(command, params)
                
                # Send command acknowledgment
                await websocket.send(json.dumps({
                    'type': 'command_ack',
                    'command': command,
                    'success': success,
                    'timestamp': time.time()
                }))
                
            elif message_type == 'network_command':
                await self.handle_network_command(data, websocket)
                
            elif message_type == 'ping':
                await websocket.send(json.dumps({
                    'type': 'pong',
                    'timestamp': time.time()
                }))
                
            else:
                await websocket.send(json.dumps({
                    'type': 'error',
                    'message': f'Unknown message type: {message_type}'
                }))
                
        except Exception as e:
            logger.error(f"❌ Error handling message: {e}")
    
    async def handle_network_command(self, data: dict, websocket):
        """Handle network-related commands"""
        command = data.get('command')
        
        if command == 'get_network_status' and self.network_manager:
            await websocket.send(json.dumps({
                'type': 'network_status',
                'data': self.network_manager.get_network_status()
            }))
            
        elif command == 'get_zerotier_networks' and self.network_manager:
            await websocket.send(json.dumps({
                'type': 'zerotier_networks',
                'data': self.network_manager.get_zerotier_networks()
            }))
            
        elif command == 'connect_zerotier' and self.network_manager:
            network_id = data.get('network_id')
            success = self.network_manager.connect_to_zerotier(network_id)
            await websocket.send(json.dumps({
                'type': 'zerotier_connection',
                'success': success,
                'network_id': network_id
            }))
    
    async def broadcast_telemetry(self):
        """Broadcast telemetry to all connected clients"""
        while True:
            try:
                if self.mavlink_handler and self.connected_clients:
                    telemetry = self.mavlink_handler.get_telemetry()
                    
                    if telemetry:
                        message = json.dumps({
                            'type': 'telemetry',
                            'data': telemetry,
                            'timestamp': time.time(),
                            'mavlink_stats': self.mavlink_handler.get_statistics()
                        })
                        
                        # Send to all connected clients
                        closed_clients = []
                        for client in self.connected_clients:
                            try:
                                await client.send(message)
                            except (websockets.exceptions.ConnectionClosed, Exception):
                                closed_clients.append(client)
                        
                        # Remove closed clients
                        for client in closed_clients:
                            if client in self.connected_clients:
                                self.connected_clients.remove(client)
                
                # Broadcast network status periodically
                if self.network_manager and self.connected_clients and int(time.time()) % 10 == 0:
                    network_message = json.dumps({
                        'type': 'network_status',
                        'data': self.network_manager.get_network_status()
                    })
                    
                    for client in self.connected_clients.copy():
                        try:
                            await client.send(network_message)
                        except:
                            self.connected_clients.discard(client)
                
                await asyncio.sleep(0.1)  # 10Hz update rate
                
            except Exception as e:
                logger.error(f"❌ Error broadcasting telemetry: {e}")
                await asyncio.sleep(1)
    
    async def start_server(self):
        """Start WebSocket server"""
        try:
            server = await websockets.serve(
                self.handle_client,
                self.host,
                self.port,
                ping_interval=20,
                ping_timeout=60
            )
            
            logger.info(f"🚀 WebSocket server running on ws://{self.host}:{self.port}")
            return server
            
        except Exception as e:
            logger.error(f"❌ Failed to start WebSocket server: {e}")
            raise