from flask import Blueprint, request, jsonify
from auth_common.decorador import requires_permission
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError

from db import db
from schemas.datos_medicos_schema import datos_medicos_schema, datos_medicos_lista_schema

from services.datos_medicos_service import (
    obtener_todos,
    obtener_por_id,
    crear,
    actualizar,
    eliminar
)


datos_medicos_bp = Blueprint("datos_medicos_bp", __name__, url_prefix="/datos-medicos")


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


@datos_medicos_bp.route("", methods=["GET"])
@requires_permission("planes.personas.leer")
def get_datos_medicos():
    try:
        datos_medicos = obtener_todos()
        data = datos_medicos_lista_schema.dump(datos_medicos)

        if len(data) == 0:
            return respuesta_api(True, [], "No se encontraron resultados")

        return respuesta_api(True, data, "Lista de datos medicos obtenida")

    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al obtener la lista de datos medicos"
        })

    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@datos_medicos_bp.route("/<int:id>", methods=["GET"])
@requires_permission("planes.personas.leer")
def get_datos_medicos_por_id(id):
    try:
        datos_medicos = obtener_por_id(id)

        if not datos_medicos:
            return respuesta_api(False, None, "Datos medicos no encontrados", 404, {
                "id": "No existen datos medicos con ese id"
            })

        data = datos_medicos_schema.dump(datos_medicos)

        return respuesta_api(True, data, "Datos medicos obtenidos correctamente")

    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al obtener los datos medicos"
        })

    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@datos_medicos_bp.route("", methods=["POST"])
@requires_permission("planes.personas.crear")
def crear_datos_medicos():
    req = request.get_json(silent=True) or {}

    try:
        nuevos_datos_medicos = crear(req)
        data = datos_medicos_schema.dump(nuevos_datos_medicos)

        return respuesta_api(True, {"id": data["id"]}, "Datos medicos creados correctamente", 201)

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validacion", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al crear los datos medicos"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@datos_medicos_bp.route("/<int:id>", methods=["PUT"])
@requires_permission("planes.personas.editar")
def editar_datos_medicos(id):
    try:
        datos_medicos = obtener_por_id(id)

        if not datos_medicos:
            return respuesta_api(False, None, "Datos medicos no encontrados", 404, {
                "id": "No existen datos medicos con ese id"
            })

        req = request.get_json(silent=True) or {}
        datos_medicos_actualizados = actualizar(datos_medicos, req)
        data = datos_medicos_schema.dump(datos_medicos_actualizados)

        return respuesta_api(True, {"id": data["id"]}, "Datos medicos actualizados correctamente")

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validacion", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al actualizar los datos medicos"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@datos_medicos_bp.route("/<int:id>", methods=["DELETE"])
@requires_permission("planes.personas.eliminar")
def eliminar_datos_medicos(id):
    try:
        datos_medicos = obtener_por_id(id)

        if not datos_medicos:
            return respuesta_api(False, None, "Datos medicos no encontrados", 404, {
                "id": "No existen datos medicos con ese id"
            })

        eliminar(datos_medicos)

        return respuesta_api(True, {"id": id}, "Datos medicos eliminados correctamente")

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al eliminar los datos medicos"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })
