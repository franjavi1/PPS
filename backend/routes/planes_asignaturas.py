from flask import Blueprint, request
from utils.utilidades import respuesta_api
from db import db

from models.comision_asignatura import ComisionAsignatura
from models.pa_correlativa import PACorrelativa
from schemas.plan_asignatura_schema import plan_asignatura_schema, planes_asignaturas_schema
from services.plan_asignatura_service import (
    obtener_todos,
    obtener_por_id,
    crear,
    actualizar,
    eliminar
)

planes_asignaturas_bp = Blueprint("planes_asignaturas_bp", __name__, url_prefix="/planes-asignaturas")

@planes_asignaturas_bp.route("", methods=["GET"])
def get_planes():
    planes = obtener_todos()
    data = planes_asignaturas_schema.dump(planes)
    if len(data) == 0:
        return respuesta_api(True, [], "No se encontraron resultados")
    return respuesta_api(True, data, "Lista de planes de asignaturas obtenida")

@planes_asignaturas_bp.route("/<int:id>", methods=["GET"])
def get_plan(id):
    plan = obtener_por_id(id)
    if not plan:
        return respuesta_api(False, None, "Registro no encontrado", 404, {"id": "No existe el registro"})
    data = plan_asignatura_schema.dump(plan)
    return respuesta_api(True, data, "Registro obtenido correctamente")

@planes_asignaturas_bp.route("", methods=["POST"])
def crear_plan():
    req = request.get_json(silent=True) or {}
    nuevo_plan = crear(req)
    data = plan_asignatura_schema.dump(nuevo_plan)
    return respuesta_api(True, {"id": data["id"]}, "Registro creado correctamente", 201)

@planes_asignaturas_bp.route("/<int:id>", methods=["PUT"])
def editar_plan(id):
    plan = obtener_por_id(id)
    if not plan:
        return respuesta_api(False, None, "Registro no encontrado", 404, {"id": "No existe el registro"})
    
    req = request.get_json(silent=True) or {}
    plan_actualizado = actualizar(plan, req)
    data = plan_asignatura_schema.dump(plan_actualizado)
    return respuesta_api(True, {"id": data["id"]}, "Registro actualizado correctamente")

@planes_asignaturas_bp.route("/<int:id>", methods=["DELETE"])
def eliminar_plan(id):
    plan = obtener_por_id(id)
    if not plan:
        return respuesta_api(False, None, "Registro no encontrado", 404, {"id": "No existe el registro"})

    # Solo se consultan los identificadores para evitar cargar columnas
    # de Comisión que no son necesarias para esta validación.
    esta_en_comision = db.session.query(
        ComisionAsignatura.id_comision_asignatura
    ).filter(
        ComisionAsignatura.plan_asignaturas_id == id
    ).first()

    esta_en_correlativa = db.session.query(PACorrelativa.id).filter(
        PACorrelativa.pa_id == id
    ).first()

    if esta_en_comision or esta_en_correlativa:
        return respuesta_api(False, None, "No se puede quitar la asignatura del plan", 409, {
            "plan_asignatura": "No se puede quitar una asignatura asociada a comisiones o correlativas"
        })
    
    eliminar(plan)
    return respuesta_api(True, {"id": id}, "Asignatura quitada del plan correctamente")