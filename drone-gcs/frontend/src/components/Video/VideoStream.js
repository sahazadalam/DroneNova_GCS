import React, { useRef, useEffect, useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import './VideoStream.css';

const VideoStream = () => {
  const videoRef = useRef(null);
  const { telemetry } = useTelemetry();
  const [stream, setStream] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamActive, setStreamActive] = useState(false);

  const startVideo = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Try to access user media (webcam)
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setStreamActive(true);
        console.log('✅ Webcam stream started');
      }
    } catch (err) {
      console.error('Camera error:', err);
      
      // If camera fails, show simulated drone footage
      setError(`Camera not available: ${err.message}. Showing simulated footage.`);
      setStreamActive(true);
      
      setTimeout(() => {
        setError('📡 Streaming simulated drone footage');
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const stopVideo = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setStreamActive(false);
    setError('');
    console.log('🛑 Video stream stopped');
  };

  useEffect(() => {
    return () => {
      stopVideo();
    };
  }, []);

  return (
    <div className="video-stream">
      <div className="video-header">
        <h3>🎥 Live Video Stream</h3>
        <div className="video-status">
          {streamActive && <span className="live-indicator">● LIVE</span>}
        </div>
      </div>

      <div className="video-container">
        {streamActive ? (
          stream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="video-element"
            />
          ) : (
            <div className="simulated-video">
              <div className="simulated-content">
                <div className="drone-camera-view">
                  <div className="crosshair">
                    <div className="horizontal"></div>
                    <div className="vertical"></div>
                    <div className="center"></div>
                  </div>
                  <div className="camera-overlay">
                    <div className="overlay-text">🚁 DRONE CAMERA FEED</div>
                    <div className="overlay-text">📍 Bangalore, India</div>
                    <div className="overlay-text">📡 Streaming via WebRTC</div>
                    <div className="overlay-text">🕒 {new Date().toLocaleTimeString()}</div>
                    <div className="overlay-text">🔋 Battery: {telemetry.battery_remaining ? `${telemetry.battery_remaining.toFixed(1)}%` : '95.0%'}</div>
                    <div className="overlay-text">⚡ Speed: {telemetry.groundspeed ? `${telemetry.groundspeed.toFixed(1)} m/s` : '0.0 m/s'}</div>
                  </div>
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="video-placeholder">
            <div className="placeholder-content">
              <span className="placeholder-icon">📷</span>
              <p>Video stream not active</p>
              <p className="placeholder-subtitle">Click start to begin streaming</p>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="video-loading">
            <div className="loading-spinner"></div>
            <p>Starting video stream...</p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="video-error">
          <span>⚠️</span>
          {error}
        </div>
      )}

      {/* Video Controls */}
      <div className="video-controls">
        {!streamActive ? (
          <button
            onClick={startVideo}
            disabled={isLoading}
            className="btn btn-start"
          >
            {isLoading ? 'Starting...' : '▶ Start Video Stream'}
          </button>
        ) : (
          <button
            onClick={stopVideo}
            className="btn btn-stop"
          >
            ⏹ Stop Video Stream
          </button>
        )}
      </div>

      {/* Stream Info */}
      <div className="stream-info">
        <div className="info-grid">
          <div className="info-item">
            <span>Status:</span>
            <span>{streamActive ? 'Active' : 'Inactive'}</span>
          </div>
          <div className="info-item">
            <span>Type:</span>
            <span>{stream ? 'Webcam' : 'Simulated'}</span>
          </div>
          <div className="info-item">
            <span>Protocol:</span>
            <span>WebRTC</span>
          </div>
        </div>
      </div>

      {/* Feature Info */}
      <div className="feature-info">
        <p>🔒 Secure WebRTC streaming | 🌐 Low latency | 📡 AirCast technology</p>
      </div>
    </div>
  );
};

export default VideoStream;