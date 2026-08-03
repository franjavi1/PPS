from flask import Blueprint, request, jsonify

from db import db
from models.aula import Aula
from models.legajo_sedes import LegajoSedes
from models.plan_asignatura import PlanAsignatura
from schemas.sedes_schema import sede_schema, sedes_schema
from auth_common.decorador import requires_permission
from services.sedes_service import (
    obtener_todos,
    obtener_por_id,
    crear,
    actualizar,
    eliminar
)

# Se importa la función de utilidad provista
from utils.utilidades import respuesta_api
# Excepción personalizada para los errores de negocio
from utils.errores import APIError


sedes_bp = Blueprint("sedes_bp", __name__, url_prefix="/sedes")


@sedes_bp.route("", methods=["GET"])
@requires_permission("planes.sedes.ver", "planes.personas.ver_propio", policy="ANY")
def get_sedes():
    sedes = obtener_todos()
    data = sedes_schema.dump(sedes)

    if len(data) == 0:
        return respuesta_api(True, [], "No se encontraron resultados")

    return respuesta_api(True, data, "Lista de sedes obtenida")


@sedes_bp.route("/<int:id>", methods=["GET"])
@requires_permission("planes.sedes.ver")
def get_sede(id):
    sede = obtener_por_id(id)

    if not sede:
        raise APIError("Sede no encontrada.", status=404)

    data = sede_schema.dump(sede)

    return respuesta_api(True, data, "Sede obtenida correctamente")


@sedes_bp.route("", methods=["POST"])
@requires_permission("planes.sedes.crear")
def crear_sede():
    req = request.get_json(silent=True) or {}

    nueva_sede = crear(req)
    data = sede_schema.dump(nueva_sede)

    return respuesta_api(True, {"id": data["id"]}, "Sede creada correctamente", 201)


@sedes_bp.route("/<int:id>", methods=["PUT"])
@requires_permission("planes.sedes.editar")
def editar_sede(id):
    sede = obtener_por_id(id)

    if not sede:
        raise APIError("Sede no encontrada.", status=404)

    req = request.get_json(silent=True) or {}
    sede_actualizada = actualizar(sede, req)
    data = sede_schema.dump(sede_actualizada)

    return respuesta_api(True, {"id": data["id"]}, "Sede actualizada correctamente")


@sedes_bp.route("/<int:id>", methods=["DELETE"])
@requires_permission("planes.sedes.eliminar")
def eliminar_sede(id):
    sede = obtener_por_id(id)

    if not sede:
        raise APIError("Sede no encontrada.", status=404)

    esta_en_uso = (
        Aula.query.filter_by(sedes_id=id, estado=1).first()
        or LegajoSedes.query.filter_by(sede_id=id).first()
        or PlanAsignatura.query.filter_by(sedes_id=id, estado=1).first()
    )

    if esta_en_uso:
        raise APIError("No se puede eliminar una sede asociada a aulas, legajos o planes.", status=409)

    eliminar(sede)

    return respuesta_api(True, {"id": id}, "Sede eliminada correctamente")