from flask import Blueprint, request, jsonify
from utils.utilidades import respuesta_api

from db import db
from models.planes import Planes
from schemas.tipo_planes_schema import tipo_planes_schema, tipos_planes_schema
from utils.errores import APIError

from services.tipo_planes_service import (
    obtener_todos,
    obtener_por_id,
    crear,
    actualizar,
    eliminar
)

tipos_planes_bp = Blueprint(
    "tipos_planes_bp", __name__, url_prefix="/tipos-planes")


@tipos_planes_bp.route("", methods=["GET"])
def get_tipos_planes():
    tipos_planes = obtener_todos()
    data = tipos_planes_schema.dump(tipos_planes)

    if len(data) == 0:
        return respuesta_api(True, [], "No se encontraron resultados")

    return respuesta_api(True, data, "Lista de tipos de planes obtenida")


@tipos_planes_bp.route("/<int:id>", methods=["GET"])
def get_tipo_plan(id):
    tipo_plan = obtener_por_id(id)

    if not tipo_plan:
        raise APIError("Tipo de plan no encontrado", status=404)

    data = tipo_planes_schema.dump(tipo_plan)

    return respuesta_api(True, data, "Tipo de plan obtenido correctamente")


@tipos_planes_bp.route("", methods=["POST"])
def crear_tipo_plan():
    req = request.get_json(silent=True) or {}

    nuevo_tipo_plan = crear(req)
    data = tipo_planes_schema.dump(nuevo_tipo_plan)

    return respuesta_api(True, {"id": data["id_tipo_planes"]}, "Tipo de plan creado correctamente", 201)


@tipos_planes_bp.route("/<int:id>", methods=["PUT"])
def editar_tipo_plan(id):
    tipo_plan = obtener_por_id(id)

    if not tipo_plan:
        raise APIError("Tipo de plan no encontrado", status=404)

    req = request.get_json(silent=True) or {}
    tipo_plan_actualizado = actualizar(tipo_plan, req)
    data = tipo_planes_schema.dump(tipo_plan_actualizado)

    return respuesta_api(True, {"id": data["id_tipo_planes"]}, "Tipo de plan actualizado correctamente")


@tipos_planes_bp.route("/<int:id>", methods=["DELETE"])
def eliminar_tipo_planes(id):
    tipo_plan = obtener_por_id(id)
    if not tipo_plan:
        raise APIError("Tipo de plan no encontrado", status=404)

    esta_en_uso = Planes.query.filter_by(
        tipo_planes_id_tipo_planes=id,
        estado=1,
    ).first()

    if esta_en_uso:
        raise APIError("No se puede eliminar un tipo de plan asociado a planes activos", status=409)

    eliminar(tipo_plan)

    return respuesta_api(True, {"id": id}, "Tipo de plan eliminado correctamente")