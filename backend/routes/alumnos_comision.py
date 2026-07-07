from flask import Blueprint, jsonify, request
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError

from db import db
from schemas.alumno_comision_schema import (
    alumno_comision_schema,
    alumnos_comision_schema
)
from services.alumno_comision_service import (
    actualizar,
    crear,
    eliminar,
    obtener_por_id,
    obtener_todos
)


alumnos_comision_bp = Blueprint(
    "alumnos_comision_bp",
    __name__,
    url_prefix="/alumnos-comision"
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


@alumnos_comision_bp.route("", methods=["GET"])
def get_alumnos_comision():
    try:
        alumnos_comision = obtener_todos()
        data = alumnos_comision_schema.dump(alumnos_comision)

        if len(data) == 0:
            return respuesta_api(True, [], "No se encontraron resultados")

        return respuesta_api(True, data, "Lista de alumnos por comision obtenida")

    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al obtener la lista de alumnos por comision"
        })

    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@alumnos_comision_bp.route("/<int:id>", methods=["GET"])
def get_alumno_comision(id):
    try:
        alumno_comision = obtener_por_id(id)

        if not alumno_comision:
            return respuesta_api(False, None, "Alumno de comision no encontrado", 404, {
                "id": "No existe un alumno de comision con ese id"
            })

        data = alumno_comision_schema.dump(alumno_comision)

        return respuesta_api(True, data, "Alumno de comision obtenido correctamente")

    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al obtener el alumno de comision"
        })

    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@alumnos_comision_bp.route("", methods=["POST"])
def crear_alumno_comision():
    req = request.get_json(silent=True) or {}

    try:
        nuevo_alumno_comision = crear(req)
        data = alumno_comision_schema.dump(nuevo_alumno_comision)

        return respuesta_api(
            True,
            {"id": data["id_historia_alumnos"]},
            "Alumno de comision creado correctamente",
            201
        )

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validacion", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al crear el alumno de comision"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@alumnos_comision_bp.route("/<int:id>", methods=["PUT"])
def editar_alumno_comision(id):
    try:
        alumno_comision = obtener_por_id(id)

        if not alumno_comision:
            return respuesta_api(False, None, "Alumno de comision no encontrado", 404, {
                "id": "No existe un alumno de comision con ese id"
            })

        req = request.get_json(silent=True) or {}
        alumno_comision_actualizado = actualizar(alumno_comision, req)
        data = alumno_comision_schema.dump(alumno_comision_actualizado)

        return respuesta_api(
            True,
            {"id": data["id_historia_alumnos"]},
            "Alumno de comision actualizado correctamente"
        )

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validacion", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al actualizar el alumno de comision"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@alumnos_comision_bp.route("/<int:id>", methods=["DELETE"])
def eliminar_alumno_comision(id):
    try:
        alumno_comision = obtener_por_id(id)

        if not alumno_comision:
            return respuesta_api(False, None, "Alumno de comision no encontrado", 404, {
                "id": "No existe un alumno de comision con ese id"
            })

        eliminar(alumno_comision)

        return respuesta_api(
            True,
            {"id": id},
            "Alumno de comision eliminado correctamente"
        )

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al eliminar el alumno de comision"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })
