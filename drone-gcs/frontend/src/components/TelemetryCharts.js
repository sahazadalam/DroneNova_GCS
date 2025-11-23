import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TelemetryCharts = ({ telemetry }) => {
  // Create sample chart data
  const chartData = [
    { time: '10:00', altitude: telemetry.alt || 0, speed: telemetry.groundspeed || 0, battery: telemetry.battery_voltage || 0 },
    { time: '10:01', altitude: (telemetry.alt || 0) + 5, speed: (telemetry.groundspeed || 0) + 2, battery: (telemetry.battery_voltage || 0) - 0.1 },
    { time: '10:02', altitude: (telemetry.alt || 0) + 10, speed: (telemetry.groundspeed || 0) + 1, battery: (telemetry.battery_voltage || 0) - 0.2 },
  ];

  return (
    <div className="telemetry-charts">
      <h3>Telemetry Charts</h3>
      
      <div className="chart-container">
        <h4>Altitude (m)</h4>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="altitude" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="chart-container">
        <h4>Speed (m/s)</h4>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="speed" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="chart-container">
        <h4>Battery Voltage (V)</h4>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="battery" stroke="#ff7300" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TelemetryCharts;