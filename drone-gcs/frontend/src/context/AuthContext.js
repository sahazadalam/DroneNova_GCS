import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [networkStatus, setNetworkStatus] = useState({
    type: '4G/LTE',
    signal: 'excellent',
    vpn: 'ZeroTier',
    status: 'connected'
  });

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('umt_token');
    const userData = localStorage.getItem('umt_user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
        
        // Simulate network status check
        simulateNetworkStatus();
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('umt_token');
        localStorage.removeItem('umt_user');
      }
    }
    setLoading(false);
  }, []);

  const simulateNetworkStatus = () => {
    const networks = ['4G/LTE', '5G', 'WiFi', 'Satellite'];
    const signals = ['excellent', 'good', 'fair', 'poor'];
    const vpns = ['ZeroTier', 'OpenVPN', 'WireGuard', 'Tailscale'];
    
    setInterval(() => {
      setNetworkStatus({
        type: networks[Math.floor(Math.random() * networks.length)],
        signal: signals[Math.floor(Math.random() * signals.length)],
        vpn: vpns[Math.floor(Math.random() * vpns.length)],
        status: 'connected'
      });
    }, 10000);
  };

  const login = async (username = 'demo', password = 'demo') => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create demo user data
      const demoUser = {
        id: 1,
        username: username || 'demo',
        name: 'Demo User',
        email: 'demo@urbanmirtalx.com',
        role: 'pilot',
        organization: 'Urban Mirtalx',
        avatar: '👨‍💼',
        permissions: ['flight_control', 'mission_planning', 'video_streaming']
      };

      // Generate demo token
      const demoToken = 'umt_demo_token_' + Date.now();
      
      // Store in localStorage
      localStorage.setItem('umt_token', demoToken);
      localStorage.setItem('umt_user', JSON.stringify(demoUser));
      
      // Update state
      setUser(demoUser);
      setIsAuthenticated(true);
      simulateNetworkStatus();
      
      return { success: true, user: demoUser };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const quickLogin = () => {
    // Instant login without credentials
    const demoUser = {
      id: 1,
      username: 'quickdemo',
      name: 'Quick Demo',
      email: 'quick@urbanmirtalx.com',
      role: 'operator',
      organization: 'Urban Mirtalx',
      avatar: '🚀',
      permissions: ['flight_control', 'mission_planning', 'video_streaming']
    };

    const demoToken = 'umt_quick_token_' + Date.now();
    
    localStorage.setItem('umt_token', demoToken);
    localStorage.setItem('umt_user', JSON.stringify(demoUser));
    
    setUser(demoUser);
    setIsAuthenticated(true);
    simulateNetworkStatus();
    
    return { success: true, user: demoUser };
  };

  const logout = () => {
    localStorage.removeItem('umt_token');
    localStorage.removeItem('umt_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    networkStatus,
    login,
    quickLogin,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};