from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError
from extensions import db
from models.comision_asignatura import ComisionAsignatura

from schemas.aula_schema import aula_schema, aulas_schema
from services.aula_service import (
    obtener_todos,
    obtener_por_id,
    crear,
    actualizar,
    eliminar
)

aulas_bp = Blueprint("aulas_bp", __name__, url_prefix="/aulas")

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

@aulas_bp.route("", methods=["GET"])
def get_aulas():
    try:
        aulas = obtener_todos()
        data = aulas_schema.dump(aulas)

        if len(data) == 0:
            return respuesta_api(True, [], "No se encontraron resultados")

        return respuesta_api(True, data, "Lista de aulas obtenida")
    
    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrió un error al obtener la lista de aulas"
        })
    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrió un error inesperado"
        })

@aulas_bp.route("/<int:id>", methods=["GET"])
def get_aula(id):
    try:
        aula = obtener_por_id(id)

        if not aula:
            return respuesta_api(False, None, "Aula no encontrada", 404, {
                "id": "No existe un aula activa con ese id"
            })

        data = aula_schema.dump(aula)
        return respuesta_api(True, data, "Aula obtenida correctamente")
    
    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrió un error al obtener el aula"
        })
    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrió un error inesperado"
        })

@aulas_bp.route("", methods=["POST"])
def crear_aula():
    req = request.get_json(silent=True) or {}
    try:
        nueva_aula = crear(req)
        data = aula_schema.dump(nueva_aula)
        return respuesta_api(True, {"id_aula": data["id_aula"]}, "Aula creada correctamente", 201)

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validación", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrió un error al crear el aula"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrió un error inesperado"
        })

@aulas_bp.route("/<int:id>", methods=["PUT"])
def editar_aula(id):
    try:
        aula = obtener_por_id(id)
        
        if not aula:
            return respuesta_api(False, None, "Aula no encontrada", 404, {
                "id": "No existe un aula activa con ese id"
            })
        
        req = request.get_json(silent=True) or {}
        aula_actualizada = actualizar(aula, req)
        data = aula_schema.dump(aula_actualizada)

        return respuesta_api(True, {"id_aula": data["id_aula"]}, "Aula actualizada correctamente")

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validación", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrió un error al actualizar el aula"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrió un error inesperado"
        })

@aulas_bp.route("/<int:id>", methods=["DELETE"])
def eliminar_aula(id):
    try:
        aula = obtener_por_id(id)
        
        if not aula:
            return respuesta_api(False, None, "Aula no encontrada", 404, {
                "id": "No existe un aula activa con ese id"
            })

        esta_en_uso = ComisionAsignatura.query.filter_by(aula_id=id).first()

        if esta_en_uso:
            return respuesta_api(False, None, "No se puede eliminar el aula", 409, {
                "aula": "No se puede eliminar un aula asociada a comisiones"
            })

        eliminar(aula)
        return respuesta_api(True, {"id_aula": id}, "Aula eliminada correctamente")
    
    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrió un error al eliminar el aula"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrió un error inesperado"
        })
