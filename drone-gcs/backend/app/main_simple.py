import asyncio
import logging
import signal
import sys
from mavlink_handler import MAVLinkHandler
from websocket_server import WebSocketServer

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

async def main():
    """Main application"""
    logger.info("🚀 Starting Urban Mirtalx GCS Backend")
    
    # Initialize handlers
    mavlink_handler = MAVLinkHandler()
    websocket_server = WebSocketServer()
    
    # Connect to MAVLink
    mavlink_handler.connect()
    websocket_server.set_mavlink_handler(mavlink_handler)
    
    # Start WebSocket server
    server = await websocket_server.start_server()
    
    # Start telemetry broadcasting
    asyncio.create_task(websocket_server.broadcast_telemetry())
    
    logger.info("✅ All services started successfully")
    logger.info("📡 WebSocket: ws://localhost:8765")
    logger.info("🎯 MAVLink: udp:127.0.0.1:14550")
    
    # Keep running
    try:
        await asyncio.Future()  # Run forever
    except KeyboardInterrupt:
        logger.info("🛑 Shutting down...")

def signal_handler(sig, frame):
    """Handle shutdown signals"""
    logger.info("Received shutdown signal")
    sys.exit(0)

if __name__ == "__main__":
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    asyncio.run(main())