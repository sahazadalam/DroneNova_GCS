import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useTelemetry } from '../../context/TelemetryContext';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom drone icon with animations
const createDroneIcon = (heading, armed, isConnected, battery) => {
  const batteryColor = battery > 50 ? '#10b981' : battery > 20 ? '#f59e0b' : '#ef4444';
  const pulseAnimation = armed ? 'pulse 1s infinite' : 'none';
  const connectionGlow = isConnected ? 'glow 2s infinite' : 'none';
  
  return L.divIcon({
    html: `
      <div class="drone-container" style="transform: rotate(${heading}deg);">
        <div class="drone-icon ${armed ? 'armed' : ''} ${isConnected ? 'connected' : ''}" 
             style="animation: ${pulseAnimation}, ${connectionGlow}; border-color: ${batteryColor};">
          🚁
        </div>
        ${armed ? '<div class="propeller left-propeller"></div><div class="propeller right-propeller"></div>' : ''}
        <div class="status-indicator ${armed ? 'armed' : 'disarmed'}"></div>
      </div>
      <style>
        .drone-container {
          position: relative;
          width: 48px;
          height: 48px;
          transition: transform 0.3s ease;
        }
        
        .drone-icon {
          width: 40px;
          height: 40px;
          background: var(--drone-bg, #3B82F6);
          border-radius: 50%;
          border: 3px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          transition: all 0.3s ease;
          position: relative;
          z-index: 2;
        }
        
        .drone-icon.armed {
          --drone-bg: #ef4444;
          box-shadow: 0 4px 20px rgba(239, 68, 68, 0.4);
        }
        
        .drone-icon.connected {
          box-shadow: 0 4px 20px rgba(59, 130, 246, 0.6);
        }
        
        .propeller {
          position: absolute;
          width: 12px;
          height: 12px;
          background: #6b7280;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          z-index: 1;
        }
        
        .left-propeller {
          top: 5px;
          left: -8px;
        }
        
        .right-propeller {
          top: 5px;
          right: -8px;
        }
        
        .status-indicator {
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: 2px solid white;
        }
        
        .status-indicator.armed {
          background: #ef4444;
          animation: blink 1s infinite;
        }
        
        .status-indicator.disarmed {
          background: #10b981;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 4px 20px rgba(59, 130, 246, 0.6); }
          50% { box-shadow: 0 4px 30px rgba(59, 130, 246, 0.8); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      </style>
    `,
    className: 'custom-drone-marker',
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });
};

const LiveMap = () => {
  const { telemetry, connectionStatus } = useTelemetry();
  const [showTelemetryPanel, setShowTelemetryPanel] = useState(false);
  const [mapCenter, setMapCenter] = useState([12.9716, 77.5946]);

  // Default to Bangalore coordinates
  const defaultPosition = [12.9716, 77.5946];
  const position = telemetry.lat && telemetry.lon 
    ? [telemetry.lat, telemetry.lon] 
    : defaultPosition;

  // Update map center when telemetry changes
  useEffect(() => {
    if (telemetry.lat && telemetry.lon) {
      setMapCenter([telemetry.lat, telemetry.lon]);
    }
  }, [telemetry.lat, telemetry.lon]);

  // Format telemetry data for display
  const formatTelemetryData = () => {
    const batteryLevel = telemetry.battery_remaining || 95;
    const voltage = telemetry.voltage_battery || 12.6;
    
    return {
      position: {
        lat: position[0].toFixed(6),
        lon: position[1].toFixed(6),
        alt: telemetry.alt ? `${telemetry.alt.toFixed(1)}m` : '100.0m'
      },
      movement: {
        speed: telemetry.groundspeed ? `${telemetry.groundspeed.toFixed(1)} m/s` : '0.0 m/s',
        heading: telemetry.heading ? `${Math.round(telemetry.heading)}°` : '0°',
        airspeed: telemetry.airspeed ? `${telemetry.airspeed.toFixed(1)} m/s` : 'N/A'
      },
      status: {
        mode: telemetry.mode || 'GUIDED',
        armed: telemetry.armed,
        system: telemetry.system_status || 'STANDBY'
      },
      battery: {
        level: batteryLevel,
        display: `${batteryLevel.toFixed(1)}%`,
        voltage: `${voltage.toFixed(2)}V`,
        current: telemetry.current_battery ? `${telemetry.current_battery.toFixed(1)}A` : '0.0A',
        color: batteryLevel > 50 ? '#10b981' : batteryLevel > 20 ? '#f59e0b' : '#ef4444'
      },
      gps: {
        satellites: telemetry.satellites || '15',
        fix: '3D Fix',
        hdop: telemetry.eph ? telemetry.eph.toFixed(1) : '1.5',
        vdop: telemetry.epv ? telemetry.epv.toFixed(1) : '2.0'
      },
      communication: {
        rssi: telemetry.rssi ? `${telemetry.rssi.toFixed(0)} dBm` : '-55 dBm',
        noise: telemetry.noise ? `${telemetry.noise.toFixed(0)} dBm` : '-80 dBm',
        snr: telemetry.rssi && telemetry.noise ? `${(telemetry.rssi - telemetry.noise).toFixed(0)} dB` : '25 dB'
      },
      attitude: {
        roll: telemetry.roll ? `${telemetry.roll.toFixed(1)}°` : '0.0°',
        pitch: telemetry.pitch ? `${telemetry.pitch.toFixed(1)}°` : '0.0°',
        yaw: telemetry.yaw ? `${telemetry.yaw.toFixed(1)}°` : '0.0°'
      }
    };
  };

  const telemetryData = formatTelemetryData();

  const mapStyles = {
    container: {
      background: 'rgba(30, 41, 59, 0.8)',
      borderRadius: '15px',
      padding: '20px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      marginBottom: '20px',
      position: 'relative'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '15px',
      paddingBottom: '15px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    },
    coordinates: {
      display: 'flex',
      gap: '15px',
      fontSize: '12px',
      color: '#94a3b8',
      background: 'rgba(15, 23, 42, 0.6)',
      padding: '8px 12px',
      borderRadius: '6px',
      border: '1px solid rgba(255, 255, 255, 0.05)'
    },
    map: {
      height: '400px',
      width: '100%',
      borderRadius: '10px',
      overflow: 'hidden',
      border: '2px solid rgba(255, 255, 255, 0.1)'
    },
    footer: {
      marginTop: '15px',
      padding: '12px 15px',
      background: 'rgba(15, 23, 42, 0.6)',
      borderRadius: '8px',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      fontSize: '12px',
      color: '#94a3b8',
      textAlign: 'center'
    },
    // Sidebar Telemetry Panel Styles
    telemetryPanel: {
      position: 'absolute',
      top: '20px',
      left: '20px',
      width: '320px',
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '15px',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
      zIndex: 1000,
      overflow: 'hidden',
      transform: showTelemetryPanel ? 'translateX(0)' : 'translateX(-400px)',
      transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      maxHeight: 'calc(100% - 40px)',
      overflowY: 'auto'
    },
    panelHeader: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
      color: 'white',
      padding: '20px',
      textAlign: 'center',
      position: 'relative'
    },
    closeButton: {
      position: 'absolute',
      top: '15px',
      right: '15px',
      background: 'rgba(255, 255, 255, 0.2)',
      border: 'none',
      borderRadius: '50%',
      width: '32px',
      height: '32px',
      color: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      transition: 'all 0.3s ease'
    },
    droneStatus: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      marginTop: '10px'
    },
    statusBadge: {
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: '600',
      textTransform: 'uppercase'
    },
    armedBadge: {
      background: 'rgba(239, 68, 68, 0.2)',
      color: '#ef4444',
      border: '1px solid rgba(239, 68, 68, 0.3)'
    },
    disarmedBadge: {
      background: 'rgba(16, 185, 129, 0.2)',
      color: '#10b981',
      border: '1px solid rgba(16, 185, 129, 0.3)'
    },
    section: {
      padding: '20px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    },
    sectionTitle: {
      fontSize: '12px',
      color: '#3b82f6',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '15px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    dataGrid: {
      display: 'grid',
      gap: '12px'
    },
    dataItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 0'
    },
    dataLabel: {
      color: '#94a3b8',
      fontWeight: '500',
      fontSize: '12px'
    },
    dataValue: {
      color: '#e2e8f0',
      fontWeight: '600',
      fontSize: '12px',
      textAlign: 'right'
    },
    batteryMeter: {
      width: '100%',
      height: '8px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '10px',
      overflow: 'hidden',
      marginTop: '5px'
    },
    batteryFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #ef4444, #f59e0b, #10b981)',
      borderRadius: '10px',
      transition: 'width 0.5s ease'
    },
    progressBar: {
      width: '100%',
      height: '6px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '10px',
      overflow: 'hidden',
      marginTop: '5px'
    },
    progressFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
      borderRadius: '10px'
    },
    metricCard: {
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '10px',
      padding: '12px',
      textAlign: 'center',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    metricValue: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#e2e8f0',
      marginBottom: '4px'
    },
    metricLabel: {
      fontSize: '10px',
      color: '#94a3b8',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    miniGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '10px',
      marginTop: '10px'
    }
  };

  const handleDroneClick = () => {
    setShowTelemetryPanel(true);
  };

  const handleClosePanel = () => {
    setShowTelemetryPanel(false);
  };

  // Calculate battery percentage for visual meter
  const batteryPercentage = telemetryData.battery.level;

  return (
    <div style={mapStyles.container}>
      {/* Sidebar Telemetry Panel */}
      <div style={mapStyles.telemetryPanel}>
        {/* Header */}
        <div style={mapStyles.panelHeader}>
          <button 
            style={mapStyles.closeButton}
            onClick={handleClosePanel}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            ✕
          </button>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🚁</div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Drone Telemetry</h3>
          <div style={mapStyles.droneStatus}>
            <span style={{
              ...mapStyles.statusBadge,
              ...(telemetryData.status.armed ? mapStyles.armedBadge : mapStyles.disarmedBadge)
            }}>
              {telemetryData.status.armed ? 'ARMED' : 'DISARMED'}
            </span>
            <span style={{
              ...mapStyles.statusBadge,
              background: 'rgba(59, 130, 246, 0.2)',
              color: '#3b82f6',
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}>
              {telemetryData.status.mode}
            </span>
          </div>
        </div>

        {/* Position Section */}
        <div style={mapStyles.section}>
          <div style={mapStyles.sectionTitle}>📍 Position & Altitude</div>
          <div style={mapStyles.dataGrid}>
            <div style={mapStyles.dataItem}>
              <span style={mapStyles.dataLabel}>Latitude:</span>
              <span style={mapStyles.dataValue}>{telemetryData.position.lat}</span>
            </div>
            <div style={mapStyles.dataItem}>
              <span style={mapStyles.dataLabel}>Longitude:</span>
              <span style={mapStyles.dataValue}>{telemetryData.position.lon}</span>
            </div>
            <div style={mapStyles.dataItem}>
              <span style={mapStyles.dataLabel}>Altitude:</span>
              <span style={mapStyles.dataValue}>{telemetryData.position.alt}</span>
            </div>
          </div>
        </div>

        {/* Movement Metrics */}
        <div style={mapStyles.section}>
          <div style={mapStyles.sectionTitle}>⚡ Movement</div>
          <div style={mapStyles.miniGrid}>
            <div style={mapStyles.metricCard}>
              <div style={mapStyles.metricValue}>{telemetryData.movement.speed}</div>
              <div style={mapStyles.metricLabel}>Ground Speed</div>
            </div>
            <div style={mapStyles.metricCard}>
              <div style={mapStyles.metricValue}>{telemetryData.movement.heading}</div>
              <div style={mapStyles.metricLabel}>Heading</div>
            </div>
          </div>
        </div>

        {/* Battery Section */}
        <div style={mapStyles.section}>
          <div style={mapStyles.sectionTitle}>🔋 Battery Status</div>
          <div style={mapStyles.dataGrid}>
            <div style={mapStyles.dataItem}>
              <span style={mapStyles.dataLabel}>Level:</span>
              <span style={{...mapStyles.dataValue, color: telemetryData.battery.color}}>
                {telemetryData.battery.display}
              </span>
            </div>
            <div style={mapStyles.dataItem}>
              <span style={mapStyles.dataLabel}>Voltage:</span>
              <span style={mapStyles.dataValue}>{telemetryData.battery.voltage}</span>
            </div>
            <div style={mapStyles.batteryMeter}>
              <div 
                style={{
                  ...mapStyles.batteryFill,
                  width: `${batteryPercentage}%`,
                  background: telemetryData.battery.color
                }}
              />
            </div>
          </div>
        </div>

        {/* GPS & Communication */}
        <div style={mapStyles.section}>
          <div style={mapStyles.sectionTitle}>🛰️ GPS & Communication</div>
          <div style={mapStyles.miniGrid}>
            <div style={mapStyles.metricCard}>
              <div style={mapStyles.metricValue}>{telemetryData.gps.satellites}</div>
              <div style={mapStyles.metricLabel}>Satellites</div>
            </div>
            <div style={mapStyles.metricCard}>
              <div style={mapStyles.metricValue}>{telemetryData.communication.rssi}</div>
              <div style={mapStyles.metricLabel}>Signal RSSI</div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div style={mapStyles.section}>
          <div style={mapStyles.sectionTitle}>📊 System Status</div>
          <div style={mapStyles.dataGrid}>
            <div style={mapStyles.dataItem}>
              <span style={mapStyles.dataLabel}>Flight Mode:</span>
              <span style={mapStyles.dataValue}>{telemetryData.status.mode}</span>
            </div>
            <div style={mapStyles.dataItem}>
              <span style={mapStyles.dataLabel}>System Status:</span>
              <span style={mapStyles.dataValue}>{telemetryData.status.system}</span>
            </div>
            <div style={mapStyles.dataItem}>
              <span style={mapStyles.dataLabel}>Connection:</span>
              <span style={{
                ...mapStyles.dataValue,
                color: connectionStatus === 'connected' ? '#10b981' : '#ef4444'
              }}>
                {connectionStatus.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Last Update */}
        <div style={{
          padding: '15px 20px',
          background: 'rgba(255, 255, 255, 0.05)',
          fontSize: '10px',
          color: '#64748b',
          textAlign: 'center'
        }}>
          Last Update: {telemetry.timestamp ? new Date(telemetry.timestamp * 1000).toLocaleTimeString() : new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Map Header */}
      <div style={mapStyles.header}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#e2e8f0' }}>
          🗺️ Live Drone Position
        </h3>
        <div style={mapStyles.coordinates}>
          <span>Lat: {position[0].toFixed(6)}</span>
          <span>Lon: {position[1].toFixed(6)}</span>
        </div>
      </div>
      
      {/* Map Container */}
      <MapContainer
        center={mapCenter}
        zoom={15}
        style={mapStyles.map}
        className="live-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Drone Marker */}
        <Marker 
          position={position}
          icon={createDroneIcon(
            telemetry.heading || 0, 
            telemetry.armed, 
            connectionStatus === 'connected',
            telemetry.battery_remaining || 95
          )}
          eventHandlers={{
            click: handleDroneClick
          }}
        >
          <Popup>
            <div style={{ textAlign: 'center', padding: '10px' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🚁</div>
              <div style={{ fontWeight: '600', marginBottom: '5px' }}>Drone Position</div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                Click for detailed telemetry
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
      
      {/* Map Footer */}
      <div style={mapStyles.footer}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <span>📍 Bangalore, India</span>
          <span>🛰️ {telemetryData.gps.satellites} satellites</span>
          <span>🎯 {telemetryData.gps.fix}</span>
          <span>🌐 MAVLink Protocol</span>
          <span>📶 {telemetryData.communication.rssi}</span>
        </div>
      </div>
    </div>
  );
};

export default LiveMap;