from flask import Blueprint, request, jsonify
from utils.utilidades import respuesta_api
from utils.errores import APIError
from auth_common.decorador import requires_permission
from models.legajo_rangos import LegajoRangos
from models.plan_asignatura import PlanAsignatura
from schemas.rangos_institucionales_schema import (
    rango_institucional_schema,
    rangos_institucionales_schema
)

from services.rangos_institucionales_service import (
    obtener_todos,
    obtener_por_id,
    crear,
    actualizar,
    eliminar
)


rangos_institucionales_bp = Blueprint(
    "rangos_institucionales_bp", __name__, url_prefix="/rangos-institucionales")


@rangos_institucionales_bp.route("", methods=["GET"])
@requires_permission("planes.rangos_institucionales.ver", "planes.personas.ver_propio", policy="ANY")
def get_rangos_institucionales():
    rangos = obtener_todos()
    data = rangos_institucionales_schema.dump(rangos)

    if len(data) == 0:
        return respuesta_api(True, [], "No se encontraron resultados")

    return respuesta_api(True, data, "Lista de rangos institucionales obtenida")


@rangos_institucionales_bp.route("/<int:id>", methods=["GET"])
@requires_permission("planes.rangos_institucionales.ver")
def get_rango_institucional(id):
    rango = obtener_por_id(id)

    if not rango:
        raise APIError("Rango institucional no encontrado.", status=404)

    data = rango_institucional_schema.dump(rango)

    return respuesta_api(True, data, "Rango institucional obtenido correctamente")


@rangos_institucionales_bp.route("", methods=["POST"])
@requires_permission("planes.rangos_institucionales.crear")
def crear_rango_institucional():
    req = request.get_json(silent=True) or {}

    nuevo_rango = crear(req)
    data = rango_institucional_schema.dump(nuevo_rango)

    return respuesta_api(True, {"id": data["id"]}, "Rango institucional creado correctamente", 201)


@rangos_institucionales_bp.route("/<int:id>", methods=["PUT"])
@requires_permission("planes.rangos_institucionales.editar")
def editar_rango_institucional(id):
    rango = obtener_por_id(id)

    if not rango:
        raise APIError("Rango institucional no encontrado.", status=404)

    req = request.get_json(silent=True) or {}
    rango_actualizado = actualizar(rango, req)
    data = rango_institucional_schema.dump(rango_actualizado)

    return respuesta_api(True, {"id": data["id"]}, "Rango institucional actualizado correctamente")


@rangos_institucionales_bp.route("/<int:id>", methods=["DELETE"])
@requires_permission("planes.rangos_institucionales.eliminar")
def eliminar_rango_institucional(id):
    rango = obtener_por_id(id)

    if not rango:
        raise APIError("Rango institucional no encontrado.", status=404)

    esta_en_uso = (
        LegajoRangos.query.filter_by(rangos_institucionales_id=id).first()
        or PlanAsignatura.query.filter_by(rango_minimo_id=id, estado=1).first()
    )

    if esta_en_uso:
        raise APIError("No se puede eliminar un rango asociado a legajos o planes.", status=409)

    eliminar(rango)

    return respuesta_api(True, {"id": id}, "Rango institucional eliminado correctamente")