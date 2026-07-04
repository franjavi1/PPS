from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError

from db import db
from schemas.tipo_planes_schema import tipo_planes_schema, tipos_planes_schema

from services.tipo_planes_service import (
    obtener_todos,
    obtener_por_id,
    crear,
    actualizar,
    eliminar
)

tipos_planes_bp = Blueprint(
    "tipos_planes_bp", __name__, url_prefix="/tipos-planes")


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


@tipos_planes_bp.route("", methods=["GET"])
def get_tipos_planes():
    try:
        tipos_planes = obtener_todos()
        data = tipos_planes_schema.dump(tipos_planes)

        if len(data) == 0:
            return respuesta_api(True, [], "No se encontraron resultados")

        return respuesta_api(True, data, "Lista de tipos de planes obtenida")

    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al obtener la lista de tipos de planes"
        })

    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@tipos_planes_bp.route("/<int:id>", methods=["GET"])
def get_tipo_plan(id):
    try:
        tipo_plan = obtener_por_id(id)

        if not tipo_plan:
            return respuesta_api(False, None, "Tipo de plan no encontrado", 404, {
                "id": "No existe un tipo de plan con ese id"
            })

        data = tipo_planes_schema.dump(tipo_plan)

        return respuesta_api(True, data, "Tipo de plan obtenido correctamente")

    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al obtener el tipo de plan"
        })

    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@tipos_planes_bp.route("", methods=["POST"])
def crear_tipo_plan():
    req = request.get_json(silent=True) or {}

    try:
        nuevo_tipo_plan = crear(req)
        data = tipo_planes_schema.dump(nuevo_tipo_plan)

        return respuesta_api(True, {"id": data["id_tipo_planes"]}, "Tipo de plan creado correctamente", 201)

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validacion", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al crear el tipo de plan"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@tipos_planes_bp.route("/<int:id>", methods=["PUT"])
def editar_tipo_plan(id):

    try:

        tipo_plan = obtener_por_id(id)

        if not tipo_plan:
            return respuesta_api(False, None, "Tipo de plan no encontrado", 404, {
                "id": "No existe un tipo de plan con ese id"
            })

        req = request.get_json(silent=True) or {}
        tipo_plan_actualizado = actualizar(tipo_plan, req)
        data = tipo_planes_schema.dump(tipo_plan_actualizado)

        return respuesta_api(True, {"id": data["id_tipo_planes"]}, "Tipo de plan actualizado correctamente")

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validacion", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al actualizar el tipo de plan"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@tipos_planes_bp.route("/<int:id>", methods=["DELETE"])
def eliminar_tipo_planes(id):
    try:
        tipo_plan = obtener_por_id(id)
        if not tipo_plan:
            return respuesta_api(False, None, "Tipo de plan no encontrado", 404, {
                "id": "No existe un tipo de plan con ese id"
            })

        eliminar(tipo_plan)

        return respuesta_api(True, {"id": id}, "Tipo de plan eliminado correctamente")

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al eliminar el tipo de plan"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })
