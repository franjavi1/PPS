from flask import Blueprint, request
from schemas.planes_schema import plan_schema, planes_schema
from utils.utilidades import respuesta_api
from auth_common.decorador import requires_permission
from utils.errores import APIError
from services.planes_service import (
    obtener_todos,
    obtener_por_id,
    crear,
    actualizar,
    eliminar
)
# Rutas para el CRUD de planes.
planes_bp = Blueprint("planes_bp", __name__, url_prefix="/planes")


@planes_bp.route("", methods=["GET"])
@requires_permission("micro1.planes.ver")
def get_planes():
    planes = obtener_todos()
    data = planes_schema.dump(planes)

    if len(data) == 0:
        return respuesta_api(True, [], "No se encontraron resultados")

    return respuesta_api(True, data, "Lista de planes obtenida")


@planes_bp.route("/<int:id>", methods=["GET"])
@requires_permission("micro1.planes.ver")
def get_plan(id):
    plan = obtener_por_id(id)

    if not plan:
        raise APIError("Plan no encontrado.", status=404)

    data = plan_schema.dump(plan)

    return respuesta_api(True, data, "Plan obtenido correctamente")


@planes_bp.route("", methods=["POST"])
@requires_permission("micro1.planes.crear")
def crear_planes():
    req = request.get_json(silent=True) or {}
    nuevo_plan = crear(req)
    data = plan_schema.dump(nuevo_plan)

    return respuesta_api(True, {"id": data["id"]}, "Plan creado correctamente", 201)


@planes_bp.route("/<int:id>", methods=["PUT"])
@requires_permission("micro1.planes.editar")
def editar_plan(id):
    plan = obtener_por_id(id)

    if not plan:
        raise APIError("Plan no encontrado.", status=404)

    req = request.get_json(silent=True) or {}
    plan_actualizado = actualizar(plan, req)
    data = plan_schema.dump(plan_actualizado)

    return respuesta_api(True, {"id": data["id"]}, "Plan actualizado correctamente")


@planes_bp.route("/<int:id>", methods=["DELETE"])
@requires_permission("micro1.planes.eliminar")
def eliminar_plan(id):
    plan = obtener_por_id(id)

    if not plan:
        raise APIError("Plan no encontrado.", status=404)

    eliminar(plan)

    return respuesta_api(True, {"id": id}, "Plan dado de baja correctamente")