
# DroneNova GCS - Cloud-Based Ground Control Station

A professional, cloud-based Ground Control Station implementing MAVLink protocol for real-time drone telemetry monitoring and fleet management.

🚀 Live Demo
🌐 DroneNova-GCS-Working-Full-Project: https://dronenove-gcs.netlify.app/

🌐 Web Dashboard (Frontend):
https://dronenove-gcs.netlify.app/

🛠️ API Documentation (Backend):
https://dronenova-gcs.onrender.com/docs

🔗 Backend Root URL:
https://dronenova-gcs.onrender.com


## 📋 Project Overview

DroneNova GCS is a complete ground control station solution that receives, processes, and visualizes UAV telemetry data in real-time using MAVLink protocol. The system features advanced networking capabilities for remote operations.

## ✨ Features Implemented

### Core Functionality
- ✅ **MAVLink Protocol Integration** - Complete telemetry data exchange
- ✅ **Real-time Web Dashboard** - Live charts, maps, and status panels
- ✅ **Telemetry Visualization** - Altitude, speed, GPS, battery data
- ✅ **Mission Planning** - Waypoint-based mission creation

### Advanced Networking
- ✅ **4G/LTE & WiFi Connectivity** - Mobile network integration
- ✅ **ZeroTier VPN Integration** - NAT/firewall traversal
- ✅ **WebRTC Streaming** - Low-latency video & data transport
- ✅ **BLAST-inspired Protocol** - Optimized data transmission

### Technical Implementation
- ✅ **WebSocket Communication** - Real-time frontend-backend connection
- ✅ **RESTful APIs** - Structured data endpoints
- ✅ **Cloud Deployment** - Scalable infrastructure
- ✅ **Cross-platform Compatibility** - Web-based access

## 🛠 Technology Stack

### Backend Services
- **Node.js** - Runtime environment
- **MAVLink.js** - Protocol implementation
- **WebSocket** - Real-time communication
- **ZeroTier** - Virtual networking
- **Express.js** - API framework

### Frontend Dashboard
- **React.js** - User interface
- **WebRTC** - Video streaming
- **Mapbox GL** - Interactive maps
- **Chart.js** - Data visualization
- **WebSocket Client** - Real-time updates

### Networking & Infrastructure
- **4G/LTE Simulation** - Mobile network connectivity
- **ZeroTier VPN** - Secure tunnel establishment
- **STUN/TURN Servers** - WebRTC connectivity
- **Cloud Deployment** - AWS/Azure hosting

## 📊 System Architecture
[UAV/SIMULATOR] → [MAVLink Protocol] → [4G/LTE Network] → [ZeroTier VPN]
↓
[Web Dashboard] ← [WebSocket] ← [Node.js Backend] ← [Internet]
↓
[Real-time Display] → [Charts] → [Maps] → [Video Stream]

text

### Data Flow Description
1. **Telemetry Source**: UAV or simulator generates MAVLink messages
2. **Network Transport**: 4G/LTE with ZeroTier VPN for secure transmission
3. **Backend Processing**: Node.js server parses MAVLink and manages WebSocket connections
4. **Frontend Visualization**: React dashboard displays real-time data with maps and charts
5. **Video Streaming**: WebRTC establishes low-latency video feeds

## 🚀 Installation & Setup

### Prerequisites
- Node.js 16+ 
- Python 3.8+ (for MAVLink tools)
- ZeroTier account
- Modern web browser

### Quick Start
```bash
# Clone repository
git clone https://github.com/sahazadalam/DroneNova_GCS.git
cd DroneNova_GCS

# Backend setup
cd backend
npm install
cp .env.example .env
# Configure MAVLink port and ZeroTier network ID
npm start

# Frontend setup (new terminal)
cd ../frontend
npm install
npm run dev
Environment Configuration
env
# Backend .env file
MAVLINK_PORT=14550
ZEROTIER_NETWORK_ID=your_network_id
WEBRTC_STUN_SERVER=stun:stun.l.google.com:19302
WS_PORT=8080
API_PORT=3000
📡 MAVLink Implementation
Supported Messages
HEARTBEAT - Vehicle status and connection monitoring

GPS_RAW_INT - Position, altitude, and satellite data

SYS_STATUS - Battery level and system health

ATTITUDE - Orientation, pitch, roll, yaw

VFR_HUD - Airspeed, groundspeed, heading

BATTERY_STATUS - Battery consumption and health

Message Processing
javascript
// MAVLink message handler
mavlink.on('message', (message) => {
  switch (message.type) {
    case 'GPS_RAW_INT':
      processGPSData(message);
      break;
    case 'SYS_STATUS':
      processBatteryData(message);
      break;
    // ... other message types
  }
});
🌐 Networking Features
ZeroTier VPN Integration
bash
# Join ZeroTier network
zerotier-cli join your_network_id

# Configure network routing
iptables -t nat -A POSTROUTING -o zt0 -j MASQUERADE
WebRTC Video Streaming
javascript
const peerConnection = new RTCPeerConnection({
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'turn:turn.server.com', username: 'user', credential: 'pass' }
  ]
});
🎯 Usage Guide
Starting the System
Start Backend Server

bash
cd backend
npm start
Launch Frontend Dashboard

bash
cd frontend
npm run dev
Connect Telemetry Source

Use MAVLink-compatible UAV

Or start MAVLink simulator

bash
python tools/mavlink_simulator.py --type quadcopter
Access Dashboard

Open http://localhost:3000

View real-time telemetry data

Monitor video streams (if available)

Dashboard Features
Real-time Map: Live UAV positioning with flight path

Telemetry Panels: Battery, GPS, attitude data displays

Chart Visualizations: Historical data trends and analysis

Mission Control: Waypoint planning and mission execution

Network Status: Connection quality and latency monitoring


## 🏗️ Project Structure
DroneNova_GCS/
├── backend/
│ ├── app/
│ │ ├── init.py
│ │ ├── auth.py # Authentication handlers
│ │ ├── database.py # Database configurations
│ │ ├── fastapi_gcs.py # FastAPI GCS implementation
│ │ ├── mavlink_handler.py # MAVLink protocol processing
│ │ ├── network_manager.py # Network connectivity management
│ │ ├── websocket_server.py # Real-time WebSocket server
│ │ ├── webrtc_server.py # WebRTC streaming server
│ │ └── working_gcs.py # Production GCS implementation
│ ├── venv/ # Python virtual environment
│ ├── Dockerfile # Backend containerization
│ ├── requirements.txt # Python dependencies
│ ├── start.sh # Startup script
│ └── gcs.log # Application logs
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── Auth/ # Authentication components
│ │ │ ├── Dashboard/ # Main dashboard layout
│ │ │ ├── Drones/ # Drone management components
│ │ │ ├── Map/ # Map visualization (DroneMap.js)
│ │ │ ├── Charts/ # Data visualization (TelemetryCharts.js)
│ │ │ ├── StatusPanel/ # Status displays (StatusPanel.js)
│ │ │ ├── Controls/ # Control interfaces
│ │ │ ├── Network/ # Network status components
│ │ │ └── Video/ # Video streaming components
│ │ ├── context/ # React context providers
│ │ ├── styles/ # CSS and styling
│ │ ├── App.js # Main application component
│ │ ├── App.css # Application styles
│ │ └── index.js # Application entry point
│ ├── public/ # Static assets
│ ├── node_modules/ # Frontend dependencies
│ ├── Dockerfile # Frontend containerization
│ ├── package.json # Node.js dependencies
│ ├── package-lock.json # Dependency lock file
│ └── tailwind.config.js # Tailwind CSS configuration
├── docker-compose.yml # Multi-container orchestration
└── README.md # Project documentation

🧪 Testing & Validation
Telemetry Simulation
bash
# Start MAVLink simulator
python tools/mavlink_simulator.py --type quadcopter --duration 3600

# Test specific message types
python tools/test_mavlink.py --message GPS_RAW_INT
Network Testing
bash
# Test ZeroTier connectivity
zerotier-cli listnetworks
zerotier-cli info

# Test WebRTC connection
npm run test:webrtc

# Test WebSocket communication
npm run test:websocket
🎥 Demo Features Showcase
The live demo demonstrates:

Real-time Telemetry
Live GPS positioning on interactive maps

Real-time altitude and speed charts

Battery status monitoring

System health indicators

Network Performance
ZeroTier VPN connection establishment

WebRTC video streaming quality

4G/LTE network simulation

Latency and bandwidth monitoring

User Interface
Responsive dashboard design

Multi-drone fleet management

Mission planning interface

Historical data analysis

🤝 Contributing
We welcome contributions! Please see our Contributing Guidelines for details.

Fork the repository

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
MAVLink Development Team - Protocol specification and documentation

ZeroTier - Open-source networking solution

WebRTC Team - Real-time communication protocols

UAVcast-Pro & AirCast - Inspiration for networking approaches

📞 Contact & Support
Developer: Sahazad Alam Ansiri

Email: sahazadalam02@gmail.com

LinkedIn: https://www.linkedin.com/in/sahazad-alam-aa9a49283?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app

