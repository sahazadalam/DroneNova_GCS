import jwt
import time
from datetime import datetime, timedelta
from typing import Optional, Dict, Any

class AuthHandler:
    def __init__(self):
        self.secret_key = "urban_mirtalx_secret_key_2024"
        self.algorithm = "HS256"
    
    def encode_token(self, username: str) -> str:
        """Encode JWT token"""
        payload = {
            'exp': datetime.utcnow() + timedelta(days=1),
            'iat': datetime.utcnow(),
            'sub': username
        }
        return jwt.encode(payload, self.secret_key, algorithm=self.algorithm)
    
    def decode_token(self, token: str) -> Dict[str, Any]:
        """Decode JWT token"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return payload
        except jwt.ExpiredSignatureError:
            raise Exception("Token expired")
        except jwt.InvalidTokenError:
            raise Exception("Invalid token")