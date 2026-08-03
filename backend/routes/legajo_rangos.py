from flask import Blueprint, request, jsonify
from utils.utilidades import respuesta_api
from utils.errores import APIError
from auth_common.decorador import requires_permission
from schemas.legajo_rangos_schema import legajo_rangos_schema, legajos_rangos_schema

from services.legajo_rangos_service import (
    obtener_todos,
    obtener_por_id,
    crear,
    actualizar,
    eliminar
)


legajo_rangos_bp = Blueprint("legajo_rangos_bp", __name__, url_prefix="/legajo-rangos")


@legajo_rangos_bp.route("", methods=["GET"])
@requires_permission("planes.legajo_rangos.ver", "planes.personas.ver_propio", policy="ANY")
def get_legajos_rangos():
    legajos_rangos = obtener_todos()
    data = legajos_rangos_schema.dump(legajos_rangos)

    if len(data) == 0:
        return respuesta_api(True, [], "No se encontraron resultados")

    return respuesta_api(True, data, "Lista de legajos rangos obtenida")


@legajo_rangos_bp.route("/<int:id>", methods=["GET"])
@requires_permission("planes.legajo_rangos.ver")
def get_legajo_rangos(id):
    legajo_rangos = obtener_por_id(id)

    if not legajo_rangos:
        raise APIError("No existe un legajo rango con ese id", status=404)

    data = legajo_rangos_schema.dump(legajo_rangos)

    return respuesta_api(True, data, "Legajo rango obtenido correctamente")


@legajo_rangos_bp.route("", methods=["POST"])
@requires_permission("planes.legajo_rangos.crear")
def crear_legajo_rangos():
    req = request.get_json(silent=True) or {}

    nuevo_legajo_rangos = crear(req)
    data = legajo_rangos_schema.dump(nuevo_legajo_rangos)

    return respuesta_api(True, {"id": data["id"]}, "Legajo rango creado correctamente", 201)


@legajo_rangos_bp.route("/<int:id>", methods=["PUT"])
@requires_permission("planes.legajo_rangos.editar")
def editar_legajo_rangos(id):
    legajo_rangos = obtener_por_id(id)

    if not legajo_rangos:
        raise APIError("No existe un legajo rango con ese id", status=404)

    req = request.get_json(silent=True) or {}
    legajo_rangos_actualizado = actualizar(legajo_rangos, req)
    data = legajo_rangos_schema.dump(legajo_rangos_actualizado)

    return respuesta_api(True, {"id": data["id"]}, "Legajo rango actualizado correctamente")


@legajo_rangos_bp.route("/<int:id>", methods=["DELETE"])
@requires_permission("planes.legajo_rangos.eliminar")
def eliminar_legajo_rangos(id):
    legajo_rangos = obtener_por_id(id)

    if not legajo_rangos:
        raise APIError("No existe un legajo rango con ese id", status=404)

    eliminar(legajo_rangos)

    return respuesta_api(True, {"id": id}, "Legajo rango eliminado correctamente")