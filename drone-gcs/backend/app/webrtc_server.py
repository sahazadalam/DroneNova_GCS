"""
WebRTC Server for ultra-low-latency video streaming
AirCast-style video transport
"""
import asyncio
import json
import logging
from aiortc import RTCPeerConnection, RTCSessionDescription, VideoStreamTrack
from aiortc.contrib.media import MediaBlackhole, MediaPlayer, MediaRecorder
from av import VideoFrame
import cv2
import numpy as np
import time

logger = logging.getLogger(__name__)

class WebRTCVideoStream(VideoStreamTrack):
    """Custom video stream track for drone camera simulation"""
    
    def __init__(self):
        super().__init__()
        self.counter = 0
        self.fps = 30
        self.width = 640
        self.height = 480
        
    async def recv(self):
        pts = time.time()
        
        # Create a synthetic video frame (simulating drone camera)
        frame = self._create_synthetic_frame()
        
        # Convert to VideoFrame
        video_frame = VideoFrame.from_ndarray(frame, format="bgr24")
        video_frame.pts = pts
        video_frame.time_base = 1 / 90000
        
        self.counter += 1
        return video_frame
    
    def _create_synthetic_frame(self):
        """Create synthetic drone camera footage"""
        # Create a black frame
        frame = np.zeros((self.height, self.width, 3), dtype=np.uint8)
        
        # Add some moving elements to simulate drone camera
        center_x = self.width // 2 + int(50 * np.sin(self.counter * 0.1))
        center_y = self.height // 2 + int(30 * np.cos(self.counter * 0.05))
        
        # Draw a moving crosshair (simulating drone camera view)
        cv2.line(frame, (center_x - 20, center_y), (center_x + 20, center_y), (0, 255, 0), 2)
        cv2.line(frame, (center_x, center_y - 20), (center_x, center_y + 20), (0, 255, 0), 2)
        cv2.circle(frame, (center_x, center_y), 10, (0, 255, 0), 2)
        
        # Add some text
        cv2.putText(frame, "DRONE CAMERA", (50, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        cv2.putText(frame, f"LAT: 12.9716 LON: 77.5946", (50, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
        cv2.putText(frame, f"ALT: 100m SPD: 10m/s", (50, 80), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
        cv2.putText(frame, f"TIME: {time.strftime('%H:%M:%S')}", (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
        
        # Add moving objects to simulate real footage
        for i in range(3):
            x = int(self.width * 0.2 * i + self.counter * 2) % self.width
            y = int(self.height * 0.3 + 50 * np.sin(self.counter * 0.05 + i))
            cv2.circle(frame, (x, y), 5, (0, 0, 255), -1)
        
        return frame

class WebRTCServer:
    def __init__(self):
        self.pcs = set()
        self.video_stream = WebRTCVideoStream()
        
    async def offer(self, offer):
        """Handle WebRTC offer from client"""
        pc = RTCPeerConnection()
        self.pcs.add(pc)
        
        # Add video track
        pc.addTrack(self.video_stream)
        
        @pc.on("connectionstatechange")
        async def on_connectionstatechange():
            logger.info(f"🎥 WebRTC connection state: {pc.connectionState}")
            if pc.connectionState == "failed":
                await pc.close()
                self.pcs.discard(pc)
        
        # Handle the offer
        await pc.setRemoteDescription(RTCSessionDescription(sdp=offer["sdp"], type=offer["type"]))
        await pc.setLocalDescription(await pc.createAnswer())
        
        return {
            "sdp": pc.localDescription.sdp,
            "type": pc.localDescription.type
        }
    
    async def cleanup(self):
        """Clean up WebRTC connections"""
        for pc in self.pcs:
            await pc.close()
        self.pcs.clear()

# For systems without camera access, we'll use synthetic video
webrtc_server = WebRTCServer()