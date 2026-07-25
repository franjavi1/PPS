from flask import Blueprint, jsonify, request
from auth_common.decorador import requires_permission
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError

from db import db
from schemas.autoridad_comision_schema import (
    autoridad_comision_schema,
    autoridades_comision_schema
)
from services.autoridad_comision_service import (
    actualizar,
    crear,
    eliminar,
    obtener_por_id,
    obtener_todos
)


autoridades_comision_bp = Blueprint(
    "autoridades_comision_bp",
    __name__,
    url_prefix="/autoridades-comision"
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


@autoridades_comision_bp.route("", methods=["GET"])
@requires_permission("planes.comisiones.leer")
def get_autoridades_comision():
    try:
        autoridades_comision = obtener_todos()
        data = autoridades_comision_schema.dump(autoridades_comision)

        if len(data) == 0:
            return respuesta_api(True, [], "No se encontraron resultados")

        return respuesta_api(True, data, "Lista de autoridades de comision obtenida")

    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al obtener la lista de autoridades de comision"
        })

    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@autoridades_comision_bp.route("/<int:id>", methods=["GET"])
@requires_permission("planes.comisiones.leer")
def get_autoridad_comision(id):
    try:
        autoridad_comision = obtener_por_id(id)

        if not autoridad_comision:
            return respuesta_api(False, None, "Autoridad de comision no encontrada", 404, {
                "id": "No existe una autoridad de comision con ese id"
            })

        data = autoridad_comision_schema.dump(autoridad_comision)

        return respuesta_api(True, data, "Autoridad de comision obtenida correctamente")

    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al obtener la autoridad de comision"
        })

    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@autoridades_comision_bp.route("", methods=["POST"])
@requires_permission("planes.comisiones.crear")
def crear_autoridad_comision():
    req = request.get_json(silent=True) or {}

    try:
        nueva_autoridad_comision = crear(req)
        data = autoridad_comision_schema.dump(nueva_autoridad_comision)

        return respuesta_api(
            True,
            {"id": data["id"]},
            "Autoridad de comision creada correctamente",
            201
        )

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validacion", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al crear la autoridad de comision"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@autoridades_comision_bp.route("/<int:id>", methods=["PUT"])
@requires_permission("planes.comisiones.editar")
def editar_autoridad_comision(id):
    try:
        autoridad_comision = obtener_por_id(id)

        if not autoridad_comision:
            return respuesta_api(False, None, "Autoridad de comision no encontrada", 404, {
                "id": "No existe una autoridad de comision con ese id"
            })

        req = request.get_json(silent=True) or {}
        autoridad_comision_actualizada = actualizar(autoridad_comision, req)
        data = autoridad_comision_schema.dump(autoridad_comision_actualizada)

        return respuesta_api(
            True,
            {"id": data["id"]},
            "Autoridad de comision actualizada correctamente"
        )

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validacion", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al actualizar la autoridad de comision"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@autoridades_comision_bp.route("/<int:id>", methods=["DELETE"])
@requires_permission("planes.comisiones.eliminar")
def eliminar_autoridad_comision(id):
    try:
        autoridad_comision = obtener_por_id(id)

        if not autoridad_comision:
            return respuesta_api(False, None, "Autoridad de comision no encontrada", 404, {
                "id": "No existe una autoridad de comision con ese id"
            })

        eliminar(autoridad_comision)

        return respuesta_api(
            True,
            {"id": id},
            "Autoridad de comision eliminada correctamente"
        )

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al eliminar la autoridad de comision"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })
