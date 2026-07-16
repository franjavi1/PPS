from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError
from utils.response import responder
from utils.errores import Error_de_negocio
from db import db
from models.persona import Persona
from schemas.tipo_documento_schema import tipo_documento_schema, tipos_documento_schema
from services.tipo_documento_service import TipoDocumentoService



tipos_documentos_bp = Blueprint("tipos_documentos_bp",__name__)


@tipos_documentos_bp.route("",methods=["GET"])
def get_tipos_documentos():
    tipos_documentos = TipoDocumentoService.obtener_todos()
    tipos_documentos_validado = tipos_documento_schema.dump(tipos_documentos)

    return responder(data=tipos_documentos_validado, message="Tipos documentos obtenidos con existo", status=200)



@tipos_documentos_bp.route("/<int:id>",methods=["GET"])
def get_tipo_documento(id):
    tipo_documento = TipoDocumentoService.obtener_por_id(id)
    
    if tipo_documento is None:
        raise Error_de_negocio(message="Tipo de documento no encontrado", status=404)

    data = tipo_documento_schema.dump(tipo_documento)

    return responder(data=data, message="Tipo de documento obtenido correctamente")



@tipos_documentos_bp.route("", methods=["POST"])
def crear_tipo_documento():
    req = request.get_json(silent=True) or {}
    
    nuevo_tipo_documento = TipoDocumentoService.crear(req)
    data = tipo_documento_schema.dump(nuevo_tipo_documento)
    
    return responder(data={"id": data["id"]}, message="Tipo de documento creado correctamente", status=201)


@tipos_documentos_bp.route("/<int:id>", methods=["PUT"])
def editar_tipo_documento(id):
    tipo_documento = TipoDocumentoService.obtener_por_id(id)
    if not tipo_documento:
        raise Error_de_negocio(message="Tipo de documento no encontrado", status=404)

    req = request.get_json(silent=True) or {}
    tipo_documento_actualizado = TipoDocumentoService.actualizar(tipo_documento, req)
    data = tipo_documento_schema.dump(tipo_documento_actualizado)
    
    return responder(data={"id": data["id"]}, message="Tipo de documento actualizado correctamente")


@tipos_documentos_bp.route("/<int:id>", methods=["DELETE"])
def eliminar_tipo_documento(id):
    tipo_documento = TipoDocumentoService.obtener_por_id(id)
    if not tipo_documento:
        raise Error_de_negocio(message="Tipo de documento no encontrado", status=404)
    
    # tiene_documentacion_activa = Otra_Tabla.query.filter(
    #         Otra_Tabla.id_tipo_documento == id,
    #         Otra_Tabla.tsBaja == None
    #     ).first() is not None
# 
    # if tiene_documentacion_activa is not None:
    #     raise Error_de_negocio(
    #         message="No se puede eliminar un tipo de documento asociado a personas activas", 
    #         status=409
    #     )

    TipoDocumentoService.eliminar(tipo_documento)
    return responder(data={"id": id}, message="Tipo de documento eliminado correctamente")