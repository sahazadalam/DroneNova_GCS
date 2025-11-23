import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quickLoading, setQuickLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const { login, quickLogin } = useAuth();

  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Create floating particles
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 5
    }));
    setParticles(newParticles);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(credentials.username, credentials.password);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleQuickLogin = async () => {
    setQuickLoading(true);
    setError('');
    
    await new Promise(resolve => setTimeout(resolve, 800));
    quickLogin();
    
    setQuickLoading(false);
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    setError('');
    
    const result = await login('demo@urbanmirtalx.com', 'demo123');
    
    if (!result.success) {
      setError(result.error);
    }
    
    setDemoLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-blue-500/20 animate-float"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.id * 0.5}s`
          }}
        />
      ))}

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Animated Header */}
        <div className="text-center animate-slide-in">
          <div className="flex justify-center items-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center animate-float shadow-2xl">
              <span className="text-white text-3xl">🚁</span>
            </div>
            <div>
              <h1 className="text-5xl font-black text-white mb-2 text-gradient animate-pulse-slow">
                URBAN MIRTALX
              </h1>
              <p className="text-gray-300 text-lg font-medium">Welcome to UMT Console</p>
            </div>
          </div>
        </div>

        {/* Glassmorphism Login Card */}
        <div className="glass-effect rounded-3xl shadow-2xl p-8 border border-white/10 animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-xl text-sm animate-slide-in">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-300 mb-2">
                  Email (Optional)
                </label>
                <input
                  id="username"
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white/10"
                  placeholder="username@urbanmirtalx.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2">
                  Password (Optional)
                </label>
                <input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:bg-white/10"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Regular Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-hover bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-4 rounded-xl font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="spinner"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>🔐</span>
                  <span>Sign In</span>
                </div>
              )}
            </button>

            {/* Demo Login Button */}
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={demoLoading}
              className="w-full btn-hover bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 px-4 rounded-xl font-bold text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {demoLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="spinner"></div>
                  <span>Loading Demo...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>👨‍💼</span>
                  <span>Demo Login</span>
                </div>
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-gray-900 text-gray-400 font-medium">Quick Access</span>
              </div>
            </div>

            {/* Quick Login Button */}
            <button
              type="button"
              onClick={handleQuickLogin}
              disabled={quickLoading}
              className="w-full btn-hover bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-4 rounded-xl font-bold text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed animate-pulse-slow"
            >
              {quickLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="spinner"></div>
                  <span>Quick Access...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>🚀</span>
                  <span>Quick Login (No Credentials)</span>
                </div>
              )}
            </button>

            <div className="text-center">
              <p className="text-gray-400 text-sm">
                Use any credentials or click Quick Login for instant access
              </p>
            </div>
          </form>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { icon: '🗺️', label: 'Live Tracking' },
            { icon: '🚁', label: 'Fleet Management' },
            { icon: '🔒', label: 'Secure' },
            { icon: '📡', label: 'MAVLink' },
            { icon: '🌐', label: '4G/LTE' },
            { icon: '🛡️', label: 'ZeroTier VPN' }
          ].map((feature, index) => (
            <div key={feature.label} className="text-gray-400 animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="text-2xl mb-1 animate-float" style={{ animationDelay: `${index * 0.2}s` }}>
                {feature.icon}
              </div>
              <p className="text-xs font-medium">{feature.label}</p>
            </div>
          ))}
        </div>

        {/* Login Instructions */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 animate-fade-in">
          <h4 className="text-blue-400 font-bold mb-2 text-sm">🚀 Login Options:</h4>
          <ul className="text-blue-300 text-xs space-y-1">
            <li>• <strong>Quick Login:</strong> Instant access - no credentials needed</li>
            <li>• <strong>Demo Login:</strong> Pre-configured demo account</li>
            <li>• <strong>Regular Login:</strong> Use any username/password</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;