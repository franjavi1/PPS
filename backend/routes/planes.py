from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError

from db import db
from schemas.planes_schema import plan_schema, planes_schema

from services.planes_service import (
    obtener_todos,
    obtener_por_id,
    crear,
    actualizar,
    eliminar
)
# Rutas para el CRUD de planes.
planes_bp = Blueprint("planes_bp", __name__, url_prefix="/planes")

# Helper para formatear todas las respuestas de la API


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


@planes_bp.route("", methods=["GET"])
def get_planes():
    try:
        planes = obtener_todos()
        data = planes_schema.dump(planes)

        if len(data) == 0:
            return respuesta_api(True, [], "No se encontraron resultados")

        return respuesta_api(True, data, "Lista de planes obtenida")

    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al obtener la lista de planes"

        })

    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@planes_bp.route("/<int:id>", methods=["GET"])
def get_plan(id):
    try:
        plan = obtener_por_id(id)

        if not plan:
            return respuesta_api(False, None, "Plan no encontrado", 404, {
                "id": "No existe un plan activo con ese id"

            })

        data = plan_schema.dump(plan)

        return respuesta_api(True, data, "Plan obtenido correctamente")

    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al obtener el plan"
        })

    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@planes_bp.route("", methods=["POST"])
def crear_planes():
    req = request.get_json(silent=True) or {}
    try:
        nuevo_plan = crear(req)
        data = plan_schema.dump(nuevo_plan)

        return respuesta_api(True, {"id": data["id"]}, "Plan creado correctamente", 201)

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validacion", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error en la base de datos", 500, {
            "database": "Ocurrio un error al crear el plan"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado "
        })


@planes_bp.route("/<int:id>", methods=["PUT"])
def editar_plan(id):

    try:
        plan = obtener_por_id(id)

        if not plan:
            return respuesta_api(False, None, "Plan no encontrado", 404, {
                "id": "No existe un plan con ese id"})

        req = request.get_json(silent=True) or {}
        plan_actualizado = actualizar(plan, req)
        data = plan_schema.dump(plan_actualizado)

        return respuesta_api(True, {"id": data["id"]}, "Plan actualizado correctamente")

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validacion", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al actualizar el plan"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@planes_bp.route("/<int:id>", methods=["DELETE"])
def eliminar_plan(id):
    try:
        plan = obtener_por_id(id)

        if not plan:
            return respuesta_api(False, None, "Plan no encontrado", 404, {
                "id": "No existe un plan con ese id"
            })
        
        eliminar(plan)

        return respuesta_api(True, {"id": id}, "Plan eliminado correctamente")

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al eliminar el plan"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado",500, {
            "server": "Ocurrio un error inesperado"
        })
    