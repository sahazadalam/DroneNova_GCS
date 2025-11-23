import time
import json
from typing import Dict, List, Any
from datetime import datetime, timedelta

class Database:
    def __init__(self):
        self.telemetry_history = []
        self.latest_telemetry = {}
        self.max_history_size = 5000  # Keep last 5000 points
        self.telemetry_count = 0
    
    def store_telemetry(self, data: Dict[str, Any]):
        """Store telemetry data in memory"""
        try:
            # Add timestamp if not present
            if 'timestamp' not in data:
                data['timestamp'] = time.time()
            
            # Update latest telemetry
            self.latest_telemetry = data.copy()
            
            # Add to history
            self.telemetry_history.append(data.copy())
            self.telemetry_count += 1
            
            # Limit history size
            if len(self.telemetry_history) > self.max_history_size:
                self.telemetry_history.pop(0)
                
        except Exception as e:
            print(f"❌ Error storing telemetry: {e}")
    
    def get_latest_telemetry(self) -> Dict[str, Any]:
        """Get latest telemetry data"""
        return self.latest_telemetry.copy()
    
    def get_telemetry_history(self, hours: int = 1) -> List[Dict[str, Any]]:
        """Get telemetry history for last N hours"""
        cutoff_time = time.time() - (hours * 3600)
        
        return [
            data for data in self.telemetry_history 
            if data.get('timestamp', 0) >= cutoff_time
        ]
    
    def get_telemetry_count(self) -> int:
        """Get total number of telemetry updates"""
        return self.telemetry_count
    
    def get_statistics(self) -> Dict[str, Any]:
        """Get telemetry statistics"""
        if not self.telemetry_history:
            return {}
        
        recent_data = self.get_telemetry_history(hours=1)
        if not recent_data:
            return {}
        
        altitudes = [d.get('alt', 0) for d in recent_data]
        speeds = [d.get('groundspeed', 0) for d in recent_data]
        voltages = [d.get('battery_voltage', 0) for d in recent_data]
        
        return {
            'total_updates': self.telemetry_count,
            'recent_updates': len(recent_data),
            'avg_altitude': sum(altitudes) / len(altitudes) if altitudes else 0,
            'max_altitude': max(altitudes) if altitudes else 0,
            'avg_speed': sum(speeds) / len(speeds) if speeds else 0,
            'max_speed': max(speeds) if speeds else 0,
            'avg_voltage': sum(voltages) / len(voltages) if voltages else 0,
        }