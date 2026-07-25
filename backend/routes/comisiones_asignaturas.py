from flask import Blueprint, jsonify, request
from auth_common.decorador import requires_permission
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError

from db import db
from models.autoridad_comision import AutoridadComision
from schemas.comision_asignatura_schema import (
    comision_asignatura_schema,
    comisiones_asignaturas_schema
)
from services.comision_asignatura_service import (
    actualizar,
    crear,
    eliminar,
    obtener_por_id,
    obtener_todos
)


comisiones_asignaturas_bp = Blueprint(
    "comisiones_asignaturas_bp",
    __name__,
    url_prefix="/comisiones-asignaturas"
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


@comisiones_asignaturas_bp.route("", methods=["GET"])
@requires_permission("planes.comisiones.leer")
def get_comisiones_asignaturas():
    try:
        comisiones_asignaturas = obtener_todos()
        data = comisiones_asignaturas_schema.dump(comisiones_asignaturas)

        if len(data) == 0:
            return respuesta_api(True, [], "No se encontraron resultados")

        return respuesta_api(True, data, "Lista de comisiones asignaturas obtenida")

    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al obtener la lista de comisiones asignaturas"
        })

    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@comisiones_asignaturas_bp.route("/<int:id>", methods=["GET"])
@requires_permission("planes.comisiones.leer")
def get_comision_asignatura(id):
    try:
        comision_asignatura = obtener_por_id(id)

        if not comision_asignatura:
            return respuesta_api(False, None, "Comision asignatura no encontrada", 404, {
                "id": "No existe una comision asignatura con ese id"
            })

        data = comision_asignatura_schema.dump(comision_asignatura)

        return respuesta_api(True, data, "Comision asignatura obtenida correctamente")

    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al obtener la comision asignatura"
        })

    except Exception:
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@comisiones_asignaturas_bp.route("", methods=["POST"])
@requires_permission("planes.comisiones.crear")
def crear_comision_asignatura():
    req = request.get_json(silent=True) or {}

    try:
        nueva_comision_asignatura = crear(req)
        data = comision_asignatura_schema.dump(nueva_comision_asignatura)

        return respuesta_api(
            True,
            {"id_comision_asignatura": data["id_comision_asignatura"]},
            "Comision asignatura creada correctamente",
            201
        )

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validacion", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al crear la comision asignatura"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@comisiones_asignaturas_bp.route("/<int:id>", methods=["PUT"])
@requires_permission("planes.comisiones.editar")
def editar_comision_asignatura(id):
    try:
        comision_asignatura = obtener_por_id(id)

        if not comision_asignatura:
            return respuesta_api(False, None, "Comision asignatura no encontrada", 404, {
                "id": "No existe una comision asignatura con ese id"
            })

        req = request.get_json(silent=True) or {}
        comision_asignatura_actualizada = actualizar(comision_asignatura, req)
        data = comision_asignatura_schema.dump(comision_asignatura_actualizada)

        return respuesta_api(
            True,
            {"id_comision_asignatura": data["id_comision_asignatura"]},
            "Comision asignatura actualizada correctamente"
        )

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validacion", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al actualizar la comision asignatura"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@comisiones_asignaturas_bp.route("/<int:id>", methods=["DELETE"])
@requires_permission("planes.comisiones.eliminar")
def eliminar_comision_asignatura(id):
    try:
        comision_asignatura = obtener_por_id(id)

        if not comision_asignatura:
            return respuesta_api(False, None, "Comision asignatura no encontrada", 404, {
                "id": "No existe una comision asignatura con ese id"
            })

        esta_en_uso = AutoridadComision.query.filter_by(
            comision_id=id,
        ).first()

        if esta_en_uso:
            return respuesta_api(False, None, "No se puede eliminar la comision asignatura", 409, {
                "comision_asignatura": "No se puede eliminar una comision asignatura con autoridades asociadas"
            })

        eliminar(comision_asignatura)

        return respuesta_api(
            True,
            {"id_comision_asignatura": id},
            "Comision asignatura eliminada correctamente"
        )

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al eliminar la comision asignatura"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })
