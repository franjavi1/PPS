from flask import Blueprint, request, jsonify
from flask import request, g
from utils.utilidades import respuesta_api
from utils.errores import APIError
from schemas.persona_schema import persona_schema, personas_schema
from auth_common.decorador import requires_permission
from services.persona_service import (
    obtener_todos,
    obtener_por_id,
    obtener_por_id_sin_filtrar_estado,
    crear,
    actualizar,
    eliminar,
    reactivar
)

personas_bp = Blueprint("personas_bp", __name__, url_prefix="/personas")


@personas_bp.route("", methods=["GET"])
@requires_permission("planes.personas.ver")
def get_personas():
    estado = request.args.get("estado", default=1, type=int)

    if estado not in (0, 1):
        raise APIError("Estado no valido", status=400)

    personas = obtener_todos(estado)
    data = personas_schema.dump(personas)

    if len(data) == 0:
        return respuesta_api(True, [], "No se encontraron resultados")

    return respuesta_api(True, data, "Lista de personas obtenida")


@personas_bp.route("/<int:id>", methods=["GET"])
@requires_permission("planes.personas.ver", "planes.personas.ver_propio", policy="ANY")
def get_persona(id):
    tiene_acceso_total = "planes.personas.ver" in g.acciones
    es_su_propia_persona = id == getattr(g, "id_persona", None)

    if not tiene_acceso_total and not es_su_propia_persona:
        raise APIError("No tenes permiso para ver esta persona", status=403)

    persona = obtener_por_id(id)

    if not persona:
        raise APIError("Persona no encontrada", status=404)

    data = persona_schema.dump(persona)

    return respuesta_api(True, data, "Persona obtenida correctamente")

@personas_bp.route("", methods=["POST"])
@requires_permission("planes.personas.crear")
def crear_persona():
    req = request.get_json(silent=True) or {}
    nueva_persona = crear(req)
    data = persona_schema.dump(nueva_persona)
    return respuesta_api(True, {"id": data["id"]}, "Persona creada correctamente", 201)


@personas_bp.route("/<int:id>", methods=["PUT"])
@requires_permission("planes.personas.editar")
def editar_persona(id):

    persona = obtener_por_id(id)
    
    if not persona:
        raise APIError("Persona no encontrada", status=404)
        
    req = request.get_json(silent=True) or {}
    persona_actualizada = actualizar(persona, req)
    data = persona_schema.dump(persona_actualizada)

    return respuesta_api(True, {"id": data["id"]}, "Persona actualizada correctamente")


@personas_bp.route("/<int:id>", methods=["DELETE"])
@requires_permission("planes.personas.eliminar")
def eliminar_persona(id):
    persona = obtener_por_id(id)
    
    if not persona:
        raise APIError("Persona no encontrada", status=404)

    eliminar(persona)

    return respuesta_api(True, {"id": id}, "Persona dada de baja correctamente")


@personas_bp.route("/<int:id>/reactivar", methods=["PATCH"])
def reactivar_persona(id):
    persona = obtener_por_id_sin_filtrar_estado(id)

    if not persona or persona.estado != 0:
        raise APIError("Persona inactiva no encontrada", status=404)

    reactivar(persona)

    return respuesta_api(True, {"id": id}, "Persona reactivada correctamente")