import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import LiveMap from '../Map/LiveMap';
import TelemetryCharts from '../Charts/TelemetryCharts';
import StatusPanel from '../StatusPanel/StatusPanel';
import VideoStream from '../Video/VideoStream';
import NetworkPanel from '../Network/NetworkPanel';
import './Dashboard.css';

const Dashboard = () => {
  const { telemetry, connectionStatus, networkStatus } = useTelemetry();

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>🚁 DroneNova GCS</h1>
          <div className="connection-status">
            <span className={`status-indicator ${connectionStatus}`}></span>
            MAVLink: {connectionStatus.toUpperCase()}
          </div>
        </div>
        <div className="header-right">
          <NetworkPanel />
        </div>
      </header>

      {/* Main Content */}
      <div className="dashboard-content">
        <div className="left-panel">
          <LiveMap telemetry={telemetry} />
          <TelemetryCharts telemetry={telemetry} />
        </div>
        
        <div className="right-panel">
          <StatusPanel telemetry={telemetry} connectionStatus={connectionStatus} />
          <VideoStream />
        </div>
      </div>

      {/* System Info Footer */}
      <footer className="dashboard-footer">
        <div className="system-info">
          <span>🌐 {networkStatus.connection_type || '4G/LTE'} • {networkStatus.signal_strength || 'Excellent'}</span>
          <span>🛡️ {networkStatus.vpn_type || 'ZeroTier'} • {networkStatus.vpn_status || 'Connected'}</span>
          <span>⚡ Latency: {networkStatus.latency || '45'}ms</span>
          <span>📡 MAVLink Protocol • WebRTC Streaming</span>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;