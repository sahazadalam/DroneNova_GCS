import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: '📊', label: 'Overview', path: '/dashboard' },
    { icon: '🚁', label: 'Drones', path: '/drones' },
    { icon: '🎯', label: 'Mission Control', path: '/mission' },
    { icon: '📅', label: 'Operation Calendar', path: '/calendar' },
    { icon: '📈', label: 'Inspection', path: '/inspection' },
    { icon: '📋', label: 'Incidents', path: '/incidents' },
    { icon: '📄', label: 'Generate Reports', path: '/reports' },
  ];

  return (
    <div className={`bg-gray-800 border-r border-gray-700 flex flex-col relative transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        {!isCollapsed ? (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">🚁</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">URBAN MIRTALX</h1>
              <p className="text-gray-400 text-sm">Console</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">🚁</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => (
          <button
            key={item.path}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-400 hover:text-white hover:bg-gray-700/50"
          >
            <span className="text-lg">{item.icon}</span>
            {!isCollapsed && (
              <span className="font-medium">{item.label}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-700 space-y-2">
        <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-400 hover:text-white hover:bg-gray-700/50">
          <span className="text-lg">⚙️</span>
          {!isCollapsed && <span className="font-medium">Settings</span>}
        </button>

        {/* User Info */}
        {!isCollapsed && user && (
          <div className="pt-4 border-t border-gray-700">
            <div className="flex items-center space-x-3 px-4 py-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {user.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {user.name}
                </p>
                <p className="text-gray-400 text-xs truncate">
                  {user.organization}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all duration-200"
        >
          <span className="text-lg">🚪</span>
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 bg-gray-800 border border-gray-600 rounded-full p-1.5 text-gray-400 hover:text-white transition-colors"
      >
        {isCollapsed ? '▶' : '◀'}
      </button>
    </div>
  );
};

export default Sidebar;