from flask import Blueprint, jsonify, request

from schemas.autoridad_comision_schema import (
    autoridad_comision_schema,
    autoridades_comision_schema
)
from services.autoridad_comision_service import (
    actualizar,
    crear,
    eliminar,
    obtener_por_id,
    obtener_todos
)
from utils.utilidades import respuesta_api


autoridades_comision_bp = Blueprint(
    "autoridades_comision_bp",
    __name__,
    url_prefix="/autoridades-comision"
)


@autoridades_comision_bp.route("", methods=["GET"])
def get_autoridades_comision():
    autoridades_comision = obtener_todos()
    data = autoridades_comision_schema.dump(autoridades_comision)

    if len(data) == 0:
        return respuesta_api(True, [], "No se encontraron resultados")

    return respuesta_api(True, data, "Lista de autoridades de comision obtenida")


@autoridades_comision_bp.route("/<int:id>", methods=["GET"])
def get_autoridad_comision(id):
    autoridad_comision = obtener_por_id(id)

    if not autoridad_comision:
        from utils.errores import APIError
        raise APIError("Autoridad de comision no encontrada.", status=404)

    data = autoridad_comision_schema.dump(autoridad_comision)

    return respuesta_api(True, data, "Autoridad de comision obtenida correctamente")


@autoridades_comision_bp.route("", methods=["POST"])
def crear_autoridad_comision():
    req = request.get_json(silent=True) or {}

    nueva_autoridad_comision = crear(req)
    data = autoridad_comision_schema.dump(nueva_autoridad_comision)

    return respuesta_api(
        True,
        {"id": data["id"]},
        "Autoridad de comision creada correctamente",
        201
    )


@autoridades_comision_bp.route("/<int:id>", methods=["PUT"])
def editar_autoridad_comision(id):
    autoridad_comision = obtener_por_id(id)

    if not autoridad_comision:
        from utils.errores import APIError
        raise APIError("Autoridad de comision no encontrada.", status=404)

    req = request.get_json(silent=True) or {}
    autoridad_comision_actualizada = actualizar(autoridad_comision, req)
    data = autoridad_comision_schema.dump(autoridad_comision_actualizada)

    return respuesta_api(
        True,
        {"id": data["id"]},
        "Autoridad de comision actualizada correctamente"
    )


@autoridades_comision_bp.route("/<int:id>", methods=["DELETE"])
def eliminar_autoridad_comision(id):
    autoridad_comision = obtener_por_id(id)

    if not autoridad_comision:
        from utils.errores import APIError
        raise APIError("Autoridad de comision no encontrada.", status=404)

    eliminar(autoridad_comision)

    return respuesta_api(
        True,
        {"id": id},
        "Autoridad de comision eliminada correctamente"
    )