import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTelemetry } from '../../context/TelemetryContext';
import './TelemetryCharts.css';

const TelemetryCharts = () => {
  const { telemetry } = useTelemetry();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (telemetry.timestamp) {
      const newPoint = {
        time: new Date().toLocaleTimeString(),
        altitude: telemetry.alt || 100.0,
        speed: telemetry.groundspeed || 0.0,
        battery: telemetry.battery_remaining || 95.0,
      };

      setChartData(prev => {
        const updated = [...prev, newPoint];
        // Keep last 20 points
        return updated.length > 20 ? updated.slice(-20) : updated;
      });
    }
  }, [telemetry]);

  // Default data if no telemetry
  const data = chartData.length > 0 ? chartData : [
    { time: new Date().toLocaleTimeString(), altitude: 100.0, speed: 0.0, battery: 95.0 }
  ];

  return (
    <div className="charts-container">
      <h3>📊 Telemetry Charts</h3>
      
      <div className="chart-grid">
        <div className="chart">
          <h4>Altitude (m)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" fontSize={10} />
              <YAxis stroke="#9CA3AF" fontSize={10} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '6px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="altitude" 
                stroke="#3b82f6" 
                strokeWidth={2} 
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart">
          <h4>Speed (m/s)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" fontSize={10} />
              <YAxis stroke="#9CA3AF" fontSize={10} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '6px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="speed" 
                stroke="#10b981" 
                strokeWidth={2} 
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart">
          <h4>Battery (%)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" fontSize={10} />
              <YAxis stroke="#9CA3AF" fontSize={10} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '6px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="battery" 
                stroke="#f59e0b" 
                strokeWidth={2} 
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TelemetryCharts;