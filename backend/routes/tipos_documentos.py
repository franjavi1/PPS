from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError

from db import db
from schemas.tipo_documento_schema import tipo_documento_schema, tipos_documento_schema


from services.tipo_documento_service import (
    obtener_todos,
    obtener_por_id,
    crear,
    actualizar,
    eliminar
)



tipos_documentos_bp = Blueprint("tipos_documentos_bp",__name__, url_prefix="/tipos-documentos")

#Helper para formatear todas las respuestas de la API
def respuesta_api(success=True, data=None, message="",status=200, errors=None):
    response={
        "status": "success" if success else "error",
        "message" : message
    }
    if data is not None:
        response["data"]= data

        if isinstance(data,list):
            response["total"] = len(data)

    if errors is not None:
        response["errors"] = errors

    return jsonify(response),status




@tipos_documentos_bp.route("",methods=["GET"])
def get_tipos_documentos():
    try:
        tipos_documentos = obtener_todos()
        data = tipos_documento_schema.dump(tipos_documentos)

        if len(data)==0:
            return respuesta_api(True,[], "No se encontraron resultados")

        return respuesta_api(True, data,"Lista de tipos de documento obtenida")

    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500,{
            "database": "Ocurrió un error al obtener la lista de tipos de documento"

        })

    except Exception:
           return respuesta_api(False, None, "Error inesperado", 500,{
            "server": "Ocurrio un error inesperado"

        })


@tipos_documentos_bp.route("/<int:id>",methods=["GET"])
def get_tipo_documento(id):
    try:
        tipo_documento = obtener_por_id(id)

        if not tipo_documento:
            return respuesta_api(False, None, "Tipo de documento no encontrado",404,{
                "id": "No existe un tipo de documento con ese id"
            })

        data = tipo_documento_schema.dump(tipo_documento)

        return respuesta_api(True, data,"Tipo de documento obtenido correctamente")

    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500,{
            "database": "Ocurrió un error al obtener el tipo de documento"

        })

    except Exception:
           return respuesta_api(False, None, "Error inesperado", 500,{
            "server": "Ocurrio un error inesperado"

        })


@tipos_documentos_bp.route("",methods=["POST"])
def crear_tipo_documento():
    req = request.get_json(silent=True) or {}
    try:
        nuevo_tipo_documento= crear(req)
        data = tipo_documento_schema.dump(nuevo_tipo_documento)

        return respuesta_api(True,{"id": data["id"]}, "Tipo de documento creado correctamente", 201)

    except ValidationError as e:
        db.session.rollback()

        return respuesta_api(False, None, "Error de validación", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()

        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrió un error al crear el tipo de documento"
        })

    except Exception as e:
        db.session.rollback()
        print(e)

        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrió un error inesperado"
        })


@tipos_documentos_bp.route("/<int:id>",methods=["PUT"])
def editar_tipo_documento(id):

    try:
        tipo_documento = obtener_por_id(id)

        if not tipo_documento:
            return respuesta_api(False, None, "Tipo de documento no encontrado",404,{
                "id": "No existe un tipo de documento con ese id"
            })

        req = request.get_json(silent=True) or {}
        tipo_documento_actualizado = actualizar(tipo_documento, req)
        data = tipo_documento_schema.dump(tipo_documento_actualizado)

        return respuesta_api(True,{"id": data["id"]}, "Tipo de documento actualizado correctamente")

    except ValidationError as e:
        db.session.rollback()

        return respuesta_api(False, None, "Error de validación", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()

        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrió un error al actualizar el tipo de documento"
        })

    except Exception as e:
        db.session.rollback()
        print(e)

        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrió un error inesperado"
        })


@tipos_documentos_bp.route("/<int:id>",methods=["DELETE"])
def eliminar_tipo_documento(id):

    try:
        tipo_documento = obtener_por_id(id)

        if not tipo_documento:
            return respuesta_api(False, None, "Tipo de documento no encontrado",404,{
                "id": "No existe un tipo de documento con ese id"
            })

        eliminar(tipo_documento)

        return respuesta_api(True,{"id": id}, "Tipo de documento eliminado correctamente")

    except SQLAlchemyError:
        db.session.rollback()

        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrió un error al eliminar el tipo de documento"
        })

    except Exception as e:
        db.session.rollback()
        print(e)

        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrió un error inesperado"
        })
