from flask import Blueprint, request
from models.persona import Persona
from schemas.tipo_documento_schema import tipo_documento_schema, tipos_documento_schema
from utils.errores import APIError
from utils.utilidades import respuesta_api

from services.tipo_documento_service import (
    obtener_todos,
    obtener_por_id,
    crear,
    actualizar,
    eliminar
)

tipos_documentos_bp = Blueprint("tipos_documentos_bp", __name__, url_prefix="/tipos-documentos")


@tipos_documentos_bp.route("", methods=["GET"])
def get_tipos_documentos():
    tipos_documentos = obtener_todos()
    data = tipos_documento_schema.dump(tipos_documentos)

    if len(data) == 0:
        return respuesta_api(True, [], "No se encontraron resultados")

    return respuesta_api(True, data, "Lista de tipos de documento obtenida")


@tipos_documentos_bp.route("/<int:id>", methods=["GET"])
def get_tipo_documento(id):
    tipo_documento = obtener_por_id(id)

    if not tipo_documento:
        raise APIError("Tipo de documento no encontrado", status=404)

    data = tipo_documento_schema.dump(tipo_documento)

    return respuesta_api(True, data, "Tipo de documento obtenido correctamente")


@tipos_documentos_bp.route("", methods=["POST"])
def crear_tipo_documento():
    req = request.get_json(silent=True) or {}
    nuevo_tipo_documento = crear(req)
    data = tipo_documento_schema.dump(nuevo_tipo_documento)

    return respuesta_api(True, {"id": data["id"]}, "Tipo de documento creado correctamente", 201)


@tipos_documentos_bp.route("/<int:id>", methods=["PUT"])
def editar_tipo_documento(id):
    tipo_documento = obtener_por_id(id)

    if not tipo_documento:
        raise APIError("Tipo de documento no encontrado", status=404)

    req = request.get_json(silent=True) or {}
    tipo_documento_actualizado = actualizar(tipo_documento, req)
    data = tipo_documento_schema.dump(tipo_documento_actualizado)

    return respuesta_api(True, {"id": data["id"]}, "Tipo de documento actualizado correctamente")


@tipos_documentos_bp.route("/<int:id>", methods=["DELETE"])
def eliminar_tipo_documento(id):
    tipo_documento = obtener_por_id(id)

    if not tipo_documento:
        raise APIError("Tipo de documento no encontrado", status=404)

    esta_en_uso = Persona.query.filter_by(td_id=id, estado=1).first()

    if esta_en_uso:
        raise APIError("No se puede eliminar un tipo de documento asociado a personas activas", status=409)

    eliminar(tipo_documento)

    return respuesta_api(True, {"id": id}, "Tipo de documento eliminado correctamente")