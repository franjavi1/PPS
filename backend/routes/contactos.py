from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError

from extensions import db
from schemas.contactos_schema import contacto_schema, contactos_schema

from services.contactos_service import (
    obtener_todos,
    obtener_por_id,
    crear,
    actualizar,
    eliminar
)


contactos_bp = Blueprint("contactos_bp", __name__, url_prefix="/contactos")


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


@contactos_bp.route("", methods=["GET"])
def get_contactos():
    try:
        contactos = obtener_todos()
        data = contactos_schema.dump(contactos)

        if len(data) == 0:
            return respuesta_api(True, [], "No se encontraron resultados")

        return respuesta_api(True, data, "Lista de contactos obtenida")

    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al obtener la lista de contactos"
        })

    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@contactos_bp.route("/<int:id>", methods=["GET"])
def get_contacto(id):
    try:
        contacto = obtener_por_id(id)

        if not contacto:
            return respuesta_api(False, None, "Contacto no encontrado", 404, {
                "id": "No existe un contacto con ese id"
            })

        data = contacto_schema.dump(contacto)

        return respuesta_api(True, data, "Contacto obtenido correctamente")

    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al obtener el contacto"
        })

    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@contactos_bp.route("", methods=["POST"])
def crear_contacto():
    req = request.get_json(silent=True) or {}

    try:
        nuevo_contacto = crear(req)
        data = contacto_schema.dump(nuevo_contacto)

        return respuesta_api(True, {"id": data["id"]}, "Contacto creado correctamente", 201)

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validacion", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al crear el contacto"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@contactos_bp.route("/<int:id>", methods=["PUT"])
def editar_contacto(id):
    try:
        contacto = obtener_por_id(id)

        if not contacto:
            return respuesta_api(False, None, "Contacto no encontrado", 404, {
                "id": "No existe un contacto con ese id"
            })

        req = request.get_json(silent=True) or {}
        contacto_actualizado = actualizar(contacto, req)
        data = contacto_schema.dump(contacto_actualizado)

        return respuesta_api(True, {"id": data["id"]}, "Contacto actualizado correctamente")

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validacion", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al actualizar el contacto"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@contactos_bp.route("/<int:id>", methods=["DELETE"])
def eliminar_contacto(id):
    try:
        contacto = obtener_por_id(id)

        if not contacto:
            return respuesta_api(False, None, "Contacto no encontrado", 404, {
                "id": "No existe un contacto con ese id"
            })

        eliminar(contacto)

        return respuesta_api(True, {"id": id}, "Contacto eliminado correctamente")

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al eliminar el contacto"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })
