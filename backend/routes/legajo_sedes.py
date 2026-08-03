from flask import Blueprint, request
from schemas.legajo_sedes_schema import legajo_sedes_schema
from utils.utilidades import respuesta_api
from utils.errores import APIError
from auth_common.decorador import requires_permission
from services.legajo_sedes_service import (
    obtener_todos,
    obtener_por_id,
    crear,
    actualizar,
    eliminar
)


legajo_sedes_bp = Blueprint("legajo_sedes_bp", __name__, url_prefix="/legajo-sedes")


@legajo_sedes_bp.route("", methods=["GET"])
@requires_permission("planes.legajo_sedes.ver", "planes.personas.ver_propio", policy="ANY")
def get_legajos_sedes():
    legajos_sedes = obtener_todos()
    data = legajo_sedes_schema.dump(legajos_sedes)

    if len(data) == 0:
        return respuesta_api(True, [], "No se encontraron resultados")

    return respuesta_api(True, data, "Lista de legajos sedes obtenida")


@legajo_sedes_bp.route("/<int:id>", methods=["GET"])
@requires_permission("planes.legajo_sedes.ver")
def get_legajo_sedes(id):
    legajo_sedes = obtener_por_id(id)

    if not legajo_sedes:
        raise APIError("No existe un legajo sede con ese id", status=404)

    data = legajo_sedes_schema.dump(legajo_sedes)

    return respuesta_api(True, data, "Legajo sede obtenido correctamente")


@legajo_sedes_bp.route("", methods=["POST"])
@requires_permission("planes.legajo_sedes.crear")
def crear_legajo_sedes():
    req = request.get_json(silent=True) or {}

    nuevo_legajo_sedes = crear(req)
    data = legajo_sedes_schema.dump(nuevo_legajo_sedes)

    return respuesta_api(True, {"id": data["id"]}, "Legajo sede creado correctamente", 201)


@legajo_sedes_bp.route("/<int:id>", methods=["PUT"])
@requires_permission("planes.legajo_sedes.editar")
def editar_legajo_sedes(id):
    legajo_sedes = obtener_por_id(id)

    if not legajo_sedes:
        raise APIError("No existe un legajo sede con ese id", status=404)

    req = request.get_json(silent=True) or {}
    legajo_sedes_actualizado = actualizar(legajo_sedes, req)
    data = legajo_sedes_schema.dump(legajo_sedes_actualizado)

    return respuesta_api(True, {"id": data["id"]}, "Legajo sede actualizado correctamente")


@legajo_sedes_bp.route("/<int:id>", methods=["DELETE"])
@requires_permission("planes.legajo_sedes.eliminar")
def eliminar_legajo_sedes(id):
    legajo_sedes = obtener_por_id(id)

    if not legajo_sedes:
        raise APIError("No existe un legajo sede con ese id", status=404)

    eliminar(legajo_sedes)

    return respuesta_api(True, {"id": id}, "Legajo sede eliminado correctamente")