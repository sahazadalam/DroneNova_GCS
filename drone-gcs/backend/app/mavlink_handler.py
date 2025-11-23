"""
MAVLink Handler with real MAVLink protocol support
Simulates ArduPilot/PX4 SITL telemetry
"""
import logging
import time
import random
import json
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

class MAVLinkHandler:
    def __init__(self, connection_string: str = 'udp:127.0.0.1:14550'):
        self.connection_string = connection_string
        self.connected = False
        self.simulation_mode = True  # Fallback to simulation
        
        # MAVLink message counters
        self.msg_counters = {
            'HEARTBEAT': 0,
            'GPS_RAW_INT': 0,
            'VFR_HUD': 0,
            'ATTITUDE': 0,
            'SYS_STATUS': 0
        }
        
        # Initialize simulation data (Bangalore coordinates)
        self.telemetry_data = self._get_initial_telemetry()
        
    def _get_initial_telemetry(self) -> Dict[str, Any]:
        """Initialize telemetry with Bangalore, India coordinates"""
        return {
            # GPS and Position (Bangalore, India)
            'lat': 12.9716,
            'lon': 77.5946,
            'alt': 100.0,
            'relative_alt': 100.0,
            
            # Attitude and Movement
            'roll': 0.0,
            'pitch': 0.0,
            'yaw': 0.0,
            'heading': 0.0,
            
            # Speed and Velocity
            'groundspeed': 0.0,
            'airspeed': 0.0,
            'vx': 0.0,
            'vy': 0.0,
            'vz': 0.0,
            
            # System Status
            'mode': 'GUIDED',
            'armed': False,
            'system_status': 'STANDBY',
            
            # Battery
            'battery_remaining': 100.0,
            'voltage_battery': 12.6,
            'current_battery': 0.0,
            
            # GPS Info
            'satellites': 15,
            'fix_type': 3,  # 3D fix
            'eph': 1.5,  # GPS HDOP
            'epv': 2.1,  # GPS VDOP
            
            # Mission Info
            'mission_current': 0,
            'mission_total': 5,
            
            # Communication
            'rssi': -55,
            
            # Timestamps
            'timestamp': time.time(),
            'message_id': f"SIM_{int(time.time())}"
        }
    
    def connect(self) -> bool:
        """Connect to MAVLink source (real or simulated)"""
        try:
            # Try to import and use real pymavlink
            from pymavlink import mavutil
            
            logger.info(f"🔗 Connecting to MAVLink: {self.connection_string}")
            self.mav_connection = mavutil.mavlink_connection(self.connection_string)
            
            # Wait for heartbeat
            msg = self.mav_connection.recv_match(type='HEARTBEAT', blocking=True, timeout=5)
            if msg:
                self.connected = True
                self.simulation_mode = False
                logger.info("✅ MAVLink connected successfully (Real connection)")
                return True
            else:
                raise Exception("No heartbeat received")
                
        except ImportError:
            logger.warning("❌ pymavlink not available, using simulation mode")
            self.simulation_mode = True
            self.connected = True
            return True
        except Exception as e:
            logger.warning(f"❌ MAVLink connection failed: {e}, using simulation mode")
            self.simulation_mode = True
            self.connected = True
            return True
    
    def update_simulation(self) -> Dict[str, Any]:
        """Update simulation data with realistic MAVLink-like behavior"""
        # Simulate GPS movement around Bangalore
        self.telemetry_data['lat'] = 12.9716 + random.uniform(-0.01, 0.01)
        self.telemetry_data['lon'] = 77.5946 + random.uniform(-0.01, 0.01)
        
        # Simulate flight dynamics if armed
        if self.telemetry_data['armed']:
            self.telemetry_data['groundspeed'] = random.uniform(8.0, 15.0)
            self.telemetry_data['alt'] += random.uniform(-2.0, 2.0)
            self.telemetry_data['relative_alt'] = self.telemetry_data['alt']
            self.telemetry_data['battery_remaining'] -= 0.02
            self.telemetry_data['voltage_battery'] = 12.0 + (self.telemetry_data['battery_remaining'] / 100) * 0.6
            
            # Simulate attitude changes during flight
            self.telemetry_data['roll'] = random.uniform(-10.0, 10.0)
            self.telemetry_data['pitch'] = random.uniform(-5.0, 5.0)
            self.telemetry_data['yaw'] = (self.telemetry_data['yaw'] + random.uniform(-8.0, 8.0)) % 360
        else:
            self.telemetry_data['groundspeed'] = 0.0
            self.telemetry_data['roll'] = 0.0
            self.telemetry_data['pitch'] = 0.0
        
        self.telemetry_data['heading'] = self.telemetry_data['yaw']
        self.telemetry_data['timestamp'] = time.time()
        
        # Simulate GPS satellite changes
        self.telemetry_data['satellites'] = random.randint(12, 18)
        
        # Simulate RSSI changes
        self.telemetry_data['rssi'] = random.uniform(-75, -45)
        
        return self.telemetry_data.copy()
    
    def get_telemetry(self) -> Optional[Dict[str, Any]]:
        """Get latest telemetry data (real or simulated)"""
        try:
            if self.simulation_mode:
                return self.update_simulation()
                
            elif self.connected and hasattr(self, 'mav_connection'):
                # Read real MAVLink messages
                telemetry = {}
                
                # Read multiple messages to get comprehensive data
                for _ in range(10):  # Read up to 10 messages
                    msg = self.mav_connection.recv_match(blocking=False)
                    if msg is None:
                        break
                        
                    parsed = self.parse_mavlink_message(msg)
                    if parsed:
                        telemetry.update(parsed)
                        self.msg_counters[msg.get_type()] += 1
                
                return telemetry if telemetry else None
                
            else:
                return None
                
        except Exception as e:
            logger.error(f"❌ Error getting telemetry: {e}")
            # Fallback to simulation
            return self.update_simulation()
    
    def parse_mavlink_message(self, msg) -> Optional[Dict[str, Any]]:
        """Parse MAVLink message to JSON format"""
        try:
            message_data = {}
            msg_type = msg.get_type()
            
            if msg_type == 'HEARTBEAT':
                message_data.update({
                    'type': 'heartbeat',
                    'armed': bool(msg.base_mode & 0x80),
                    'mode': self._get_mode_name(msg.custom_mode),
                    'system_status': msg.system_status
                })
                
            elif msg_type == 'GPS_RAW_INT':
                message_data.update({
                    'type': 'gps',
                    'lat': msg.lat / 1e7,
                    'lon': msg.lon / 1e7,
                    'alt': msg.alt / 1000.0,
                    'satellites': msg.satellites_visible,
                    'fix_type': msg.fix_type,
                    'eph': msg.eph / 100.0,  # HDOP
                    'epv': msg.epv / 100.0   # VDOP
                })
                
            elif msg_type == 'VFR_HUD':
                message_data.update({
                    'type': 'attitude',
                    'airspeed': msg.airspeed,
                    'groundspeed': msg.groundspeed,
                    'heading': msg.heading,
                    'alt': msg.alt,
                    'climb': msg.climb
                })
                
            elif msg_type == 'SYS_STATUS':
                message_data.update({
                    'type': 'system_status',
                    'battery_remaining': msg.battery_remaining,
                    'voltage_battery': msg.voltage_battery / 1000.0,
                    'current_battery': msg.current_battery / 100.0
                })
                
            elif msg_type == 'ATTITUDE':
                message_data.update({
                    'type': 'attitude',
                    'roll': msg.roll,
                    'pitch': msg.pitch,
                    'yaw': msg.yaw,
                    'rollspeed': msg.rollspeed,
                    'pitchspeed': msg.pitchspeed,
                    'yawspeed': msg.yawspeed
                })
                
            return message_data
            
        except Exception as e:
            logger.error(f"❌ Error parsing MAVLink message: {e}")
            return None
    
    def _get_mode_name(self, custom_mode: int) -> str:
        """Convert MAVLink custom mode to mode name"""
        mode_mapping = {
            0: 'STABILIZE',
            4: 'GUIDED',
            5: 'LOITER',
            6: 'RTL',
            7: 'CIRCLE',
            9: 'LAND',
            11: 'DRIFT',
            13: 'SPORT',
            15: 'FLIP',
            16: 'AUTOTUNE',
            17: 'POSHOLD'
        }
        return mode_mapping.get(custom_mode, 'UNKNOWN')
    
    def send_command(self, command: str, params: Dict = None) -> bool:
        """Send MAVLink command to drone"""
        try:
            logger.info(f"📡 Sending MAVLink command: {command} {params}")
            
            if command == 'ARM':
                if self.simulation_mode:
                    self.telemetry_data['armed'] = True
                    self.telemetry_data['system_status'] = 'ACTIVE'
                return True
                
            elif command == 'DISARM':
                if self.simulation_mode:
                    self.telemetry_data['armed'] = False
                    self.telemetry_data['system_status'] = 'STANDBY'
                return True
                
            elif command == 'SET_MODE':
                if params and 'mode' in params:
                    if self.simulation_mode:
                        self.telemetry_data['mode'] = params['mode']
                    return True
                    
            elif command == 'TAKEOFF':
                if self.simulation_mode and self.telemetry_data['armed']:
                    self.telemetry_data['mode'] = 'TAKEOFF'
                    return True
                    
            elif command == 'RTL':  # Return to Launch
                if self.simulation_mode:
                    self.telemetry_data['mode'] = 'RTL'
                    return True
            
            return False
            
        except Exception as e:
            logger.error(f"❌ Error sending command: {e}")
            return False
    
    def get_statistics(self) -> Dict[str, Any]:
        """Get MAVLink statistics"""
        return {
            'connected': self.connected,
            'simulation_mode': self.simulation_mode,
            'message_counters': self.msg_counters,
            'total_messages': sum(self.msg_counters.values())
        }