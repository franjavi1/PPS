from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError

from db import db
from schemas.rangos_institucionales_schema import (
    rango_institucional_schema,
    rangos_institucionales_schema
)

from services.rangos_institucionales_service import (
    obtener_todos,
    obtener_por_id,
    crear,
    actualizar,
    eliminar
)


rangos_institucionales_bp = Blueprint(
    "rangos_institucionales_bp", __name__, url_prefix="/rangos-institucionales")


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


@rangos_institucionales_bp.route("", methods=["GET"])
def get_rangos_institucionales():
    try:
        rangos = obtener_todos()
        data = rangos_institucionales_schema.dump(rangos)

        if len(data) == 0:
            return respuesta_api(True, [], "No se encontraron resultados")

        return respuesta_api(True, data, "Lista de rangos institucionales obtenida")

    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al obtener la lista de rangos institucionales"
        })

    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@rangos_institucionales_bp.route("/<int:id>", methods=["GET"])
def get_rango_institucional(id):
    try:
        rango = obtener_por_id(id)

        if not rango:
            return respuesta_api(False, None, "Rango institucional no encontrado", 404, {
                "id": "No existe un rango institucional con ese id"
            })

        data = rango_institucional_schema.dump(rango)

        return respuesta_api(True, data, "Rango institucional obtenido correctamente")

    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al obtener el rango institucional"
        })

    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@rangos_institucionales_bp.route("", methods=["POST"])
def crear_rango_institucional():
    req = request.get_json(silent=True) or {}

    try:
        nuevo_rango = crear(req)
        data = rango_institucional_schema.dump(nuevo_rango)

        return respuesta_api(True, {"id": data["id"]}, "Rango institucional creado correctamente", 201)

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validacion", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al crear el rango institucional"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@rangos_institucionales_bp.route("/<int:id>", methods=["PUT"])
def editar_rango_institucional(id):
    try:
        rango = obtener_por_id(id)

        if not rango:
            return respuesta_api(False, None, "Rango institucional no encontrado", 404, {
                "id": "No existe un rango institucional con ese id"
            })

        req = request.get_json(silent=True) or {}
        rango_actualizado = actualizar(rango, req)
        data = rango_institucional_schema.dump(rango_actualizado)

        return respuesta_api(True, {"id": data["id"]}, "Rango institucional actualizado correctamente")

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validacion", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al actualizar el rango institucional"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@rangos_institucionales_bp.route("/<int:id>", methods=["DELETE"])
def eliminar_rango_institucional(id):
    try:
        rango = obtener_por_id(id)

        if not rango:
            return respuesta_api(False, None, "Rango institucional no encontrado", 404, {
                "id": "No existe un rango institucional con ese id"
            })

        eliminar(rango)

        return respuesta_api(True, {"id": id}, "Rango institucional eliminado correctamente")

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al eliminar el rango institucional"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })
