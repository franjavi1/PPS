from flask import Blueprint, request, jsonify
from auth_common.decorador import requires_permission
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError

from db import db
from models.legajo_tipos_legajo import LegajoTiposLegajo
from schemas.tipo_legajo_schema import tipo_legajo_schema, tipos_legajo_schema

from services.tipo_legajo_service import (
    obtener_todos,
    obtener_por_id,
    crear,
    actualizar,
    eliminar
)

tipos_legajo_bp = Blueprint("tipos_legajo_bp", __name__, url_prefix="/tipos-legajo")


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


@tipos_legajo_bp.route("", methods=["GET"])
@requires_permission("planes.legajos.leer")
def get_tipos_legajo():
    try:
        tipos_legajo = obtener_todos()
        data = tipos_legajo_schema.dump(tipos_legajo)
        if len(data) == 0:
            return respuesta_api(True, [], "No se encontraron resultados")
        return respuesta_api(True, data, "Lista de tipos de legajo obtenida")
    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrió un error al obtener la lista de tipos de legajo"
        })
    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrió un error inesperado"
        })


@tipos_legajo_bp.route("/<int:id>", methods=["GET"])
@requires_permission("planes.legajos.leer")
def get_tipo_legajo(id):
    try:
        tipo_legajo = obtener_por_id(id)
        if not tipo_legajo:
            return respuesta_api(False, None, "Tipo de legajo no encontrado", 404, {
                "id": "No existe un tipo de legajo con ese id"
            })
        data = tipo_legajo_schema.dump(tipo_legajo)
        return respuesta_api(True, data, "Tipo de legajo obtenido correctamente")
    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrió un error al obtener el tipo de legajo"
        })
    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrió un error inesperado"
        })


@tipos_legajo_bp.route("", methods=["POST"])
@requires_permission("planes.legajos.crear")
def crear_tipo_legajo():
    req = request.get_json(silent=True) or {}
    try:
        nuevo_tipo_legajo = crear(req)
        data = tipo_legajo_schema.dump(nuevo_tipo_legajo)
        return respuesta_api(True, {"id": data["id"]}, "Tipo de legajo creado correctamente", 201)
    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validación", 400, e.messages)
    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrió un error al crear el tipo de legajo"
        })
    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrió un error inesperado"
        })


@tipos_legajo_bp.route("/<int:id>", methods=["PUT"])
@requires_permission("planes.legajos.editar")
def editar_tipo_legajo(id):
    try:
        tipo_legajo = obtener_por_id(id)
        if not tipo_legajo:
            return respuesta_api(False, None, "Tipo de legajo no encontrado", 404, {
                "id": "No existe un tipo de legajo con ese id"
            })
        req = request.get_json(silent=True) or {}
        tipo_legajo_actualizado = actualizar(tipo_legajo, req)
        data = tipo_legajo_schema.dump(tipo_legajo_actualizado)
        return respuesta_api(True, {"id": data["id"]}, "Tipo de legajo actualizado correctamente")
    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validación", 400, e.messages)
    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrió un error al actualizar el tipo de legajo"
        })
    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrió un error inesperado"
        })


@tipos_legajo_bp.route("/<int:id>", methods=["DELETE"])
@requires_permission("planes.legajos.eliminar")
def eliminar_tipo_legajo(id):
    try:
        tipo_legajo = obtener_por_id(id)
        if not tipo_legajo:
            return respuesta_api(False, None, "Tipo de legajo no encontrado", 404, {
                "id": "No existe un tipo de legajo con ese id"
            })
        
        # Verificar si hay legajos vinculados activos
        esta_en_uso = LegajoTiposLegajo.query.filter_by(tipo_legajo_id=id).first()
        if esta_en_uso:
            return respuesta_api(False, None, "No se puede eliminar el tipo de legajo", 409, {
                "tipo_legajo": "No se puede eliminar un tipo de legajo asociado a legajos existentes"
            })

        eliminar(tipo_legajo)
        return respuesta_api(True, {"id": id}, "Tipo de legajo eliminado correctamente")
    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrió un error al eliminar el tipo de legajo"
        })
    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrió un error inesperado"
        })
