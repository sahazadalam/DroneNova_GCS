import React from 'react';

const StatusPanel = ({ telemetry, connectionStatus }) => {
  const statusItems = [
    {
      icon: '📶',
      label: 'Connection',
      value: connectionStatus === 'connected' ? 'Connected' : 'Disconnected',
      status: connectionStatus === 'connected' ? 'success' : 'error',
      color: connectionStatus === 'connected' ? 'text-green-400' : 'text-red-400'
    },
    {
      icon: '🛰️',
      label: 'GPS Status',
      value: telemetry.fix_type > 2 ? '3D Fix' : 'No Fix',
      status: telemetry.fix_type > 2 ? 'success' : 'warning',
      color: telemetry.fix_type > 2 ? 'text-green-400' : 'text-yellow-400',
      extra: telemetry.satellites ? `${telemetry.satellites} sats` : '0 sats'
    },
    {
      icon: '🔋',
      label: 'Battery',
      value: telemetry.battery_remaining ? `${telemetry.battery_remaining}%` : 'N/A',
      status: telemetry.battery_remaining > 30 ? 'success' : 'warning',
      color: telemetry.battery_remaining > 30 ? 'text-green-400' : 'text-yellow-400',
      extra: telemetry.battery_voltage ? `${telemetry.battery_voltage.toFixed(1)}V` : 'N/A'
    },
    {
      icon: '🧭',
      label: 'Heading',
      value: telemetry.heading ? `${Math.round(telemetry.heading)}°` : 'N/A',
      status: 'info',
      color: 'text-blue-400',
      extra: telemetry.yaw ? `Yaw: ${telemetry.yaw.toFixed(1)}°` : ''
    },
    {
      icon: '⚡',
      label: 'Speed',
      value: telemetry.groundspeed ? `${telemetry.groundspeed.toFixed(1)} m/s` : '0.0 m/s',
      status: 'info',
      color: 'text-purple-400',
      extra: telemetry.airspeed ? `Air: ${telemetry.airspeed.toFixed(1)} m/s` : ''
    },
    {
      icon: '📏',
      label: 'Position',
      value: telemetry.alt ? `${telemetry.alt.toFixed(1)}m` : 'N/A',
      status: 'info',
      color: 'text-cyan-400',
      extra: telemetry.relative_alt ? `Rel: ${telemetry.relative_alt.toFixed(1)}m` : ''
    }
  ];

  const systemStatus = [
    {
      label: 'Flight Mode',
      value: telemetry.mode || 'GUIDED',
      status: telemetry.armed ? 'armed' : 'disarmed'
    },
    {
      label: 'Arm Status',
      value: telemetry.armed ? 'ARMED' : 'DISARMED',
      status: telemetry.armed ? 'armed' : 'disarmed'
    },
    {
      label: 'System Status',
      value: telemetry.system_status || 'STANDBY',
      status: 'info'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
      case 'armed':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
      case 'disarmed':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700">
      {/* Panel Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <span className="text-lg">📊</span>
          </div>
          <div>
            <h3 className="text-white font-semibold">System Status</h3>
            <p className="text-gray-400 text-sm">Real-time drone status</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          telemetry.armed 
            ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
            : 'bg-green-500/20 text-green-400 border border-green-500/30'
        }`}>
          {telemetry.armed ? 'ARMED' : 'DISARMED'}
        </div>
      </div>

      {/* Status Grid */}
      <div className="p-4 space-y-4">
        {/* Telemetry Status */}
        <div className="grid grid-cols-2 gap-3">
          {statusItems.map((item, index) => (
            <div
              key={item.label}
              className="bg-gray-700/50 rounded-lg p-3 border border-gray-600 hover:scale-105 transition-transform"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-gray-400 text-sm font-medium">{item.label}</span>
                </div>
                <span>{getStatusIcon(item.status)}</span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className={`text-lg font-bold ${item.color}`}>{item.value}</div>
                  {item.extra && (
                    <div className="text-gray-400 text-xs mt-1">{item.extra}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* System Status */}
        <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600">
          <h4 className="text-gray-400 text-sm font-medium mb-3">System Information</h4>
          <div className="grid grid-cols-2 gap-2">
            {systemStatus.map((item, index) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-1"
              >
                <span className="text-gray-400 text-sm">{item.label}</span>
                <span className={`text-white text-sm font-medium ${
                  item.status === 'armed' ? 'text-red-400' : 
                  item.status === 'disarmed' ? 'text-green-400' : ''
                }`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusPanel;