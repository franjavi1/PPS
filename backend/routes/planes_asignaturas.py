from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError
from db import db

from models.comision_asignatura import ComisionAsignatura
from models.pa_correlativa import PACorrelativa
from schemas.plan_asignatura_schema import plan_asignatura_schema, planes_asignaturas_schema
from services.plan_asignatura_service import (
    obtener_todos,
    obtener_por_id,
    crear,
    actualizar,
    eliminar
)

planes_asignaturas_bp = Blueprint("planes_asignaturas_bp", __name__, url_prefix="/planes-asignaturas")

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

@planes_asignaturas_bp.route("", methods=["GET"])
def get_planes():
    try:
        planes = obtener_todos()
        data = planes_asignaturas_schema.dump(planes)
        if len(data) == 0:
            return respuesta_api(True, [], "No se encontraron resultados")
        return respuesta_api(True, data, "Lista de planes de asignaturas obtenida")
    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {"database": "Error al obtener lista"})
    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {"server": "Error inesperado"})

@planes_asignaturas_bp.route("/<int:id>", methods=["GET"])
def get_plan(id):
    try:
        plan = obtener_por_id(id)
        if not plan:
            return respuesta_api(False, None, "Registro no encontrado", 404, {"id": "No existe el registro"})
        data = plan_asignatura_schema.dump(plan)
        return respuesta_api(True, data, "Registro obtenido correctamente")
    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {"database": "Error al obtener registro"})
    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {"server": "Error inesperado"})

@planes_asignaturas_bp.route("", methods=["POST"])
def crear_plan():
    req = request.get_json(silent=True) or {}
    try:
        nuevo_plan = crear(req)
        data = plan_asignatura_schema.dump(nuevo_plan)
        return respuesta_api(True, {"id": data["id"]}, "Registro creado correctamente", 201)
    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validación", 400, e.messages)
    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {"database": "Error al crear"})
    except Exception as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error inesperado", 500, {"server": "Error inesperado"})

@planes_asignaturas_bp.route("/<int:id>", methods=["PUT"])
def editar_plan(id):
    try:
        plan = obtener_por_id(id)
        if not plan:
            return respuesta_api(False, None, "Registro no encontrado", 404, {"id": "No existe el registro"})
        
        req = request.get_json(silent=True) or {}
        plan_actualizado = actualizar(plan, req)
        data = plan_asignatura_schema.dump(plan_actualizado)
        return respuesta_api(True, {"id": data["id"]}, "Registro actualizado correctamente")
    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validación", 400, e.messages)
    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {"database": "Error al actualizar"})
    except Exception as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error inesperado", 500, {"server": "Error inesperado"})

@planes_asignaturas_bp.route("/<int:id>", methods=["DELETE"])
def eliminar_plan(id):
    try:
        plan = obtener_por_id(id)
        if not plan:
            return respuesta_api(False, None, "Registro no encontrado", 404, {"id": "No existe el registro"})

        # Solo se consultan los identificadores para evitar cargar columnas
        # de Comisión que no son necesarias para esta validación.
        esta_en_comision = db.session.query(
            ComisionAsignatura.id_comision_asignatura
        ).filter(
            ComisionAsignatura.plan_asignaturas_id == id
        ).first()

        esta_en_correlativa = db.session.query(PACorrelativa.id).filter(
            PACorrelativa.pa_id == id
        ).first()

        if esta_en_comision or esta_en_correlativa:
            return respuesta_api(False, None, "No se puede quitar la asignatura del plan", 409, {
                "plan_asignatura": "No se puede quitar una asignatura asociada a comisiones o correlativas"
            })
        
        eliminar(plan)
        return respuesta_api(True, {"id": id}, "Asignatura quitada del plan correctamente")
    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {"database": "Error al eliminar"})
    except Exception as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error inesperado", 500, {"server": "Error inesperado"})
        
