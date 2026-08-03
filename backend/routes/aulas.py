from flask import Blueprint, request
from db import db
from models.comision_asignatura import ComisionAsignatura
from auth_common.decorador import requires_permission
from schemas.aula_schema import aula_schema, aulas_schema
from services.aula_service import (
    obtener_todos,
    obtener_por_id,
    crear,
    actualizar,
    eliminar
)
from utils.utilidades import respuesta_api
from utils.errores import APIError

aulas_bp = Blueprint("aulas_bp", __name__, url_prefix="/aulas")

@aulas_bp.route("", methods=["GET"])
@requires_permission("planes.aulas.ver")
def get_aulas():
    aulas = obtener_todos()
    data = aulas_schema.dump(aulas)

    if len(data) == 0:
        return respuesta_api(True, [], "No se encontraron resultados")

    return respuesta_api(True, data, "Lista de aulas obtenida")

@aulas_bp.route("/<int:id>", methods=["GET"])
@requires_permission("planes.aulas.ver")
def get_aula(id):
    aula = obtener_por_id(id)

    if not aula or aula.tsBaja is not None:
        raise APIError("Aula no encontrada.", status=404)

    data = aula_schema.dump(aula)
    return respuesta_api(True, data, "Aula obtenida correctamente")

@aulas_bp.route("", methods=["POST"])
@requires_permission("planes.aulas.crear")
def crear_aula():
    req = request.get_json(silent=True) or {}
    nueva_aula = crear(req)
    data = aula_schema.dump(nueva_aula)
    return respuesta_api(True, {"id_aula": data["id_aula"]}, "Aula creada correctamente", 201)

@aulas_bp.route("/<int:id>", methods=["PUT"])
@requires_permission("planes.aulas.editar")
def editar_aula(id):
    aula = obtener_por_id(id)
    
    if not aula:
        raise APIError("Aula no encontrada.", status=404)
    
    req = request.get_json(silent=True) or {}
    aula_actualizada = actualizar(aula, req)
    data = aula_schema.dump(aula_actualizada)

    return respuesta_api(True, {"id_aula": data["id_aula"]}, "Aula actualizada correctamente")

@aulas_bp.route("/<int:id>", methods=["DELETE"])
@requires_permission("planes.aulas.eliminar")
def eliminar_aula(id):
    aula = obtener_por_id(id)
    
    if not aula:
        raise APIError("Aula no encontrada.", status=404)

    esta_en_uso = ComisionAsignatura.query.filter_by(aula_id=id).first()

    if esta_en_uso:
        raise APIError("No se puede eliminar un aula asociada a comisiones.", status=409)

    eliminar(aula)
    return respuesta_api(True, {"id_aula": id}, "Aula eliminada correctamente")