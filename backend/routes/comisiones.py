from flask import Blueprint, request
from utils.utilidades import respuesta_api
from utils.errores import APIError
from auth_common.decorador import requires_permission
from schemas.comision_schema import comision_schema, comisiones_schema
from services.comision_service import (
    obtener_count,
    obtener_todos,
    obtener_por_id,
    crear,
    actualizar,
    eliminar
)

comisiones_bp = Blueprint("comisiones_bp", __name__, url_prefix="/comisiones")

@comisiones_bp.route("", methods=["GET"])
@requires_permission("planes.comisiones.ver", "planes.personas.ver_propio", policy="ANY")
def get_comisiones():
    comisiones = obtener_todos()
    data = comisiones_schema.dump(comisiones)

    if len(data) == 0:
        return respuesta_api(True, [], "No se encontraron resultados")

    return respuesta_api(True, data, "Lista de comisiones obtenida")

@comisiones_bp.route("/count", methods=["GET"])
@requires_permission("planes.comisiones.ver")
def get_count():
    count = obtener_count()
    
    data = {
        "cantidad":count
    }
    
    return respuesta_api(True, data, "Conteo de legajos obtenido correctamente")

@comisiones_bp.route("/<int:id>", methods=["GET"])
@requires_permission("planes.comisiones.ver")
def get_comision(id):
    comision = obtener_por_id(id)

    if not comision:
        raise APIError("Comisión no encontrada.", status=404)

    data = comision_schema.dump(comision)
    return respuesta_api(True, data, "Comisión obtenida correctamente")

@comisiones_bp.route("", methods=["POST"])
@requires_permission("planes.comisiones.crear")
def crear_comision():
    req = request.get_json(silent=True) or {}
    nueva_comision = crear(req)
    data = comision_schema.dump(nueva_comision)
    return respuesta_api(True, {"id_comision": data["id_comision"]}, "Comisión creada correctamente", 201)

@comisiones_bp.route("/<int:id>", methods=["PUT"])
@requires_permission("planes.comisiones.editar")
def editar_comision(id):
    comision = obtener_por_id(id)
    
    if not comision:
        raise APIError("Comisión no encontrada.", status=404)
    
    req = request.get_json(silent=True) or {}
    comision_actualizada = actualizar(comision, req)
    data = comision_schema.dump(comision_actualizada)

    return respuesta_api(True, {"id_comision": data["id_comision"]}, "Comisión actualizada correctamente")

@comisiones_bp.route("/<int:id>", methods=["DELETE"])
@requires_permission("planes.comisiones.eliminar")
def eliminar_comision(id):
    comision = obtener_por_id(id)
    
    if not comision:
        raise APIError("Comisión no encontrada.", status=404)
    
    eliminar(comision)
    return respuesta_api(True, {"id_comision": id}, "Comisión eliminada correctamente")