"""
Lectura de la sesion de usuario en Redis, compartida por todos los
microservicios que instalan auth_common.

session:{id_usuario}  -> Hash (roles, acciones, refresh_jti, id_persona)

La escritura de sesiones (crear, renovar, actualizar permisos, eliminar)
es responsabilidad exclusiva de Auth, que es el unico servicio que hace
login/logout/refresh y cambios de rol. Vive del lado de Auth, no en este paquete.
"""

import json

from auth_common.estado import obtener_estado


def clave_sesion(id_usuario):
    return f"session:{id_usuario}"


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