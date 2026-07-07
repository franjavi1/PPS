from flask import Blueprint, jsonify, request
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError

from db import db
from schemas.condicion_academica_schema import (
    condicion_academica_schema,
    condiciones_academicas_schema
)
from services.condicion_academica_service import (
    actualizar,
    crear,
    eliminar,
    obtener_por_id,
    obtener_todos
)


condiciones_academicas_bp = Blueprint(
    "condiciones_academicas_bp",
    __name__,
    url_prefix="/condiciones-academicas"
)


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


@condiciones_academicas_bp.route("", methods=["GET"])
def get_condiciones_academicas():
    try:
        condiciones = obtener_todos()
        data = condiciones_academicas_schema.dump(condiciones)

        if len(data) == 0:
            return respuesta_api(True, [], "No se encontraron resultados")

        return respuesta_api(True, data, "Lista de condiciones academicas obtenida")

    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al obtener la lista de condiciones academicas"
        })

    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@condiciones_academicas_bp.route("/<int:id>", methods=["GET"])
def get_condicion_academica(id):
    try:
        condicion = obtener_por_id(id)

        if not condicion:
            return respuesta_api(False, None, "Condicion academica no encontrada", 404, {
                "id": "No existe una condicion academica con ese id"
            })

        data = condicion_academica_schema.dump(condicion)

        return respuesta_api(True, data, "Condicion academica obtenida correctamente")

    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al obtener la condicion academica"
        })

    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@condiciones_academicas_bp.route("", methods=["POST"])
def crear_condicion_academica():
    req = request.get_json(silent=True) or {}

    try:
        nueva_condicion = crear(req)
        data = condicion_academica_schema.dump(nueva_condicion)

        return respuesta_api(
            True,
            {"id": data["id_condicion_academica"]},
            "Condicion academica creada correctamente",
            201
        )

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validacion", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al crear la condicion academica"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@condiciones_academicas_bp.route("/<int:id>", methods=["PUT"])
def editar_condicion_academica(id):
    try:
        condicion = obtener_por_id(id)

        if not condicion:
            return respuesta_api(False, None, "Condicion academica no encontrada", 404, {
                "id": "No existe una condicion academica con ese id"
            })

        req = request.get_json(silent=True) or {}
        condicion_actualizada = actualizar(condicion, req)
        data = condicion_academica_schema.dump(condicion_actualizada)

        return respuesta_api(
            True,
            {"id": data["id_condicion_academica"]},
            "Condicion academica actualizada correctamente"
        )

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validacion", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al actualizar la condicion academica"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@condiciones_academicas_bp.route("/<int:id>", methods=["DELETE"])
def eliminar_condicion_academica(id):
    try:
        condicion = obtener_por_id(id)

        if not condicion:
            return respuesta_api(False, None, "Condicion academica no encontrada", 404, {
                "id": "No existe una condicion academica con ese id"
            })

        eliminar(condicion)

        return respuesta_api(True, {"id": id}, "Condicion academica eliminada correctamente")

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al eliminar la condicion academica"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })
