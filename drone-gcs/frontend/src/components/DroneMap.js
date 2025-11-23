import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom drone icon
const droneIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTUgOUwyMiAxMkwxNSA5TDEyIDE2TDkgOUwyIDEyTDkgOUwxMiAyWiIgZmlsbD0iIzAwN2FGQiIvPgo8L3N2Zz4K',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const DroneMap = ({ telemetry }) => {
  const position = telemetry.lat && telemetry.lon 
    ? [telemetry.lat, telemetry.lon] 
    : [51.505, -0.09]; // Default to London

  return (
    <div className="map-container">
      <h3>Live Drone Position</h3>
      <MapContainer 
        center={position} 
        zoom={17} 
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={droneIcon}>
          <Popup>
            <div>
              <strong>Drone Position</strong><br />
              Lat: {telemetry.lat?.toFixed(6) || 'N/A'}<br />
              Lon: {telemetry.lon?.toFixed(6) || 'N/A'}<br />
              Alt: {telemetry.alt?.toFixed(1) || 'N/A'}m
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default DroneMap;