from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError
from db import db

from schemas.comision_schema import comision_schema, comisiones_schema
from services.comision_service import (
    obtener_todos,
    obtener_por_id,
    crear,
    actualizar,
    eliminar
)

comisiones_bp = Blueprint("comisiones_bp", __name__, url_prefix="/comisiones")

# Helper para formatear todas las respuestas de la API
def respuesta_api(success=True, data=None, message="", status=200, errors=None):
    response = {
        "status": "success" if success else "error",
        "message" : message
    }
    if data is not None:
        response["data"] = data
        if isinstance(data, list):
            response["total"] = len(data)

    if errors is not None:
        response["errors"] = errors
    
    return jsonify(response), status

@comisiones_bp.route("", methods=["GET"])
def get_comisiones():
    try:
        comisiones = obtener_todos()
        data = comisiones_schema.dump(comisiones)

        if len(data) == 0:
            return respuesta_api(True, [], "No se encontraron resultados")

        return respuesta_api(True, data, "Lista de comisiones obtenida")
    
    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrió un error al obtener la lista de comisiones"
        })
    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrió un error inesperado"
        })

@comisiones_bp.route("/<int:id>", methods=["GET"])
def get_comision(id):
    try:
        comision = obtener_por_id(id)

        if not comision:
            return respuesta_api(False, None, "Comisión no encontrada", 404, {
                "id": "No existe una comisión activa con ese id"
            })

        data = comision_schema.dump(comision)
        return respuesta_api(True, data, "Comisión obtenida correctamente")
    
    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrió un error al obtener la comisión"
        })
    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrió un error inesperado"
        })

@comisiones_bp.route("", methods=["POST"])
def crear_comision():
    req = request.get_json(silent=True) or {}
    try:
        nueva_comision = crear(req)
        data = comision_schema.dump(nueva_comision)
        return respuesta_api(True, {"id_comision": data["id_comision"]}, "Comisión creada correctamente", 201)

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validación", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrió un error al crear la comisión"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrió un error inesperado"
        })

@comisiones_bp.route("/<int:id>", methods=["PUT"])
def editar_comision(id):
    try:
        comision = obtener_por_id(id)
        
        if not comision:
            return respuesta_api(False, None, "Comisión no encontrada", 404, {
                "id": "No existe una comisión activa con ese id"
            })
        
        req = request.get_json(silent=True) or {}
        comision_actualizada = actualizar(comision, req)
        data = comision_schema.dump(comision_actualizada)

        return respuesta_api(True, {"id_comision": data["id_comision"]}, "Comisión actualizada correctamente")

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validación", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrió un error al actualizar la comisión"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrió un error inesperado"
        })

@comisiones_bp.route("/<int:id>", methods=["DELETE"])
def eliminar_comision(id):
    try:
        comision = obtener_por_id(id)
        
        if not comision:
            return respuesta_api(False, None, "Comisión no encontrada", 404, {
                "id": "No existe una comisión activa con ese id"
            })
        
        eliminar(comision)
        return respuesta_api(True, {"id_comision": id}, "Comisión eliminada correctamente")
    
    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrió un error al eliminar la comisión"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrió un error inesperado"
        })