"""
Operaciones sobre la sesion de usuario en Redis.

session:{id_usuario}  -> Hash (roles, acciones, refresh_jti, id_persona)

Modelo de sesion unica por usuario: un segundo login sobreescribe
directamente el mismo Hash con HSET, no crea una sesion aparte.
"""

import json

from auth_common.estado import obtener_estado


def clave_sesion(id_usuario):
    return f"session:{id_usuario}"


def crear_sesion(id_usuario, roles, acciones, refresh_jti, id_persona):
    estado = obtener_estado()
    clave = clave_sesion(id_usuario)

    estado["redis_client"].hset(clave, mapping={
        "roles": json.dumps(roles),
        "acciones": json.dumps(acciones),
        "refresh_jti": refresh_jti,
        "id_persona": str(id_persona),
    })
    estado["redis_client"].expire(clave, estado["session_ttl"])


def obtener_sesion(id_usuario):
    estado = obtener_estado()
    datos = estado["redis_client"].hgetall(clave_sesion(id_usuario))

    if not datos:
        return None

    return {
        "roles": json.loads(datos["roles"]),
        "acciones": json.loads(datos["acciones"]),
        "refresh_jti": datos["refresh_jti"],
        "id_persona": datos["id_persona"],
    }


def renovar_sesion(id_usuario):
    # Renueva el TTL de la sesion (mismo valor que al crearla).
    # True si la sesion existia y se renovo, False si ya no existia.
    estado = obtener_estado()
    return bool(
        estado["redis_client"].expire(clave_sesion(id_usuario), estado["session_ttl"])
    )


def actualizar_permisos_sesion(id_usuario, roles, acciones):
    """
    Sobrescribe roles/acciones de una sesion existente, sin tocar
    refresh_jti, id_persona ni el TTL. Devuelve False si la sesion no
    existia (se actualiza sola en el proximo login).

    El chequeo de existencia es necesario: HSET crea la key si no existe,
    y eso dejaria en Redis un hash de sesion sin TTL para un usuario sin
    sesion activa.
    """
    
    estado = obtener_estado()
    clave = clave_sesion(id_usuario)

    if not estado["redis_client"].exists(clave):
        return False

    estado["redis_client"].hset(clave, mapping={
        "roles": json.dumps(roles),
        "acciones": json.dumps(acciones),
    })
    return True


def eliminar_sesion(id_usuario):
    estado = obtener_estado()
    estado["redis_client"].delete(clave_sesion(id_usuario))