"""
validar_sesion(): before_request registrado por AuthCommon.init_app()
(ver extension.py).

requires_permission(): decorador de autorizacion por endpoint.
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
    g.acciones = set(sesion["acciones"])
    g.roles = sesion["roles"]

    return None


def requires_permission(*acciones, policy="ALL"):
    """
    Uso y politica ALL/ANY documentados en el README (seccion 5).

    Valida los argumentos al declarar el decorador, no en cada request.
    """

    if not acciones:
        raise ValueError("requires_permission necesita al menos una accion")

    if policy not in ("ALL", "ANY"):
        raise ValueError(f"politica invalida: {policy}. Debe ser 'ALL' o 'ANY'")

    def decorador(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
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