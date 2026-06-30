from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError

from db import db
from schemas.sedes_schema import sede_schema, sedes_schema

from services.sedes_service import (
    obtener_todos,
    obtener_por_id,
    crear,
    actualizar,
    eliminar
)


sedes_bp = Blueprint("sedes_bp", __name__, url_prefix="/sedes")


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


@sedes_bp.route("", methods=["GET"])
def get_sedes():
    try:
        sedes = obtener_todos()
        data = sedes_schema.dump(sedes)

        if len(data) == 0:
            return respuesta_api(True, [], "No se encontraron resultados")

        return respuesta_api(True, data, "Lista de sedes obtenida")

    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al obtener la lista de sedes"
        })

    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@sedes_bp.route("/<int:id>", methods=["GET"])
def get_sede(id):
    try:
        sede = obtener_por_id(id)

        if not sede:
            return respuesta_api(False, None, "Sede no encontrada", 404, {
                "id": "No existe una sede con ese id"
            })

        data = sede_schema.dump(sede)

        return respuesta_api(True, data, "Sede obtenida correctamente")

    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al obtener la sede"
        })

    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@sedes_bp.route("", methods=["POST"])
def crear_sede():
    req = request.get_json(silent=True) or {}

    try:
        nueva_sede = crear(req)
        data = sede_schema.dump(nueva_sede)

        return respuesta_api(True, {"id": data["id"]}, "Sede creada correctamente", 201)

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validacion", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al crear la sede"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@sedes_bp.route("/<int:id>", methods=["PUT"])
def editar_sede(id):
    try:
        sede = obtener_por_id(id)

        if not sede:
            return respuesta_api(False, None, "Sede no encontrada", 404, {
                "id": "No existe una sede con ese id"
            })

        req = request.get_json(silent=True) or {}
        sede_actualizada = actualizar(sede, req)
        data = sede_schema.dump(sede_actualizada)

        return respuesta_api(True, {"id": data["id"]}, "Sede actualizada correctamente")

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validacion", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al actualizar la sede"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@sedes_bp.route("/<int:id>", methods=["DELETE"])
def eliminar_sede(id):
    try:
        sede = obtener_por_id(id)

        if not sede:
            return respuesta_api(False, None, "Sede no encontrada", 404, {
                "id": "No existe una sede con ese id"
            })

        eliminar(sede)

        return respuesta_api(True, {"id": id}, "Sede eliminada correctamente")

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al eliminar la sede"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })
