from flask import Blueprint, request, jsonify
from auth_common.decorador import requires_permission
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError

from db import db
from models.contactos import Contactos
from models.datos_medicos import DatosMedicos
from models.legajo import Legajo
from schemas.persona_schema import  persona_schema, personas_schema


from services.persona_service import (
    obtener_todos,
    obtener_por_id,
    crear,
    actualizar,
    eliminar
)



personas_bp = Blueprint("personas_bp",__name__, url_prefix="/personas")

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




@personas_bp.route("",methods=["GET"])
@requires_permission("planes.personas.leer")
def get_personas():
    try:
        personas = obtener_todos()
        data = personas_schema.dump(personas)

        if len(data)==0:
            return respuesta_api(True,[], "No se encontraron resultados")

        return respuesta_api(True, data,"Lista de personas obtenida")
    
    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500,{
            "database": "Ocurrió un error al obtener la lista de personas"

        })
    
    except Exception:
           return respuesta_api(False, None, "Error inesperado", 500,{
            "server": "Ocurrio un error inesperado"

        })

@personas_bp.route("/<int:id>",methods=["GET"])
@requires_permission("planes.personas.leer")
def get_persona(id):
    try:
        persona = obtener_por_id(id)

        if not persona:
            return respuesta_api(False, None, "Persona no encontrada",404,{
                "id": "No existe una persona activa con ese id"
            })

        data = persona_schema.dump(persona)
        
        return respuesta_api(True, data,"Persona obtenida correctamente")
    
    except SQLAlchemyError:
        return respuesta_api(False, None, "Error de base de datos", 500,{
            "database": "Ocurrió un error al obtener la lista de personas"

        })
    
    except Exception:
           return respuesta_api(False, None, "Error inesperado", 500,{
            "server": "Ocurrio un error inesperado"

        })
    

@personas_bp.route("",methods=["POST"])
@requires_permission("planes.personas.crear")
def crear_persona():
    req = request.get_json(silent=True) or {}
    try:
        nueva_persona= crear(req)
        data = persona_schema.dump(nueva_persona)
        return respuesta_api(True,{"id": data["id"]}, "Persona creada correctamente", 201)

    except ValidationError as e:
        db.session.rollback()

       
        
        return respuesta_api(False, None, "Error de validacion", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()

        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al crear la persona"
        })

    except Exception as e:
        db.session.rollback()
        print(e)

        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@personas_bp.route("/<int:id>",methods=["PUT"])
@requires_permission("planes.personas.editar")
def editar_persona(id):
    
    try:
        persona = obtener_por_id(id)
        
        if not persona:
            return respuesta_api(False, None, "Persona no encontrada",404,{
                "id": "No existe una persona activa con ese id"
            })
        req = request.get_json(silent=True) or {}
        persona_actualizada = actualizar(persona, req)
        data = persona_schema.dump(persona_actualizada)

        return respuesta_api(True,{"id": data["id"]}, "Persona actualizada correctamente")

    except ValidationError as e:
        db.session.rollback()

       
        
        return respuesta_api(False, None, "Error de validacion", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()

        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al actualizar la persona"
        })

    except Exception as e:
        db.session.rollback()
        print(e)

        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })
    


@personas_bp.route("/<int:id>",methods=["DELETE"])
@requires_permission("planes.personas.eliminar")
def eliminar_persona(id):
    
    try:
        persona = obtener_por_id(id)
        
        if not persona:
            return respuesta_api(False, None, "Persona no encontrada",404,{
                "id": "No existe una persona activa con ese id"
            })

        esta_en_uso = (
            Legajo.query.filter_by(persona_id=id, estado=1).first()
            or Contactos.query.filter_by(persona_id=id).first()
            or DatosMedicos.query.filter_by(persona_id=id).first()
        )

        if esta_en_uso:
            return respuesta_api(False, None, "No se puede eliminar la persona", 409, {
                "persona": "No se puede eliminar una persona con legajo, contactos o datos medicos asociados"
            })

        eliminar(persona)

        return respuesta_api(True,{"id": id}, "Persona eliminada correctamente")
    
    except SQLAlchemyError:
        db.session.rollback()

        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrió un error al eliminar la persona"
        })

    except Exception as e:
        db.session.rollback()
        print(e)

        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })





    
