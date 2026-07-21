from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError

from extensions import db
from schemas.legajo_rangos_schema import legajo_rangos_schema, legajos_rangos_schema

from services.legajo_rangos_service import (
    obtener_todos,
    obtener_por_id,
    crear,
    actualizar,
    eliminar
)


legajo_rangos_bp = Blueprint("legajo_rangos_bp", __name__, url_prefix="/legajo-rangos")


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


@legajo_rangos_bp.route("", methods=["GET"])
def get_legajos_rangos():
    try:
        legajos_rangos = obtener_todos()
        data = legajos_rangos_schema.dump(legajos_rangos)

        if len(data) == 0:
            return respuesta_api(True, [], "No se encontraron resultados")

        return respuesta_api(True, data, "Lista de legajos rangos obtenida")

    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al obtener la lista de legajos rangos"
        })

    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@legajo_rangos_bp.route("/<int:id>", methods=["GET"])
def get_legajo_rangos(id):
    try:
        legajo_rangos = obtener_por_id(id)

        if not legajo_rangos:
            return respuesta_api(False, None, "Legajo rango no encontrado", 404, {
                "id": "No existe un legajo rango con ese id"
            })

        data = legajo_rangos_schema.dump(legajo_rangos)

        return respuesta_api(True, data, "Legajo rango obtenido correctamente")

    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al obtener el legajo rango"
        })

    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@legajo_rangos_bp.route("", methods=["POST"])
def crear_legajo_rangos():
    req = request.get_json(silent=True) or {}

    try:
        nuevo_legajo_rangos = crear(req)
        data = legajo_rangos_schema.dump(nuevo_legajo_rangos)

        return respuesta_api(True, {"id": data["id"]}, "Legajo rango creado correctamente", 201)

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validacion", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al crear el legajo rango"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@legajo_rangos_bp.route("/<int:id>", methods=["PUT"])
def editar_legajo_rangos(id):
    try:
        legajo_rangos = obtener_por_id(id)

        if not legajo_rangos:
            return respuesta_api(False, None, "Legajo rango no encontrado", 404, {
                "id": "No existe un legajo rango con ese id"
            })

        req = request.get_json(silent=True) or {}
        legajo_rangos_actualizado = actualizar(legajo_rangos, req)
        data = legajo_rangos_schema.dump(legajo_rangos_actualizado)

        return respuesta_api(True, {"id": data["id"]}, "Legajo rango actualizado correctamente")

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validacion", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al actualizar el legajo rango"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@legajo_rangos_bp.route("/<int:id>", methods=["DELETE"])
def eliminar_legajo_rangos(id):
    try:
        legajo_rangos = obtener_por_id(id)

        if not legajo_rangos:
            return respuesta_api(False, None, "Legajo rango no encontrado", 404, {
                "id": "No existe un legajo rango con ese id"
            })

        eliminar(legajo_rangos)

        return respuesta_api(True, {"id": id}, "Legajo rango eliminado correctamente")

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al eliminar el legajo rango"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })
