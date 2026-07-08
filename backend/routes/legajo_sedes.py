from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError

from db import db
from schemas.legajo_sedes_schema import legajo_sedes_schema, legajos_sedes_schema

from services.legajo_sedes_service import (
    obtener_todos,
    obtener_por_id,
    crear,
    actualizar,
    eliminar
)


legajo_sedes_bp = Blueprint("legajo_sedes_bp", __name__, url_prefix="/legajo-sedes")


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


@legajo_sedes_bp.route("", methods=["GET"])
def get_legajos_sedes():
    try:
        legajos_sedes = obtener_todos()
        data = legajos_sedes_schema.dump(legajos_sedes)

        if len(data) == 0:
            return respuesta_api(True, [], "No se encontraron resultados")

        return respuesta_api(True, data, "Lista de legajos sedes obtenida")

    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al obtener la lista de legajos sedes"
        })

    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@legajo_sedes_bp.route("/<int:id>", methods=["GET"])
def get_legajo_sedes(id):
    try:
        legajo_sedes = obtener_por_id(id)

        if not legajo_sedes:
            return respuesta_api(False, None, "Legajo sede no encontrado", 404, {
                "id": "No existe un legajo sede con ese id"
            })

        data = legajo_sedes_schema.dump(legajo_sedes)

        return respuesta_api(True, data, "Legajo sede obtenido correctamente")

    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al obtener el legajo sede"
        })

    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@legajo_sedes_bp.route("", methods=["POST"])
def crear_legajo_sedes():
    req = request.get_json(silent=True) or {}

    try:
        nuevo_legajo_sedes = crear(req)
        data = legajo_sedes_schema.dump(nuevo_legajo_sedes)

        return respuesta_api(True, {"id": data["id"]}, "Legajo sede creado correctamente", 201)

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validacion", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al crear el legajo sede"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@legajo_sedes_bp.route("/<int:id>", methods=["PUT"])
def editar_legajo_sedes(id):
    try:
        legajo_sedes = obtener_por_id(id)

        if not legajo_sedes:
            return respuesta_api(False, None, "Legajo sede no encontrado", 404, {
                "id": "No existe un legajo sede con ese id"
            })

        req = request.get_json(silent=True) or {}
        legajo_sedes_actualizado = actualizar(legajo_sedes, req)
        data = legajo_sedes_schema.dump(legajo_sedes_actualizado)

        return respuesta_api(True, {"id": data["id"]}, "Legajo sede actualizado correctamente")

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validacion", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al actualizar el legajo sede"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@legajo_sedes_bp.route("/<int:id>", methods=["DELETE"])
def eliminar_legajo_sedes(id):
    try:
        legajo_sedes = obtener_por_id(id)

        if not legajo_sedes:
            return respuesta_api(False, None, "Legajo sede no encontrado", 404, {
                "id": "No existe un legajo sede con ese id"
            })

        eliminar(legajo_sedes)

        return respuesta_api(True, {"id": id}, "Legajo sede eliminado correctamente")

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al eliminar el legajo sede"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })
