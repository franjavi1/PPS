import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    AUTH_COMMON_REDIS_URL = os.getenv("AUTH_COMMON_REDIS_URL", "redis://redis:6379/0") 
    
    # TTL de sesion en segundos
    AUTH_COMMON_SESSION_TTL = int(os.getenv("AUTH_COMMON_SESSION_TTL", 900)) 
    
    # endpoints publicos que no requieren sesion
    AUTH_COMMON_ENDPOINTS_EXCEPTUADOS = [
        "/health",
        "contactos_bp.get_persona_id_from_mail"
        ]

    AUTH_COMMON_SERVICIOS_PERMITIDOS = [
        ip.strip()
        for ip in os.environ.get("AUTH_COMMON_SERVICIOS_PERMITIDOS", "").split(",")
        if ip.strip()
        ]
