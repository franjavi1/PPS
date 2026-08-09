"""
Acceso al estado que guarda AuthCommon.init_app() (cliente de Redis, TTL,
endpoints exceptuados, callback guardar_log) en app.extensions["auth_common"].

Punto único de lectura para decorador.py, sesion_common.py y auditoria.py.
"""

from flask import current_app


def obtener_estado():
    try:
        return current_app.extensions["auth_common"]
    except KeyError:
        raise RuntimeError(
            "AuthCommon no fue inicializado en esta app. "
            "Llamá a AuthCommon(app) (o auth_common_ext.init_app(app)) "
            "antes de usar cualquier función de auth_common."
        ) from None