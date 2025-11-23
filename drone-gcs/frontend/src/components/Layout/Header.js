import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { connectionStatus, telemetry } = useTelemetry();
  const { user } = useAuth();

  const getConnectionStatus = () => {
    switch (connectionStatus) {
      case 'connected':
        return { text: 'Connected', color: 'text-green-400', bg: 'bg-green-500/20' };
      case 'disconnected':
        return { text: 'Disconnected', color: 'text-red-400', bg: 'bg-red-500/20' };
      case 'error':
        return { text: 'Error', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
      default:
        return { text: 'Connecting...', color: 'text-gray-400', bg: 'bg-gray-500/20' };
    }
  };

  const status = getConnectionStatus();

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-6">
          <h1 className="text-2xl font-bold text-white">Overview</h1>
          
          {/* Connection Status */}
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${status.bg} border border-gray-600`}>
            <div className={`w-2 h-2 rounded-full ${status.color.replace('text-', 'bg-')}`} />
            <span className={`text-sm font-medium ${status.color}`}>
              {status.text}
            </span>
          </div>

          {/* Drone Status */}
          {telemetry.mode && (
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                telemetry.armed ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
              }`} />
              <span className="text-gray-300 text-sm">
                {telemetry.mode} • {telemetry.armed ? 'ARMED' : 'DISARMED'}
              </span>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <span className="text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2">🔍</span>
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 transition-all"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
            <span className="text-lg">🔔</span>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-gray-800"></div>
          </button>

          {/* User Profile */}
          {user && (
            <div className="flex items-center space-x-3 bg-gray-700/50 rounded-lg px-3 py-2 border border-gray-600">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {user.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-white text-sm font-medium">{user.name}</p>
                <p className="text-gray-400 text-xs">{user.role}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;