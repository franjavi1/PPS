from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError

from db import db
from schemas.asignaturas_schema import asignatura_schema, asignaturas_schema

from services.asignaturas_service import (
    obtener_todos,
    obtener_por_id,
    crear,
    actualizar,
    eliminar
)

# Rutas para el CRUD de asignaturas.
asignaturas_bp = Blueprint("asignaturas_bp", __name__, url_prefix="/asignaturas")


# Helper para formatear todas las respuestas de la API.
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


@asignaturas_bp.route("", methods=["GET"])
def get_asignaturas():
    try:
        asignaturas = obtener_todos()
        data = asignaturas_schema.dump(asignaturas)

        if len(data) == 0:
            return respuesta_api(True, [], "No se encontraron resultados")

        return respuesta_api(True, data, "Lista de asignaturas obtenida")

    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al obtener la lista de asignaturas"
        })

    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@asignaturas_bp.route("/<int:id>", methods=["GET"])
def get_asignatura(id):
    try:
        asignatura = obtener_por_id(id)

        if not asignatura:
            return respuesta_api(False, None, "Asignatura no encontrada", 404, {
                "id": "No existe una asignatura activa con ese id"
            })

        data = asignatura_schema.dump(asignatura)

        return respuesta_api(True, data, "Asignatura obtenida correctamente")

    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al obtener la asignatura"
        })

    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@asignaturas_bp.route("", methods=["POST"])
def crear_asignatura():
    req = request.get_json(silent=True) or {}

    try:
        nueva_asignatura = crear(req)
        data = asignatura_schema.dump(nueva_asignatura)

        return respuesta_api(True, {"id": data["id"]}, "Asignatura creada correctamente", 201)

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validacion", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al crear la asignatura"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@asignaturas_bp.route("/<int:id>", methods=["PUT"])
def editar_asignatura(id):
    try:
        asignatura = obtener_por_id(id)

        if not asignatura:
            return respuesta_api(False, None, "Asignatura no encontrada", 404, {
                "id": "No existe una asignatura activa con ese id"
            })

        req = request.get_json(silent=True) or {}
        asignatura_actualizada = actualizar(asignatura, req)
        data = asignatura_schema.dump(asignatura_actualizada)

        return respuesta_api(True, {"id": data["id"]}, "Asignatura actualizada correctamente")

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validacion", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al actualizar la asignatura"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@asignaturas_bp.route("/<int:id>", methods=["DELETE"])
def eliminar_asignatura(id):
    try:
        asignatura = obtener_por_id(id)

        if not asignatura:
            return respuesta_api(False, None, "Asignatura no encontrada", 404, {
                "id": "No existe una asignatura activa con ese id"
            })

        eliminar(asignatura)

        return respuesta_api(True, {"id": id}, "Asignatura eliminada correctamente")

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al eliminar la asignatura"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })
