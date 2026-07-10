from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError

from db import db
from models.contactos import Contactos
from schemas.tipo_contacto_schema import tipo_contacto_schema, tipos_contacto_schema

from services.tipo_contacto_service import (
    obtener_todos,
    obtener_por_id,
    crear,
    actualizar,
    eliminar
)


tipos_contacto_bp = Blueprint(
    "tipos_contacto_bp", __name__, url_prefix="/tipos-contacto")


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


@tipos_contacto_bp.route("", methods=["GET"])
def get_tipos_contacto():
    try:
        tipos_contacto = obtener_todos()
        data = tipos_contacto_schema.dump(tipos_contacto)

        if len(data) == 0:
            return respuesta_api(True, [], "No se encontraron resultados")

        return respuesta_api(True, data, "Lista de tipos de contacto obtenida")

    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al obtener la lista de tipos de contacto"
        })

    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@tipos_contacto_bp.route("/<int:id>", methods=["GET"])
def get_tipo_contacto(id):
    try:
        tipo_contacto = obtener_por_id(id)

        if not tipo_contacto:
            return respuesta_api(False, None, "Tipo de contacto no encontrado", 404, {
                "id": "No existe un tipo de contacto con ese id"
            })

        data = tipo_contacto_schema.dump(tipo_contacto)

        return respuesta_api(True, data, "Tipo de contacto obtenido correctamente")

    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al obtener el tipo de contacto"
        })

    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@tipos_contacto_bp.route("", methods=["POST"])
def crear_tipo_contacto():
    req = request.get_json(silent=True) or {}

    try:
        nuevo_tipo_contacto = crear(req)
        data = tipo_contacto_schema.dump(nuevo_tipo_contacto)

        return respuesta_api(True, {"id": data["id"]}, "Tipo de contacto creado correctamente", 201)

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validacion", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al crear el tipo de contacto"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@tipos_contacto_bp.route("/<int:id>", methods=["PUT"])
def editar_tipo_contacto(id):
    try:
        tipo_contacto = obtener_por_id(id)

        if not tipo_contacto:
            return respuesta_api(False, None, "Tipo de contacto no encontrado", 404, {
                "id": "No existe un tipo de contacto con ese id"
            })

        req = request.get_json(silent=True) or {}
        tipo_contacto_actualizado = actualizar(tipo_contacto, req)
        data = tipo_contacto_schema.dump(tipo_contacto_actualizado)

        return respuesta_api(True, {"id": data["id"]}, "Tipo de contacto actualizado correctamente")

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validacion", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al actualizar el tipo de contacto"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@tipos_contacto_bp.route("/<int:id>", methods=["DELETE"])
def eliminar_tipo_contacto(id):
    try:
        tipo_contacto = obtener_por_id(id)

        if not tipo_contacto:
            return respuesta_api(False, None, "Tipo de contacto no encontrado", 404, {
                "id": "No existe un tipo de contacto con ese id"
            })

        esta_en_uso = Contactos.query.filter_by(tipo_contacto_id=id).first()

        if esta_en_uso:
            return respuesta_api(False, None, "No se puede eliminar el tipo de contacto", 409, {
                "tipo_contacto": "No se puede eliminar un tipo de contacto asociado a contactos"
            })

        eliminar(tipo_contacto)

        return respuesta_api(True, {"id": id}, "Tipo de contacto eliminado correctamente")

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al eliminar el tipo de contacto"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })
