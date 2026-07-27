from flask import Blueprint, request, jsonify

from db import db
from models.sedes import Sedes
from schemas.tipo_sede_schema import tipo_sede_schema, tipos_sedes_schema
from utils.errores import APIError
from utils.utilidades import respuesta_api
from auth_common.decorador import requires_permission
from services.tipo_sede_service import (
    obtener_todos,
    obtener_por_id,
    crear,
    actualizar,
    eliminar
)


tipos_sedes_bp = Blueprint(
    "tipos_sedes_bp", __name__, url_prefix="/tipos-sedes")


@tipos_sedes_bp.route("", methods=["GET"])
@requires_permission("planes.tipos_sedes.ver")
def get_tipos_sedes():
    tipos_sedes = obtener_todos()
    data = tipos_sedes_schema.dump(tipos_sedes)

    if len(data) == 0:
        return respuesta_api(True, [], "No se encontraron resultados")

    return respuesta_api(True, data, "Lista de tipos de sede obtenida")


@tipos_sedes_bp.route("/<int:id>", methods=["GET"])
@requires_permission("planes.tipos_sedes.ver")
def get_tipo_sede(id):
    tipo_sede = obtener_por_id(id)

    if not tipo_sede:
        raise APIError("Tipo de sede no encontrado", status=404)

    data = tipo_sede_schema.dump(tipo_sede)

    return respuesta_api(True, data, "Tipo de sede obtenido correctamente")


@tipos_sedes_bp.route("", methods=["POST"])
@requires_permission("planes.tipos_sedes.crear")
def crear_tipo_sede():
    req = request.get_json(silent=True) or {}

    nuevo_tipo_sede = crear(req)
    data = tipo_sede_schema.dump(nuevo_tipo_sede)

    return respuesta_api(True, {"id": data["id"]}, "Tipo de sede creado correctamente", 201)


@tipos_sedes_bp.route("/<int:id>", methods=["PUT"])
@requires_permission("planes.tipos_sedes.editar")
def editar_tipo_sede(id):
    tipo_sede = obtener_por_id(id)

    if not tipo_sede:
        raise APIError("Tipo de sede no encontrado", status=404)

    req = request.get_json(silent=True) or {}
    tipo_sede_actualizado = actualizar(tipo_sede, req)
    data = tipo_sede_schema.dump(tipo_sede_actualizado)

    return respuesta_api(True, {"id": data["id"]}, "Tipo de sede actualizado correctamente")


@tipos_sedes_bp.route("/<int:id>", methods=["DELETE"])
@requires_permission("planes.tipos_sedes.eliminar")
def eliminar_tipo_sede(id):
    tipo_sede = obtener_por_id(id)

    if not tipo_sede:
        raise APIError("Tipo de sede no encontrado", status=404)

    esta_en_uso = Sedes.query.filter_by(tipo_sede_id=id).first()

    if esta_en_uso:
        raise APIError("No se puede eliminar un tipo de sede asociado a sedes", status=409)

    eliminar(tipo_sede)

    return respuesta_api(True, {"id": id}, "Tipo de sede eliminado correctamente")