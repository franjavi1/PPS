from flask import Blueprint, request
from utils.utilidades import respuesta_api
from utils.errores import APIError
from auth_common.decorador import requires_permission
from schemas.contactos_schema import contacto_schema, contactos_schema
from flask import request, g

from services.contactos_service import (
    obtener_todos,
    obtener_por_id,
    crear,
    actualizar,
    eliminar,
    obtener_personaid_por_email
)


contactos_bp = Blueprint("contactos_bp", __name__, url_prefix="/contactos")


@contactos_bp.route("", methods=["GET"])
@requires_permission("planes.contactos.ver")
def get_contactos():
    contactos = obtener_todos()
    data = contactos_schema.dump(contactos)

    if len(data) == 0:
        return respuesta_api(True, [], "No se encontraron resultados")

    return respuesta_api(True, data, "Lista de contactos obtenida")


@contactos_bp.route("/<int:id>", methods=["GET"])
@requires_permission("planes.contactos.ver", "planes.contactos.ver_propio", policy="ANY")
def get_contacto(id):
    contacto = obtener_por_id(id)

    if not contacto:
        raise APIError("Contacto no encontrado.", status=404)

    tiene_acceso_total = "planes.contactos.ver" in g.acciones
    es_propio = contacto.persona_id == g.id_persona

    if not tiene_acceso_total and not es_propio:
        raise APIError("No tenes permiso para ver este contacto", status=403)

    data = contacto_schema.dump(contacto)

    return respuesta_api(True, data, "Contacto obtenido correctamente")


@contactos_bp.route("", methods=["POST"])
@requires_permission("planes.contactos.crear")
def crear_contacto():
    req = request.get_json(silent=True) or {}

    nuevo_contacto = crear(req)
    data = contacto_schema.dump(nuevo_contacto)

    return respuesta_api(True, {"id": data["id"]}, "Contacto creado correctamente", 201)


@contactos_bp.route("/<int:id>", methods=["PUT"])
@requires_permission("planes.contactos.editar", "planes.contactos.editar_propio", policy="ANY")
def editar_contacto(id):
    contacto = obtener_por_id(id)

    if not contacto:
        raise APIError("Contacto no encontrado.", status=404)

    tiene_acceso_total = "planes.contactos.editar" in g.acciones
    es_propio = contacto.persona_id == g.id_persona

    if not tiene_acceso_total and not es_propio:
        raise APIError("No tenes permiso para ver este contacto", status=403)

    req = request.get_json(silent=True) or {}
    contacto_actualizado = actualizar(contacto, req)
    data = contacto_schema.dump(contacto_actualizado)

    return respuesta_api(True, {"id": data["id"]}, "Contacto actualizado correctamente")


@contactos_bp.route("/<int:id>", methods=["DELETE"])
@requires_permission("planes.contactos.eliminar")
def eliminar_contacto(id):
    contacto = obtener_por_id(id)

    if not contacto:
        raise APIError("Contacto no encontrado.", status=404)

    eliminar(contacto)

    return respuesta_api(True, {"id": id}, "Contacto eliminado correctamente")

@contactos_bp.route("/GetPersonaIDFromMail", methods=["GET"])
@requires_permission(only_services=True)
def get_persona_id_from_mail():
    email = request.args.get("email")

    if not email:
        raise APIError("El parametro 'email' es requerido.", status=400)

    personaid = obtener_personaid_por_email(email)

    if not personaid:
        raise APIError("No se encontro ningun contacto con ese email.", status=404)

    return respuesta_api(True, {"personaid": personaid}, "Persona ID encontrada")