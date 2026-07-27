"""
Extension de Flask: registra la sesion en Redis y la autorizacion por
endpoint (ver decorador.py). Uso y config keys documentados en el README.
"""

import redis
from flask_jwt_extended import JWTManager

from auth_common.decorador import validar_sesion


class AuthCommon:
    def __init__(self, app=None):
        if app is not None:
            self.init_app(app)

    def init_app(self, app):
        if "flask-jwt-extended" not in app.extensions:
            JWTManager(app)

        redis_url = app.config.get("AUTH_COMMON_REDIS_URL")
        if not redis_url:
            raise RuntimeError(
                "Falta configurar AUTH_COMMON_REDIS_URL en app.config"
            )

        session_ttl = app.config.get("AUTH_COMMON_SESSION_TTL")
        if not session_ttl:
            raise RuntimeError(
                "Falta configurar AUTH_COMMON_SESSION_TTL en app.config"
            )

        endpoints_exceptuados = set(
            app.config.get("AUTH_COMMON_ENDPOINTS_EXCEPTUADOS", [])
        )

        servicios_permitidos = set(
            app.config.get("AUTH_COMMON_SERVICIOS_PERMITIDOS", [])
        )

        if not hasattr(app, "extensions"):
            app.extensions = {}

        app.extensions["auth_common"] = {
            "redis_client": redis.from_url(redis_url, decode_responses=True),
            "session_ttl": session_ttl,
            "endpoints_exceptuados": endpoints_exceptuados,
            "servicios_permitidos": servicios_permitidos,
        }

        app.before_request(validar_sesion)