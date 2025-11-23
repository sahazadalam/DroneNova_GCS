import React, { createContext, useState, useContext, useEffect } from 'react';

const TelemetryContext = createContext();

export const useTelemetry = () => {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error('useTelemetry must be used within a TelemetryProvider');
  }
  return context;
};

export const TelemetryProvider = ({ children }) => {
  const [telemetry, setTelemetry] = useState({});
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [networkStatus, setNetworkStatus] = useState({});
  const [websocket, setWebsocket] = useState(null);

  useEffect(() => {
    connectWebSocket();
    
    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, []);

  const connectWebSocket = () => {
    console.log('🔗 Connecting to GCS WebSocket...');
    
    try {
      const ws = new WebSocket('ws://localhost:8000/ws');
      
      ws.onopen = () => {
        console.log('✅ WebSocket connected successfully!');
        setConnectionStatus('connected');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 Received:', data.type);
          
          if (data.type === 'telemetry') {
            setTelemetry(prev => ({ ...prev, ...data.data }));
          } else if (data.type === 'network_status') {
            setNetworkStatus(data.data);
          } else if (data.type === 'connection') {
            console.log('🔗', data.message);
          } else if (data.type === 'command_ack') {
            console.log('✅ Command result:', data);
          }
        } catch (error) {
          console.error('❌ Error parsing message:', error);
        }
      };

      ws.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        setConnectionStatus('disconnected');
        
        // Auto-reconnect after 2 seconds
        setTimeout(() => {
          console.log('🔄 Reconnecting...');
          connectWebSocket();
        }, 2000);
      };

      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        setConnectionStatus('error');
      };

      setWebsocket(ws);
      
    } catch (error) {
      console.error('❌ WebSocket connection error:', error);
    }
  };

  const sendCommand = (command, params = {}) => {
    if (websocket && connectionStatus === 'connected') {
      const message = {
        type: 'command',
        command,
        params,
        timestamp: Date.now()
      };
      websocket.send(JSON.stringify(message));
      console.log('📡 MAVLink Command:', command, params);
    } else {
      console.warn('⚠️ Cannot send command: WebSocket not connected');
    }
  };

  const connectToZeroTier = (networkId) => {
    if (websocket && connectionStatus === 'connected') {
      const message = {
        type: 'network_command',
        command: 'connect_zerotier',
        network_id: networkId
      };
      websocket.send(JSON.stringify(message));
      console.log('🛡️ ZeroTier Connect:', networkId);
    }
  };

  const value = {
    telemetry,
    connectionStatus,
    networkStatus,
    sendCommand,
    connectToZeroTier
  };

  return (
    <TelemetryContext.Provider value={value}>
      {children}
    </TelemetryContext.Provider>
  );
};