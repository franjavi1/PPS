from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError

from db import db
from schemas.legajo_schema import legajo_schema, legajos_schema

from services.legajo_service import (
    obtener_todos,
    obtener_por_id,
    crear,
    actualizar,
    eliminar
)


legajos_bp = Blueprint("legajos_bp", __name__, url_prefix="/legajos")


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


@legajos_bp.route("", methods=["GET"])
def get_legajos():
    try:
        legajos = obtener_todos()
        data = legajos_schema.dump(legajos)

        if len(data) == 0:
            return respuesta_api(True, [], "No se encontraron resultados")

        return respuesta_api(True, data, "Lista de legajos obtenida")

    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al obtener la lista de legajos"
        })

    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@legajos_bp.route("/<int:id>", methods=["GET"])
def get_legajo(id):
    try:
        legajo = obtener_por_id(id)

        if not legajo:
            return respuesta_api(False, None, "Legajo no encontrado", 404, {
                "id": "No existe un legajo activo con ese id"
            })

        data = legajo_schema.dump(legajo)

        return respuesta_api(True, data, "Legajo obtenido correctamente")

    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al obtener el legajo"
        })

    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@legajos_bp.route("", methods=["POST"])
def crear_legajo():
    req = request.get_json(silent=True) or {}

    try:
        nuevo_legajo = crear(req)
        data = legajo_schema.dump(nuevo_legajo)

        return respuesta_api(True, {"id": data["id"]}, "Legajo creado correctamente", 201)

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validacion", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al crear el legajo"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@legajos_bp.route("/<int:id>", methods=["PUT"])
def editar_legajo(id):
    try:
        legajo = obtener_por_id(id)

        if not legajo:
            return respuesta_api(False, None, "Legajo no encontrado", 404, {
                "id": "No existe un legajo activo con ese id"
            })

        req = request.get_json(silent=True) or {}
        legajo_actualizado = actualizar(legajo, req)
        data = legajo_schema.dump(legajo_actualizado)

        return respuesta_api(True, {"id": data["id"]}, "Legajo actualizado correctamente")

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validacion", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al actualizar el legajo"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@legajos_bp.route("/<int:id>", methods=["DELETE"])
def eliminar_legajo(id):
    try:
        legajo = obtener_por_id(id)

        if not legajo:
            return respuesta_api(False, None, "Legajo no encontrado", 404, {
                "id": "No existe un legajo activo con ese id"
            })

        eliminar(legajo)

        return respuesta_api(True, {"id": id}, "Legajo eliminado correctamente")

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al eliminar el legajo"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })
