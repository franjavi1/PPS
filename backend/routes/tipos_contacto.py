from flask import Blueprint, request, jsonify
from marshmallow import ValidationError

from db import db
from models.contactos import Contactos
from schemas.tipo_contacto_schema import tipo_contacto_schema, tipos_contacto_schema
from utils.errores import APIError
from utils.utilidades import respuesta_api
from auth_common.decorador import requires_permission
from services.tipo_contacto_service import (
    obtener_todos,
    obtener_por_id,
    crear,
    actualizar,
    eliminar
)


tipos_contacto_bp = Blueprint(
    "tipos_contacto_bp", __name__, url_prefix="/tipos-contacto")


@tipos_contacto_bp.route("", methods=["GET"])
@requires_permission("planes.tipos_contacto.ver", "planes.personas.ver_propio", policy="ANY")
def get_tipos_contacto():
    tipos_contacto = obtener_todos()
    data = tipos_contacto_schema.dump(tipos_contacto)

    if len(data) == 0:
        return respuesta_api(True, [], "No se encontraron resultados")

    return respuesta_api(True, data, "Lista de tipos de contacto obtenida")


@tipos_contacto_bp.route("/<int:id>", methods=["GET"])
@requires_permission("planes.tipos_contacto.ver")
def get_tipo_contacto(id):
    tipo_contacto = obtener_por_id(id)

    if not tipo_contacto:
        raise APIError("Tipo de contacto no encontrado.", status=404)

    data = tipo_contacto_schema.dump(tipo_contacto)

    return respuesta_api(True, data, "Tipo de contacto obtenido correctamente")


@tipos_contacto_bp.route("", methods=["POST"])
@requires_permission("planes.tipos_contacto.crear")
def crear_tipo_contacto():
    req = request.get_json(silent=True) or {}

    nuevo_tipo_contacto = crear(req)
    data = tipo_contacto_schema.dump(nuevo_tipo_contacto)

    return respuesta_api(True, {"id": data["id"]}, "Tipo de contacto creado correctamente", 201)


@tipos_contacto_bp.route("/<int:id>", methods=["PUT"])
@requires_permission("planes.tipos_contacto.editar")
def editar_tipo_contacto(id):
    tipo_contacto = obtener_por_id(id)

    if not tipo_contacto:
        raise APIError("Tipo de contacto no encontrado.", status=404)

    req = request.get_json(silent=True) or {}
    tipo_contacto_actualizado = actualizar(tipo_contacto, req)
    data = tipo_contacto_schema.dump(tipo_contacto_actualizado)

    return respuesta_api(True, {"id": data["id"]}, "Tipo de contacto actualizado correctamente")


@tipos_contacto_bp.route("/<int:id>", methods=["DELETE"])
@requires_permission("planes.tipos_contacto.eliminar")
def eliminar_tipo_contacto(id):
    tipo_contacto = obtener_por_id(id)

    if not tipo_contacto:
        raise APIError("Tipo de contacto no encontrado.", status=404)

    esta_en_uso = Contactos.query.filter_by(tipo_contacto_id=id).first()

    if esta_en_uso:
        raise APIError("No se puede eliminar un tipo de contacto asociado a contactos.", status=409)

    eliminar(tipo_contacto)

    return respuesta_api(True, {"id": id}, "Tipo de contacto eliminado correctamente")