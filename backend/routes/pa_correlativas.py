from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError
from db import db

from schemas.pa_correlativa_schema import pa_correlativa_schema, pa_correlativas_schema
from services.pa_correlativa_service import (
    obtener_todos,
    obtener_por_id,
    crear,
    actualizar,
    eliminar
)

pa_correlativas_bp = Blueprint("pa_correlativas_bp", __name__, url_prefix="/pa-correlativas")

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

@pa_correlativas_bp.route("", methods=["GET"])
def get_pa_correlativas():
    try:
        relaciones = obtener_todos()
        data = pa_correlativas_schema.dump(relaciones)

        if len(data) == 0:
            return respuesta_api(True, [], "No se encontraron resultados")

        return respuesta_api(True, data, "Lista de PA Correlativas obtenida")
    
    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrió un error al obtener la lista"
        })
    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrió un error inesperado"
        })

@pa_correlativas_bp.route("/<int:id>", methods=["GET"])
def get_pa_correlativa(id):
    try:
        relacion = obtener_por_id(id)

        if not relacion:
            return respuesta_api(False, None, "Registro no encontrado", 404, {
                "id": "No existe un registro con ese id"
            })

        data = pa_correlativa_schema.dump(relacion)
        return respuesta_api(True, data, "Registro obtenido correctamente")
    
    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrió un error al obtener el registro"
        })
    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrió un error inesperado"
        })

@pa_correlativas_bp.route("", methods=["POST"])
def crear_pa_correlativa():
    req = request.get_json(silent=True) or {}
    try:
        nueva_relacion = crear(req)
        data = pa_correlativa_schema.dump(nueva_relacion)
        return respuesta_api(True, {"id": data["id"]}, "Registro creado correctamente", 201)

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validación", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrió un error al crear el registro"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrió un error inesperado"
        })

@pa_correlativas_bp.route("/<int:id>", methods=["PUT"])
def editar_pa_correlativa(id):
    try:
        relacion = obtener_por_id(id)
        
        if not relacion:
            return respuesta_api(False, None, "Registro no encontrado", 404, {
                "id": "No existe un registro con ese id"
            })
        
        req = request.get_json(silent=True) or {}
        relacion_actualizada = actualizar(relacion, req)
        data = pa_correlativa_schema.dump(relacion_actualizada)

        return respuesta_api(True, {"id": data["id"]}, "Registro actualizado correctamente")

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validación", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrió un error al actualizar el registro"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrió un error inesperado"
        })

@pa_correlativas_bp.route("/<int:id>", methods=["DELETE"])
def eliminar_pa_correlativa(id):
    try:
        relacion = obtener_por_id(id)
        
        if not relacion:
            return respuesta_api(False, None, "Registro no encontrado", 404, {
                "id": "No existe un registro con ese id"
            })
        
        eliminar(relacion)
        return respuesta_api(True, {"id": id}, "Registro eliminado correctamente")
    
    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrió un error al eliminar el registro"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrió un error inesperado"
        })