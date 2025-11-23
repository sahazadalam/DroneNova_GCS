import React from 'react';
import './NetworkStatus.css';

const NetworkStatus = () => {
  const networkStatus = {
    type: '4G/LTE',
    signal: 'excellent',
    vpn: 'ZeroTier',
    status: 'connected',
    latency: '45ms'
  };

  const getSignalBars = (signal) => {
    switch(signal) {
      case 'excellent': return '●●●●●';
      case 'good': return '●●●●○';
      case 'fair': return '●●●○○';
      case 'poor': return '●●○○○';
      default: return '●●●●●';
    }
  };

  return (
    <div className="network-status">
      <div className="network-item">
        <span className="network-icon">📡</span>
        <span className="network-info">
          {networkStatus.type} {getSignalBars(networkStatus.signal)}
        </span>
      </div>
      <div className="network-item">
        <span className="network-icon">🛡️</span>
        <span className="network-info">{networkStatus.vpn}</span>
      </div>
      <div className="network-item">
        <span className="network-icon">⚡</span>
        <span className="network-info">{networkStatus.latency}</span>
      </div>
    </div>
  );
};

export default NetworkStatus;