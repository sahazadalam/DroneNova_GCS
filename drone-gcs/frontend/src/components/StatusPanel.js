import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import './StatusPanel.css';

const StatusPanel = () => {
  const { telemetry, connectionStatus, sendCommand } = useTelemetry();

  // Default values for when no telemetry is received
  const defaultTelemetry = {
    mode: 'GUIDED',
    armed: false,
    satellites: 15,
    battery_remaining: 95.0,
    alt: 100.0,
    groundspeed: 0.0,
    heading: 0,
    voltage_battery: 12.6
  };

  // Use actual telemetry or defaults
  const data = { ...defaultTelemetry, ...telemetry };

  const statusItems = [
    {
      label: 'Flight Mode',
      value: data.mode,
      icon: '🚀',
      color: '#3b82f6'
    },
    {
      label: 'Armed',
      value: data.armed ? 'ARMED' : 'DISARMED',
      icon: data.armed ? '🔴' : '🟢',
      color: data.armed ? '#ef4444' : '#10b981'
    },
    {
      label: 'GPS Satellites',
      value: data.satellites.toString(),
      icon: '🛰️',
      color: '#8b5cf6'
    },
    {
      label: 'Battery',
      value: `${data.battery_remaining.toFixed(1)}%`,
      icon: '🔋',
      color: data.battery_remaining > 30 ? '#f59e0b' : '#ef4444'
    },
    {
      label: 'Altitude',
      value: `${data.alt.toFixed(1)}m`,
      icon: '📏',
      color: '#06b6d4'
    },
    {
      label: 'Speed',
      value: `${data.groundspeed.toFixed(1)} m/s`,
      icon: '⚡',
      color: '#10b981'
    },
    {
      label: 'Heading',
      value: `${Math.round(data.heading)}°`,
      icon: '🧭',
      color: '#6366f1'
    },
    {
      label: 'Voltage',
      value: `${data.voltage_battery.toFixed(1)}V`,
      icon: '⚡',
      color: '#f59e0b'
    }
  ];

  const handleArmCommand = () => {
    const command = data.armed ? 'DISARM' : 'ARM';
    sendCommand(command);
  };

  const handleRTLCommand = () => {
    sendCommand('SET_MODE', { mode: 'RTL' });
  };

  return (
    <div className="status-panel">
      <div className="panel-header">
        <h3>🚀 Drone Status</h3>
        <div className={`connection-badge ${connectionStatus}`}>
          {connectionStatus.toUpperCase()}
        </div>
      </div>

      <div className="status-grid">
        {statusItems.map((item, index) => (
          <div key={index} className="status-item">
            <div className="status-icon" style={{ color: item.color }}>
              {item.icon}
            </div>
            <div className="status-info">
              <div className="status-label">{item.label}</div>
              <div className="status-value" style={{ color: item.color }}>
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* System Info */}
      <div className="system-info">
        <div className="info-row">
          <span>Last Update:</span>
          <span>{telemetry.timestamp ? new Date(telemetry.timestamp * 1000).toLocaleTimeString() : new Date().toLocaleTimeString()}</span>
        </div>
        <div className="info-row">
          <span>Location:</span>
          <span>Bangalore, India</span>
        </div>
        <div className="info-row">
          <span>GPS Fix:</span>
          <span>3D ({data.satellites} satellites)</span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="control-buttons">
        <button 
          className={`btn-control ${data.armed ? 'btn-disarm' : 'btn-arm'}`}
          onClick={handleArmCommand}
        >
          {data.armed ? '🔴 DISARM' : '🟢 ARM'}
        </button>
        <button className="btn-control btn-rtl" onClick={handleRTLCommand}>
          🏠 RTL
        </button>
      </div>
    </div>
  );
};

export default StatusPanel;