import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Drone, 
  BarChart3, 
  Download,
  Share2,
  Camera,
  Navigation,
  Battery,
  Satellite
} from 'lucide-react';
import { useParams } from 'react-router-dom';

const FlightDetails = () => {
  const { id } = useParams();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock flight data - in real app, fetch from API
  const mockFlight = {
    id: 1,
    location: "Electronics City Phase 2 (West)",
    date: "Dec 30, 2022",
    start_time: "03:58 PM",
    end_time: "04:00 PM",
    pilot: "Dayanata",
    drone: "Hank Demo",
    duration: "2 min",
    distance: "260 m",
    mission_type: "Manual",
    camera_angle: "Not set",
    speed: "Not set",
    altitude: "Not set",
    flight_length: "260 m",
    overlap: "0%",
    camera_captures: 12,
    battery_start: 95,
    battery_end: 85,
    path_data: [
      { lat: 51.5074, lng: -0.1278, alt: 100 },
      { lat: 51.5076, lng: -0.1280, alt: 105 },
      { lat: 51.5078, lng: -0.1282, alt: 110 },
      { lat: 51.5080, lng: -0.1284, alt: 115 },
    ],
    telemetry: [
      { time: '03:58', alt: 0, speed: 0, battery: 95 },
      { time: '03:59', alt: 50, speed: 5, battery: 92 },
      { time: '04:00', alt: 100, speed: 8, battery: 85 },
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFlight(mockFlight);
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-urban-darker text-white p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="min-h-screen bg-urban-darker text-white p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-white mb-2">Flight Not Found</h2>
          <p className="text-gray-400">The requested flight could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-urban-darker text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Flight Details</h1>
            <p className="text-gray-400">{flight.location} • {flight.date}</p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Flight Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Flight Overview Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            >
              <h2 className="text-xl font-bold text-white mb-4">Flight Overview</h2>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-gray-400 text-sm">Duration</div>
                  <div className="text-white font-semibold">{flight.duration}</div>
                </div>
                <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                  <Navigation className="h-6 w-6 text-green-400 mx-auto mb-2" />
                  <div className="text-gray-400 text-sm">Distance</div>
                  <div className="text-white font-semibold">{flight.distance}</div>
                </div>
                <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                  <Camera className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-gray-400 text-sm">Captures</div>
                  <div className="text-white font-semibold">{flight.camera_captures}</div>
                </div>
                <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                  <Battery className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                  <div className="text-gray-400 text-sm">Battery Used</div>
                  <div className="text-white font-semibold">{flight.battery_start - flight.battery_end}%</div>
                </div>
              </div>

              {/* Flight Path Map Placeholder */}
              <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold">Flight Path</h3>
                  <div className="flex items-center space-x-2 text-sm">
                    <button className="text-blue-400 hover:text-blue-300">Show Path</button>
                    <button className="text-blue-400 hover:text-blue-300">Show Record Path</button>
                  </div>
                </div>
                <div className="aspect-video bg-gray-600 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400">Flight path visualization</p>
                    <p className="text-gray-500 text-sm">Interactive map would appear here</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Telemetry Data Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            >
              <h2 className="text-xl font-bold text-white mb-4">Telemetry Data</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 text-gray-400 font-medium">Time</th>
                      <th className="text-left py-3 text-gray-400 font-medium">Altitude</th>
                      <th className="text-left py-3 text-gray-400 font-medium">Speed</th>
                      <th className="text-left py-3 text-gray-400 font-medium">Battery</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flight.telemetry.map((point, index) => (
                      <tr key={index} className="border-b border-gray-700/50">
                        <td className="py-3 text-white">{point.time}</td>
                        <td className="py-3 text-white">{point.alt}m</td>
                        <td className="py-3 text-white">{point.speed}m/s</td>
                        <td className="py-3">
                          <span className={`${
                            point.battery > 80 ? 'text-green-400' :
                            point.battery > 60 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {point.battery}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Details & Actions */}
          <div className="space-y-6">
            {/* Flight Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            >
              <h2 className="text-xl font-bold text-white mb-4">Flight Details</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>Date</span>
                  </div>
                  <span className="text-white">{flight.date}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>Time</span>
                  </div>
                  <span className="text-white">{flight.start_time} - {flight.end_time}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <User className="h-4 w-4" />
                    <span>Pilot</span>
                  </div>
                  <span className="text-white">{flight.pilot}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Drone className="h-4 w-4" />
                    <span>Drone</span>
                  </div>
                  <span className="text-white">{flight.drone}</span>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Satellite className="h-4 w-4" />
                    <span>Mission Type</span>
                  </div>
                  <span className="text-white">{flight.mission_type}</span>
                </div>
              </div>
            </motion.div>

            {/* Mission Parameters Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            >
              <h2 className="text-xl font-bold text-white mb-4">Mission Parameters</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Set Speed</span>
                  <span className="text-white">{flight.speed}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Duration</span>
                  <span className="text-white">{flight.duration}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Camera Angle</span>
                  <span className="text-white">{flight.camera_angle}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Set Altitude</span>
                  <span className="text-white">{flight.altitude}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Flight Length</span>
                  <span className="text-white">{flight.flight_length}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Overlap</span>
                  <span className="text-white">{flight.overlap}</span>
                </div>
              </div>
            </motion.div>

            {/* Camera Captures Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            >
              <h2 className="text-xl font-bold text-white mb-4">Camera Captures</h2>
              
              <div className="text-center py-8">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-400 mb-2">{flight.camera_captures} images captured</p>
                <p className="text-gray-500 text-sm">Camera capture points visualization</p>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-square bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-sm">{i}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Battery Analysis Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            >
              <h2 className="text-xl font-bold text-white mb-4">Battery Analysis</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Start</span>
                    <span className="text-green-400">{flight.battery_start}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${flight.battery_start}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">End</span>
                    <span className="text-yellow-400">{flight.battery_end}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${flight.battery_end}%` }}
                    />
                  </div>
                </div>
                
                <div className="text-center pt-2">
                  <div className="text-gray-400 text-sm">Consumption</div>
                  <div className="text-white font-semibold">
                    {flight.battery_start - flight.battery_end}% used
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightDetails;