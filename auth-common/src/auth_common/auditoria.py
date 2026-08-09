"""
Auditoria de requests: antes_de_auditar(), despues_de_auditar() y
auditar_excepcion() son registrados por AuthCommon.init_app() (ver
extension.py) como before_request, after_request y teardown_request
respectivamente, igual que validar_sesion() en decorador.py.

antes_de_auditar guarda el timestamp de inicio y un request_id (UUID) en
flask.g. despues_de_auditar arma el evento (usando flask.g.id_usuario/
roles si validar_sesion ya corrio antes), lo sanitiza, y lo pasa a la
funcion guardar_log() que cada servicio registro en
AuthCommon(app, guardar_log=...). 
auditar_excepcion es un respaldo que corre siempre (con o sin excepcion, incluso si after_request nunca llego a ejecutarse) y guarda un evento minimo solo si hubo una excepcion
no controlada y despues_de_auditar todavia no guardo nada para este
request (evita duplicar la fila via g.auditoria_guardada).
"""

import time
import uuid

from flask import request, g

from auth_common.estado import obtener_estado

CAMPOS_SENSIBLES = {
    "password",
    "contrasena",
    "contraseña",
    "clave",
    "token",
    "access_token",
    "refresh_token",
    "authorization",
}

def sanitizar(datos):
    """
    Reemplaza por "***" cualquier valor cuya clave este en
    CAMPOS_SENSIBLES, recorriendo dicts y listas anidadas.
    """
    if isinstance(datos, dict):
        resultado = {}
        for clave, valor in datos.items():
            if clave.lower() in CAMPOS_SENSIBLES:
                resultado[clave] = "***"
            else:
                resultado[clave] = sanitizar(valor)
        return resultado

    if isinstance(datos, list):
        return [sanitizar(item) for item in datos]

    return datos


def antes_de_auditar():
    g.auditoria_inicio = time.monotonic()
    g.auditoria_request_id = str(uuid.uuid4())


def obtener_body_para_auditoria(get_json_fn, content_type, get_data_fn, content_length=None):
    """
    Devuelve lo que se va a guardar en request_body/response_body.

    Si el content-type es JSON, devuelve el dict sanitizado. Si no
    (ej. multipart/form-data con un archivo), devuelve metadata liviana
    en vez de descartar el campo entero: asi no se pierde del todo la
    trazabilidad de que hubo un archivo.

    Para multipart, se usa content_length (el header Content-Length que mando el cliente) en su lugar, cuando esta disponible.
    """
    if content_type and "application/json" in content_type:
        datos = get_json_fn(silent=True)
        return sanitizar(datos) if datos else None

    if content_length:
        tamano_bytes = content_length
    else:
        datos_crudos = get_data_fn()
        tamano_bytes = len(datos_crudos) if datos_crudos else 0

    return {
        "tipo_contenido": content_type or "desconocido",
        "tamano_bytes": tamano_bytes,
    }


def despues_de_auditar(response):
    try:
        _despues_de_auditar(response)
    except Exception as error:
        # La auditoria nunca debe romper la respuesta real. Un fallo
        # aca (bug propio, guardar_log que explota, etc) se
        # loguea y se sigue de largo.
        print(f"[AUDITORIA] Error procesando el evento: {error}", flush=True)

    return response


def _despues_de_auditar(response):
    if request.method == "OPTIONS":
        return

    inicio = getattr(g, "auditoria_inicio", None)
    if inicio is None:
        # antes_de_auditar no corrio para este request. Puede pasar si
        # AuthCommon.init_app() no llego a registrar el before_request
        # (ver extension.py), o si Flask corta el request antes de
        # llegar a los before_request (ej. 404 de ruta inexistente).
        # Se loguea porque, a diferencia de un evento que se arma bien
        # y despues falla al guardarse, este caso significa que la
        # auditoria no esta activa en absoluto para este request.
        print(
            f"[AUDITORIA] antes_de_auditar no corrio para {request.method} {request.path}, se omite el evento",
            flush=True,
        )
        return

    duracion_ms = int((time.monotonic() - inicio) * 1000)

    request_body = obtener_body_para_auditoria(
        request.get_json, request.content_type, request.get_data,
        content_length=request.content_length,
    )
    response_body = obtener_body_para_auditoria(
        response.get_json, response.content_type, response.get_data
    )

    evento = {
        "request_id": g.auditoria_request_id,
        "metodo_http": request.method,
        "endpoint": request.endpoint,
        "path": request.path,
        "query_params": sanitizar(request.args.to_dict()),
        "request_body": request_body,
        "response_body": response_body,
        "status_code": response.status_code,
        "duracion_ms": duracion_ms,
        "ip_origen": request.remote_addr,
        "user_agent": request.headers.get("User-Agent"),
        "id_usuario": getattr(g, "id_usuario", None),
        "roles": getattr(g, "roles", None),
        "error_type": None,
        "error_message": None,
    }

    estado = obtener_estado()
    guardar_log = estado.get("guardar_log")

    if guardar_log is None:
        print(
            f"[AUDITORIA] guardar_log no fue configurado en {request.endpoint}, se descarta el evento",
            flush=True,
        )
        return

    guardar_log(evento)
    g.auditoria_guardada = True


def auditar_excepcion(exception=None):
    """
    Respaldo de despues_de_auditar para excepciones no controladas que
    impiden que after_request corra normalmente.
    teardown_request se ejecuta siempre, con o sin excepcion, incluso si after_request nunca
    llego a correr.

    No hace nada si el evento de este request ya fue guardado por
    despues_de_auditar (chequea g.auditoria_guardada), para no duplicar
    la fila.
    """
    try:
        _auditar_excepcion(exception)
    except Exception as error:
        print(f"[AUDITORIA] Error en teardown_request: {error}", flush=True)


def _auditar_excepcion(exception):
    if getattr(g, "auditoria_guardada", False):
        # despues_de_auditar ya guardo el evento de este request.
        return

    if exception is None:
        # No hubo excepcion y despues_de_auditar no guardo nada: ya se
        # loguea ese caso desde ahi (ej. antes_de_auditar no corrio por
        # un 404 de ruta inexistente). No hay nada mas que hacer aca.
        return

    inicio = getattr(g, "auditoria_inicio", None)
    if inicio is None:
        # No hay forma de calcular duracion_ms ni de saber que este
        # request paso por auditoria en absoluto. No se arma el evento.
        print(
            f"[AUDITORIA] Excepcion no controlada sin auditoria activa en {request.method} {request.path}: {exception}",
            flush=True,
        )
        return

    duracion_ms = int((time.monotonic() - inicio) * 1000)

    evento = {
        "request_id": getattr(g, "auditoria_request_id", str(uuid.uuid4())),
        "metodo_http": request.method,
        "endpoint": request.endpoint,
        "path": request.path,
        "query_params": sanitizar(request.args.to_dict()),
        "request_body": obtener_body_para_auditoria(
            request.get_json, request.content_type, request.get_data,
            content_length=request.content_length,
        ),
        # No hay response real: Flask no llego a generar una. Se asume
        # 500 porque es el desenlace tipico de una excepcion no
        # controlada.
        "response_body": None,
        "status_code": 500,
        "duracion_ms": duracion_ms,
        "ip_origen": request.remote_addr,
        "user_agent": request.headers.get("User-Agent"),
        "id_usuario": getattr(g, "id_usuario", None),
        "roles": getattr(g, "roles", None),
        "error_type": type(exception).__name__,
        "error_message": str(exception)[:500],
    }

    estado = obtener_estado()
    guardar_log = estado.get("guardar_log")

    if guardar_log is None:
        print(
            f"[AUDITORIA] guardar_log no fue configurado en {request.endpoint}, se descarta el evento de excepcion",
            flush=True,
        )
        return

    guardar_log(evento)
    g.auditoria_guardada = True