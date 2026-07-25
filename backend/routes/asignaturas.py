from flask import Blueprint, request
from models.pa_correlativa import PACorrelativa
from models.plan_asignatura import PlanAsignatura
from schemas.asignaturas_schema import asignatura_schema, asignaturas_schema
from utils.errores import APIError
from utils.utilidades import respuesta_api

from services.asignaturas_service import (
    obtener_todos,
    obtener_por_id,
    crear,
    actualizar,
    eliminar
)

# Rutas para el CRUD de asignaturas
asignaturas_bp = Blueprint("asignaturas_bp", __name__, url_prefix="/asignaturas")


@asignaturas_bp.route("", methods=["GET"])
def get_asignaturas():
    asignaturas = obtener_todos()
    data = asignaturas_schema.dump(asignaturas)

    if not data:
        return respuesta_api(success=True, data=[], message="No se encontraron resultados", status=200)

    return respuesta_api(success=True, data=data, message="Lista de asignaturas obtenida", status=200)


@asignaturas_bp.route("/<int:id>", methods=["GET"])
def get_asignatura(id):
    asignatura = obtener_por_id(id)

    if not asignatura:
        raise APIError("Asignatura no encontrada.", status=404)

    data = asignatura_schema.dump(asignatura)
    return respuesta_api(success=True, data=data, message="Asignatura obtenida correctamente", status=200)


@asignaturas_bp.route("", methods=["POST"])
def crear_asignatura():
    req = request.get_json(silent=True) or {}
    nueva_asignatura = crear(req)
    data = asignatura_schema.dump(nueva_asignatura)

    return respuesta_api(success=True, data={"id": data["id"]}, message="Asignatura creada correctamente", status=201)


@asignaturas_bp.route("/<int:id>", methods=["PUT"])
def editar_asignatura(id):
    asignatura = obtener_por_id(id)

    if not asignatura:
        raise APIError("Asignatura no encontrada.", status=404)

    req = request.get_json(silent=True) or {}
    asignatura_actualizada = actualizar(asignatura, req)
    data = asignatura_schema.dump(asignatura_actualizada)

    return respuesta_api(success=True, data={"id": data["id"]}, message="Asignatura actualizada correctamente", status=200)


@asignaturas_bp.route("/<int:id>", methods=["DELETE"])
def eliminar_asignatura(id):
    asignatura = obtener_por_id(id)

    if not asignatura:
        raise APIError("Asignatura no encontrada.", status=404)

    esta_en_plan = PlanAsignatura.query.filter_by(
        asignatura_id=id,
        estado=1,
    ).first()

    esta_en_correlativa = PACorrelativa.query.filter_by(asignatura_id=id).first()

    if esta_en_plan or esta_en_correlativa:
        raise APIError("No se puede eliminar una asignatura asociada a un plan o correlativa.", status=409)

    eliminar(asignatura)

    return respuesta_api(success=True, data={"id": id}, message="Asignatura dada de baja correctamente", status=200)