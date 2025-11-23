import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import './NetworkPanel.css';

const NetworkPanel = () => {
  const { networkStatus, connectToZeroTier } = useTelemetry();

  const getSignalIcon = (strength) => {
    switch(strength) {
      case 'excellent': return '📶●●●●●';
      case 'good': return '📶●●●●○';
      case 'fair': return '📶●●●○○';
      case 'poor': return '📶●●○○○';
      default: return '📶●●●●●';
    }
  };

  const getVPNIcon = (status) => {
    return status === 'connected' ? '🛡️' : '🛡️⚪';
  };

  return (
    <div className="network-panel">
      <div className="network-item">
        <span className="network-icon">📡</span>
        <span className="network-info">
          {networkStatus.connection_type || '4G/LTE'} {getSignalIcon(networkStatus.signal_strength)}
        </span>
      </div>
      <div className="network-item">
        <span className="network-icon">{getVPNIcon(networkStatus.vpn_status)}</span>
        <span className="network-info">{networkStatus.vpn_type || 'ZeroTier'}</span>
      </div>
      <div className="network-item">
        <span className="network-icon">⚡</span>
        <span className="network-info">{networkStatus.latency || '45'}ms</span>
      </div>
      <button 
        className="network-refresh"
        onClick={() => connectToZeroTier('1c33c1ced0b12345')}
      >
        🔄
      </button>
    </div>
  );
};

export default NetworkPanel;