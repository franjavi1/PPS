from flask import Blueprint, request, jsonify
from auth_common.decorador import requires_permission
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError

from db import db
from models.sedes import Sedes
from schemas.tipo_sede_schema import tipo_sede_schema, tipos_sedes_schema

from services.tipo_sede_service import (
    obtener_todos,
    obtener_por_id,
    crear,
    actualizar,
    eliminar
)


tipos_sedes_bp = Blueprint(
    "tipos_sedes_bp", __name__, url_prefix="/tipos-sedes")


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


@tipos_sedes_bp.route("", methods=["GET"])
@requires_permission("planes.sedes.leer")
def get_tipos_sedes():
    try:
        tipos_sedes = obtener_todos()
        data = tipos_sedes_schema.dump(tipos_sedes)

        if len(data) == 0:
            return respuesta_api(True, [], "No se encontraron resultados")

        return respuesta_api(True, data, "Lista de tipos de sede obtenida")

    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al obtener la lista de tipos de sede"
        })

    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@tipos_sedes_bp.route("/<int:id>", methods=["GET"])
@requires_permission("planes.sedes.leer")
def get_tipo_sede(id):
    try:
        tipo_sede = obtener_por_id(id)

        if not tipo_sede:
            return respuesta_api(False, None, "Tipo de sede no encontrado", 404, {
                "id": "No existe un tipo de sede con ese id"
            })

        data = tipo_sede_schema.dump(tipo_sede)

        return respuesta_api(True, data, "Tipo de sede obtenido correctamente")

    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al obtener el tipo de sede"
        })

    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@tipos_sedes_bp.route("", methods=["POST"])
@requires_permission("planes.sedes.crear")
def crear_tipo_sede():
    req = request.get_json(silent=True) or {}

    try:
        nuevo_tipo_sede = crear(req)
        data = tipo_sede_schema.dump(nuevo_tipo_sede)

        return respuesta_api(True, {"id": data["id"]}, "Tipo de sede creado correctamente", 201)

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validacion", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al crear el tipo de sede"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@tipos_sedes_bp.route("/<int:id>", methods=["PUT"])
@requires_permission("planes.sedes.editar")
def editar_tipo_sede(id):
    try:
        tipo_sede = obtener_por_id(id)

        if not tipo_sede:
            return respuesta_api(False, None, "Tipo de sede no encontrado", 404, {
                "id": "No existe un tipo de sede con ese id"
            })

        req = request.get_json(silent=True) or {}
        tipo_sede_actualizado = actualizar(tipo_sede, req)
        data = tipo_sede_schema.dump(tipo_sede_actualizado)

        return respuesta_api(True, {"id": data["id"]}, "Tipo de sede actualizado correctamente")

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validacion", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al actualizar el tipo de sede"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@tipos_sedes_bp.route("/<int:id>", methods=["DELETE"])
@requires_permission("planes.sedes.eliminar")
def eliminar_tipo_sede(id):
    try:
        tipo_sede = obtener_por_id(id)

        if not tipo_sede:
            return respuesta_api(False, None, "Tipo de sede no encontrado", 404, {
                "id": "No existe un tipo de sede con ese id"
            })

        esta_en_uso = Sedes.query.filter_by(tipo_sede_id=id).first()

        if esta_en_uso:
            return respuesta_api(False, None, "No se puede eliminar el tipo de sede", 409, {
                "tipo_sede": "No se puede eliminar un tipo de sede asociado a sedes"
            })

        eliminar(tipo_sede)

        return respuesta_api(True, {"id": id}, "Tipo de sede eliminado correctamente")

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al eliminar el tipo de sede"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })
