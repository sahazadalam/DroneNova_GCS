import React, { useState, useEffect } from 'react';

const StatsGrid = ({ telemetry }) => {
  const [animatedValues, setAnimatedValues] = useState({});

  const stats = [
    {
      icon: '🚁',
      label: 'Online Drones',
      value: '1/26',
      change: '+1',
      color: 'text-green-400',
      bg: 'from-green-500/20 to-green-600/20',
      border: 'border-green-500/30',
      animation: 'animate-float'
    },
    {
      icon: '⏱️',
      label: 'Flight Time',
      value: '682 hr',
      change: '+12h',
      color: 'text-blue-400',
      bg: 'from-blue-500/20 to-blue-600/20',
      border: 'border-blue-500/30',
      animation: 'animate-pulse-slow'
    },
    {
      icon: '🗺️',
      label: 'Flight Distance',
      value: '1.2k km',
      change: '+45km',
      color: 'text-purple-400',
      bg: 'from-purple-500/20 to-purple-600/20',
      border: 'border-purple-500/30',
      animation: 'animate-glow'
    },
    {
      icon: '📊',
      label: 'Flights',
      value: '1,216',
      change: '+8',
      color: 'text-orange-400',
      bg: 'from-orange-500/20 to-orange-600/20',
      border: 'border-orange-500/30',
      animation: 'animate-slide-in'
    },
    {
      icon: '🔋',
      label: 'Battery',
      value: telemetry.battery_remaining ? `${telemetry.battery_remaining.toFixed(1)}%` : 'N/A',
      change: telemetry.battery_voltage ? `${telemetry.battery_voltage.toFixed(1)}V` : 'N/A',
      color: telemetry.battery_remaining > 30 ? 'text-green-400' : 'text-red-400',
      bg: telemetry.battery_remaining > 30 ? 'from-green-500/20 to-green-600/20' : 'from-red-500/20 to-red-600/20',
      border: telemetry.battery_remaining > 30 ? 'border-green-500/30' : 'border-red-500/30',
      animation: 'animate-heartbeat'
    },
    {
      icon: '🛰️',
      label: 'GPS Satellites',
      value: telemetry.satellites || '12',
      change: '3D Fix',
      color: 'text-cyan-400',
      bg: 'from-cyan-500/20 to-cyan-600/20',
      border: 'border-cyan-500/30',
      animation: 'animate-spin-slow'
    }
  ];

  useEffect(() => {
    // Animate value changes
    stats.forEach(stat => {
      if (stat.value !== animatedValues[stat.label]) {
        setTimeout(() => {
          setAnimatedValues(prev => ({ ...prev, [stat.label]: stat.value }));
        }, 100);
      }
    });
  }, [telemetry]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`grid-item bg-gradient-to-br ${stat.bg} border ${stat.border} rounded-2xl p-4 backdrop-blur-sm card-hover relative overflow-hidden group`}
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-white mb-1 transition-all duration-300 transform group-hover:scale-105">
                  {stat.value}
                </p>
                <p className={`text-xs font-medium ${stat.color}`}>{stat.change}</p>
              </div>
              <div className={`p-3 rounded-xl bg-white/10 ${stat.animation}`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
            
            {/* Progress bar for battery */}
            {stat.label === 'Battery' && telemetry.battery_remaining && (
              <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    telemetry.battery_remaining > 30 ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${telemetry.battery_remaining}%` }}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;