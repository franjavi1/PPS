from flask import g
from auth_common.sesion_common import obtener_sesion


def cargar_id_persona():
    if hasattr(g, "id_usuario"):
        sesion = obtener_sesion(g.id_usuario)
        if sesion:
            g.id_persona = int(sesion["id_persona"])