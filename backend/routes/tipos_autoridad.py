from flask import Blueprint, request
from db import db

from models.autoridad_comision import AutoridadComision
from schemas.tipo_autoridad_schema import tipo_autoridad_schema, tipos_autoridad_schema
from services.tipo_autoridad_service import (
    obtener_todos,
    obtener_por_id,
    crear,
    actualizar,
    eliminar
)
from utils.errores import APIError
from utils.utilidades import respuesta_api

tipos_autoridad_bp = Blueprint("tipos_autoridad_bp", __name__, url_prefix="/tipos-autoridad")

@tipos_autoridad_bp.route("", methods=["GET"])
def get_tipos_autoridad():
    tipos = obtener_todos()
    data = tipos_autoridad_schema.dump(tipos)

    if len(data) == 0:
        return respuesta_api(True, [], "No se encontraron resultados")

    return respuesta_api(True, data, "Lista de tipos de autoridad obtenida")

@tipos_autoridad_bp.route("/<int:id>", methods=["GET"])
def get_tipo_autoridad(id):
    tipo = obtener_por_id(id)

    if not tipo:
        raise APIError("Tipo de autoridad no encontrado.", status=404)

    data = tipo_autoridad_schema.dump(tipo)
    return respuesta_api(True, data, "Tipo de autoridad obtenido correctamente")

@tipos_autoridad_bp.route("", methods=["POST"])
def crear_tipo_autoridad():
    req = request.get_json(silent=True) or {}
    nuevo_tipo = crear(req)
    data = tipo_autoridad_schema.dump(nuevo_tipo)
    return respuesta_api(True, {"id": data["id"]}, "Tipo de autoridad creado correctamente", 201)

@tipos_autoridad_bp.route("/<int:id>", methods=["PUT"])
def editar_tipo_autoridad(id):
    tipo = obtener_por_id(id)
    
    if not tipo:
        raise APIError("Tipo de autoridad no encontrado.", status=404)
    
    req = request.get_json(silent=True) or {}
    tipo_actualizado = actualizar(tipo, req)
    data = tipo_autoridad_schema.dump(tipo_actualizado)

    return respuesta_api(True, {"id": data["id"]}, "Tipo de autoridad actualizado correctamente")

@tipos_autoridad_bp.route("/<int:id>", methods=["DELETE"])
def eliminar_tipo_autoridad(id):
    tipo = obtener_por_id(id)
    
    if not tipo:
        raise APIError("Tipo de autoridad no encontrado.", status=404)

    esta_en_uso = AutoridadComision.query.filter_by(tipo_autoridad_id=id).first()

    if esta_en_uso:
        raise APIError("No se puede eliminar un tipo de autoridad asociado a autoridades de comision.", status=409)
    
    eliminar(tipo)
    return respuesta_api(True, {"id": id}, "Tipo de autoridad eliminado correctamente")