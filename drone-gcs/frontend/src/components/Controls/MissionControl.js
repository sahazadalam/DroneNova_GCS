import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, Navigation, MapPin, Battery, AlertTriangle } from 'lucide-react';
import axios from 'axios';

const MissionControl = () => {
  const [activeMission, setActiveMission] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const missionTypes = [
    {
      id: 'takeoff',
      title: 'Takeoff',
      description: 'Takeoff drone from current position',
      icon: Play,
      color: 'from-green-500 to-emerald-600',
      fields: [
        { name: 'altitude', label: 'Takeoff Altitude', value: 30, unit: 'm' },
        { name: 'rtl_altitude', label: 'RTL Altitude', value: 120, unit: 'm' }
      ]
    },
    {
      id: 'rtl',
      title: 'Return to Launch',
      description: 'Return drone to launch position',
      icon: Navigation,
      color: 'from-blue-500 to-cyan-600',
      fields: [
        { name: 'altitude', label: 'RTL Altitude', value: 120, unit: 'm' }
      ]
    },
    {
      id: 'goto',
      title: 'Go to Location',
      description: 'Send drone to selected location',
      icon: MapPin,
      color: 'from-purple-500 to-pink-600',
      fields: [
        { name: 'lat', label: 'Latitude', value: 51.5074, unit: '°' },
        { name: 'lon', label: 'Longitude', value: -0.1278, unit: '°' },
        { name: 'alt', label: 'Altitude', value: 100, unit: 'm' }
      ]
    }
  ];

  const executeMission = async (missionType, formData) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:8000/api/mission/${missionType}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log(`✅ ${missionType} mission initiated:`, response.data);
      
      // Show success message
      setTimeout(() => {
        setIsLoading(false);
        setActiveMission(null);
      }, 2000);
      
    } catch (error) {
      console.error(`❌ ${missionType} mission failed:`, error);
      setIsLoading(false);
    }
  };

  const MissionForm = ({ mission }) => {
    const [formData, setFormData] = useState(
      mission.fields.reduce((acc, field) => ({
        ...acc,
        [field.name]: field.value
      }), {})
    );

    const handleSubmit = (e) => {
      e.preventDefault();
      executeMission(mission.id, formData);
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={() => setActiveMission(null)}
      >
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-600"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${mission.color}`}>
              <mission.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{mission.title}</h3>
              <p className="text-gray-400 text-sm">{mission.description}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mission.fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {field.label}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={formData[field.name]}
                    onChange={(e) => setFormData({
                      ...formData,
                      [field.name]: parseFloat(e.target.value)
                    })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    {field.unit}
                  </span>
                </div>
              </div>
            ))}

            {/* Warning Message */}
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                <span className="text-yellow-200 text-sm">Confirm mission parameters before proceeding</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveMission(null)}
                className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Executing...
                  </div>
                ) : (
                  'Slide to Confirm'
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-urban-darker text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Mission Control</h1>
          <p className="text-gray-400">Execute drone missions and flight operations</p>
        </div>

        {/* Mission Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {missionTypes.map((mission, index) => (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 cursor-pointer group"
              onClick={() => setActiveMission(mission)}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-4 rounded-xl bg-gradient-to-r ${mission.color} group-hover:scale-110 transition-transform`}>
                  <mission.icon className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{mission.title}</h3>
                  <p className="text-gray-400 text-sm">{mission.description}</p>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                {mission.fields.slice(0, 2).map((field) => (
                  <div key={field.name} className="text-center p-2 bg-gray-700/50 rounded-lg">
                    <div className="text-gray-400">{field.label}</div>
                    <div className="text-white font-semibold">{field.value}{field.unit}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Missions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <h2 className="text-xl font-bold text-white mb-4">Recent Missions</h2>
          <div className="space-y-3">
            {[
              { id: 1, type: 'Takeoff', status: 'Completed', time: '2 min ago', altitude: '30m' },
              { id: 2, type: 'GoTo', status: 'In Progress', time: '5 min ago', location: '51.5074, -0.1278' },
              { id: 3, type: 'RTL', status: 'Completed', time: '15 min ago', altitude: '120m' }
            ].map((mission) => (
              <div key={mission.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    mission.status === 'Completed' ? 'bg-green-400' : 'bg-yellow-400 animate-pulse'
                  }`} />
                  <span className="text-white font-medium">{mission.type}</span>
                  <span className="text-gray-400 text-sm">{mission.altitude || mission.location}</span>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${
                    mission.status === 'Completed' ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    {mission.status}
                  </div>
                  <div className="text-gray-400 text-xs">{mission.time}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Mission Form Modal */}
      <AnimatePresence>
        {activeMission && <MissionForm mission={activeMission} />}
      </AnimatePresence>
    </div>
  );
};

export default MissionControl;