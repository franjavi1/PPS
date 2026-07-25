from flask import Blueprint, request, jsonify
from auth_common.decorador import requires_permission
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError

from db import db
from schemas.legajo_tipos_legajo_schema import legajo_tipos_legajo_schema, legajo_tipos_legajos_schema

from services.legajo_tipos_legajo_service import (
    obtener_todos,
    obtener_por_id,
    obtener_por_legajo,
    crear,
    eliminar
)

legajo_tipos_legajo_bp = Blueprint("legajo_tipos_legajo_bp", __name__, url_prefix="/legajo-tipos-legajo")


def respuesta_api(success=True, data=None, message="", status=200, errors=None):
    response = {
        "status": "success" if success else "error",
        "message": message
    }
    if data is not None:
        response["data"] = data
        if isinstance(data, list):
            response["total"] = len(data)
    if errors is not None:
        response["errors"] = errors
    return jsonify(response), status


@legajo_tipos_legajo_bp.route("", methods=["GET"])
@requires_permission("planes.legajos.leer")
def get_todas_relaciones():
    try:
        relaciones = obtener_todos()
        data = legajo_tipos_legajos_schema.dump(relaciones)
        return respuesta_api(True, data, "Lista de relaciones obtenida")
    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrió un error al obtener la lista de relaciones"
        })


@legajo_tipos_legajo_bp.route("/legajo/<int:legajo_id>", methods=["GET"])
@requires_permission("planes.legajos.leer")
def get_relaciones_por_legajo(legajo_id):
    try:
        relaciones = obtener_por_legajo(legajo_id)
        data = legajo_tipos_legajos_schema.dump(relaciones)
        return respuesta_api(True, data, f"Relaciones para el legajo {legajo_id} obtenidas")
    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrió un error al obtener las relaciones"
        })


@legajo_tipos_legajo_bp.route("", methods=["POST"])
@requires_permission("planes.legajos.crear")
def crear_relacion():
    req = request.get_json(silent=True) or {}
    try:
        nueva_relacion = crear(req)
        data = legajo_tipos_legajo_schema.dump(nueva_relacion)
        return respuesta_api(True, data, "Relación creada correctamente", 201)
    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validación", 400, e.messages)
    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrió un error al crear la relación"
        })


@legajo_tipos_legajo_bp.route("/<int:id>", methods=["DELETE"])
@requires_permission("planes.legajos.eliminar")
def eliminar_relacion(id):
    try:
        relacion = obtener_por_id(id)
        if not relacion:
            return respuesta_api(False, None, "Relación no encontrada", 404, {
                "id": "No existe la relación con ese id"
            })
        eliminar(relacion)
        return respuesta_api(True, {"id": id}, "Relación eliminada correctamente")
    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrió un error al eliminar la relación"
        })
