from flask import Blueprint, request, jsonify
from utils.utilidades import respuesta_api
from utils.errores import APIError

from schemas.datos_medicos_schema import datos_medicos_schema, datos_medicos_lista_schema

from services.datos_medicos_service import (
    obtener_todos,
    obtener_por_id,
    crear,
    actualizar,
    eliminar
)


datos_medicos_bp = Blueprint("datos_medicos_bp", __name__, url_prefix="/datos-medicos")


@datos_medicos_bp.route("", methods=["GET"])
def get_datos_medicos():
    datos_medicos = obtener_todos()
    data = datos_medicos_lista_schema.dump(datos_medicos)

    if len(data) == 0:
        return respuesta_api(True, [], "No se encontraron resultados")

    return respuesta_api(True, data, "Lista de datos medicos obtenida")


@datos_medicos_bp.route("/<int:id>", methods=["GET"])
def get_datos_medicos_por_id(id):
    datos_medicos = obtener_por_id(id)

    if not datos_medicos:
        raise APIError("Datos medicos no encontrados", status=404)

    data = datos_medicos_schema.dump(datos_medicos)

    return respuesta_api(True, data, "Datos medicos obtenidos correctamente")


@datos_medicos_bp.route("", methods=["POST"])
def crear_datos_medicos():
    req = request.get_json(silent=True) or {}

    nuevos_datos_medicos = crear(req)
    data = datos_medicos_schema.dump(nuevos_datos_medicos)

    return respuesta_api(True, {"id": data["id"]}, "Datos medicos creados correctamente", 201)


@datos_medicos_bp.route("/<int:id>", methods=["PUT"])
def editar_datos_medicos(id):
    datos_medicos = obtener_por_id(id)

    if not datos_medicos:
        raise APIError("Datos medicos no encontrados", status=404)

    req = request.get_json(silent=True) or {}
    datos_medicos_actualizados = actualizar(datos_medicos, req)
    data = datos_medicos_schema.dump(datos_medicos_actualizados)

    return respuesta_api(True, {"id": data["id"]}, "Datos medicos actualizados correctamente")


@datos_medicos_bp.route("/<int:id>", methods=["DELETE"])
def eliminar_datos_medicos(id):
    datos_medicos = obtener_por_id(id)

    if not datos_medicos:
        raise APIError("Datos medicos no encontrados", status=404)

    eliminar(datos_medicos)

    return respuesta_api(True, {"id": id}, "Datos medicos eliminados correctamente")