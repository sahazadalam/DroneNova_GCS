import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTelemetry } from '../../context/TelemetryContext';

const NetworkStatus = () => {
  const { networkStatus } = useAuth();
  const { connectionStatus, connectionStats } = useTelemetry();

  const getSignalIcon = (signal) => {
    switch (signal) {
      case 'excellent': return '📶';
      case 'good': return '📶';
      case 'fair': return '📶';
      case 'poor': return '📶';
      default: return '📶';
    }
  };

  const getSignalColor = (signal) => {
    switch (signal) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-green-400';
      case 'fair': return 'text-yellow-400';
      case 'poor': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getConnectionColor = (status) => {
    switch (status) {
      case 'connected': return 'text-green-400';
      case 'disconnected': return 'text-red-400';
      case 'error': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-800/50 border-b border-gray-700 px-6 py-2">
      <div className="flex items-center justify-between text-sm">
        {/* Left side - Network Info */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className={getSignalColor(networkStatus.signal)}>
              {getSignalIcon(networkStatus.signal)}
            </span>
            <span className="text-gray-300">
              {networkStatus.type} • {networkStatus.signal}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-purple-400">🛡️</span>
            <span className="text-gray-300">VPN: {networkStatus.vpn}</span>
          </div>
        </div>

        {/* Right side - Connection Info */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${getConnectionColor(connectionStatus).replace('text-', 'bg-')} animate-pulse`} />
            <span className={getConnectionColor(connectionStatus)}>
              MAVLink: {connectionStatus}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-blue-400">📨</span>
            <span className="text-gray-300">
              Messages: {connectionStats.messagesReceived}
            </span>
          </div>
          
          {connectionStats.connectedSince && (
            <div className="text-gray-400 text-xs">
              Connected: {new Date(connectionStats.connectedSince).toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkStatus;