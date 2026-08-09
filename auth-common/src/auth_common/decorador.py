"""
validar_sesion(): before_request registrado por AuthCommon.init_app()
(ver extension.py).

requires_permission(): decorador de autorizacion por endpoint. Cubre dos
casos distintos:

- Autorizacion de usuario (default): el llamador ya paso por
  validar_sesion, tiene flask.g.acciones cargado, y se chequea si esas
  acciones alcanzan segun policy ALL/ANY.
- Autenticacion de servicio (only_services=True): pensado para endpoints
  internos llamados por otros microservicios, no por usuarios logueados. 
  No hay sesion ni flask.g.acciones, en cambio, se valida la IP de origen del request contra
  AUTH_COMMON_SERVICIOS_PERMITIDOS. 
  El endpoint que use esta variante tiene que estar tambien en AUTH_COMMON_ENDPOINTS_EXCEPTUADOS, si no, validar_sesion lo va a rechazar con 401 antes de llegar a este chequeo.
"""

from functools import wraps

from flask import request, g
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity

from auth_common.sesion_common import obtener_sesion
from auth_common.respuesta_api import respuesta_api
from auth_common.estado import obtener_estado


def validar_sesion():
    """
    Si el endpoint no esta exceptuado (AUTH_COMMON_ENDPOINTS_EXCEPTUADOS),
    valida el access token y la sesion en Redis, y carga flask.g.id_usuario,
    flask.g.acciones (set) y flask.g.roles para el resto de la request.
    """

    if request.method == "OPTIONS":
        return None

    estado = obtener_estado()

    if request.endpoint in estado["endpoints_exceptuados"]:
        return None

    verify_jwt_in_request()
    id_usuario = int(get_jwt_identity())

    sesion = obtener_sesion(id_usuario)

    if sesion is None:
        return respuesta_api(False, [], "Sesión inválida o expirada", 401)

    g.id_usuario = id_usuario
    g.id_persona = int(sesion["id_persona"])
    g.id_legajo = int(sesion["id_legajo"]) if sesion.get("id_legajo") else None
    g.acciones = set(sesion["acciones"])
    g.roles = sesion["roles"]

    return None


def requires_permission(*acciones, policy="ALL", only_services=False):
    """
    Uso y politica ALL/ANY documentados en el README (seccion 5).
    only_services documentado en el README (seccion 5.1).

    Valida los argumentos al declarar el decorador, no en cada request.
    """

    if only_services:
        if acciones:
            raise ValueError(
                "requires_permission(only_services=True) no acepta acciones: "
                "es un chequeo de identidad de servicio, no de permisos de "
                "usuario."
            )
    else:
        if not acciones:
            raise ValueError("requires_permission necesita al menos una accion")

        if policy not in ("ALL", "ANY"):
            raise ValueError(f"politica invalida: {policy}. Debe ser 'ALL' o 'ANY'")

    def decorador(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            if only_services:
                estado = obtener_estado()
                ip_origen = request.remote_addr

                if ip_origen not in estado["servicios_permitidos"]:
                    return respuesta_api(
                        False, [],
                        "Este endpoint es exclusivo para microservicios internos",
                        403,
                    )

                return fn(*args, **kwargs)

            acciones_usuario = getattr(g, "acciones", set())

            if policy == "ALL":
                autorizado = all(a in acciones_usuario for a in acciones)
            else:
                autorizado = any(a in acciones_usuario for a in acciones)

            if not autorizado:
                return respuesta_api(False, [], "No tenes permiso para realizar esta accion", 403)

            return fn(*args, **kwargs)
        return wrapper
    return decorador