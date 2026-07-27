from flask import Blueprint, request
from schemas.pa_correlativa_schema import pa_correlativa_schema, pa_correlativas_schema
from utils.utilidades import respuesta_api
from utils.errores import APIError
from auth_common.decorador import requires_permission
from services.pa_correlativa_service import (
    obtener_todos,
    obtener_por_id,
    crear,
    actualizar,
    eliminar
)

pa_correlativas_bp = Blueprint("pa_correlativas_bp", __name__, url_prefix="/pa-correlativas")

@pa_correlativas_bp.route("", methods=["GET"])
@requires_permission("planes.pa_correlativas.ver")
def get_pa_correlativas():
    relaciones = obtener_todos()
    data = pa_correlativas_schema.dump(relaciones)

    if len(data) == 0:
        return respuesta_api(True, [], "No se encontraron resultados")

    return respuesta_api(True, data, "Lista de PA Correlativas obtenida")

@pa_correlativas_bp.route("/<int:id>", methods=["GET"])
@requires_permission("planes.pa_correlativas.ver")
def get_pa_correlativa(id):
    relacion = obtener_por_id(id)

    if not relacion:
        raise APIError("Registro no encontrado", status=404)

    data = pa_correlativa_schema.dump(relacion)
    return respuesta_api(True, data, "Registro obtenido correctamente")

@pa_correlativas_bp.route("", methods=["POST"])
@requires_permission("planes.pa_correlativas.crear")
def crear_pa_correlativa():
    req = request.get_json(silent=True) or {}
    nueva_relacion = crear(req)
    data = pa_correlativa_schema.dump(nueva_relacion)
    return respuesta_api(True, {"id": data["id"]}, "Registro creado correctamente", 201)

@pa_correlativas_bp.route("/<int:id>", methods=["PUT"])
@requires_permission("planes.pa_correlativas.editar")
def editar_pa_correlativa(id):
    relacion = obtener_por_id(id)
    
    if not relacion:
        raise APIError("Registro no encontrado", status=404)
    
    req = request.get_json(silent=True) or {}
    relacion_actualizada = actualizar(relacion, req)
    data = pa_correlativa_schema.dump(relacion_actualizada)

    return respuesta_api(True, {"id": data["id"]}, "Registro actualizado correctamente")

@pa_correlativas_bp.route("/<int:id>", methods=["DELETE"])
@requires_permission("planes.pa_correlativas.eliminar")
def eliminar_pa_correlativa(id):
    relacion = obtener_por_id(id)
    
    if not relacion:
        raise APIError("Registro no encontrado", status=404)
    
    eliminar(relacion)
    return respuesta_api(True, {"id": id}, "Registro eliminado correctamente")