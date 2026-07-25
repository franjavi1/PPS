import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Auth Common Configuration
    AUTH_COMMON_REDIS_URL = os.getenv("AUTH_COMMON_REDIS_URL", "redis://redis:6379/0")
    AUTH_COMMON_SESSION_TTL = int(os.getenv("AUTH_COMMON_SESSION_TTL", 900))
    AUTH_COMMON_ENDPOINTS_EXCEPTUADOS = ["health", "login"]
    
    # JWT Configuration
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "tu_secreto_compartido_con_auth")