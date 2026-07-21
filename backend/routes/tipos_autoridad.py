from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError
from extensions import db

from models.autoridad_comision import AutoridadComision
from schemas.tipo_autoridad_schema import tipo_autoridad_schema, tipos_autoridad_schema
from services.tipo_autoridad_service import (
    obtener_todos,
    obtener_por_id,
    crear,
    actualizar,
    eliminar
)

tipos_autoridad_bp = Blueprint("tipos_autoridad_bp", __name__, url_prefix="/tipos-autoridad")

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

@tipos_autoridad_bp.route("", methods=["GET"])
def get_tipos_autoridad():
    try:
        tipos = obtener_todos()
        data = tipos_autoridad_schema.dump(tipos)

        if len(data) == 0:
            return respuesta_api(True, [], "No se encontraron resultados")

        return respuesta_api(True, data, "Lista de tipos de autoridad obtenida")
    
    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrió un error al obtener la lista"
        })
    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrió un error inesperado"
        })

@tipos_autoridad_bp.route("/<int:id>", methods=["GET"])
def get_tipo_autoridad(id):
    try:
        tipo = obtener_por_id(id)

        if not tipo:
            return respuesta_api(False, None, "Tipo de autoridad no encontrado", 404, {
                "id": "No existe un registro con ese id"
            })

        data = tipo_autoridad_schema.dump(tipo)
        return respuesta_api(True, data, "Tipo de autoridad obtenido correctamente")
    
    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrió un error al obtener el registro"
        })
    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrió un error inesperado"
        })

@tipos_autoridad_bp.route("", methods=["POST"])
def crear_tipo_autoridad():
    req = request.get_json(silent=True) or {}
    try:
        nuevo_tipo = crear(req)
        data = tipo_autoridad_schema.dump(nuevo_tipo)
        return respuesta_api(True, {"id": data["id"]}, "Tipo de autoridad creado correctamente", 201)

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

@tipos_autoridad_bp.route("/<int:id>", methods=["PUT"])
def editar_tipo_autoridad(id):
    try:
        tipo = obtener_por_id(id)
        
        if not tipo:
            return respuesta_api(False, None, "Tipo de autoridad no encontrado", 404, {
                "id": "No existe un registro con ese id"
            })
        
        req = request.get_json(silent=True) or {}
        tipo_actualizado = actualizar(tipo, req)
        data = tipo_autoridad_schema.dump(tipo_actualizado)

        return respuesta_api(True, {"id": data["id"]}, "Tipo de autoridad actualizado correctamente")

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

@tipos_autoridad_bp.route("/<int:id>", methods=["DELETE"])
def eliminar_tipo_autoridad(id):
    try:
        tipo = obtener_por_id(id)
        
        if not tipo:
            return respuesta_api(False, None, "Tipo de autoridad no encontrado", 404, {
                "id": "No existe un registro con ese id"
            })

        esta_en_uso = AutoridadComision.query.filter_by(tipo_autoridad_id=id).first()

        if esta_en_uso:
            return respuesta_api(False, None, "No se puede eliminar el tipo de autoridad", 409, {
                "tipo_autoridad": "No se puede eliminar un tipo de autoridad asociado a autoridades de comision"
            })
        
        eliminar(tipo)
        return respuesta_api(True, {"id": id}, "Tipo de autoridad eliminado correctamente")
    
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
