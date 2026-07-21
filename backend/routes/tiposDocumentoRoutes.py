# /backend/routes/tiposDocumentoRoutes.py
from flask import Blueprint, request
from services.tiposDocumentoService import TiposDocumentoService
from utils.utilidades import responder

tipos_documento_bp = Blueprint('tipos_documento_bp', __name__)

@tipos_documento_bp.route('', methods=['GET'])
def obtener_tipos_documento():
    result = TiposDocumentoService.listar_todos()
    return responder(data=result, message="Lista de tipos de documento obtenida")
    
@tipos_documento_bp.route('/count', methods=['GET'])
def obtener_cantidad_tipos_documento():
    result = TiposDocumentoService.contar_todos()
    return responder(data=result, message="Cantidad tipos documentos obtenida")

@tipos_documento_bp.route('/<int:id>', methods=['GET'])
def obtener_tipo_documento(id):
    result = TiposDocumentoService.get_por_id(id)
    return responder(data=result)
    

@tipos_documento_bp.route('', methods=['POST'])
def crear_tipo_documento():
    data = request.json
    result = TiposDocumentoService.crear_tipo_documento(data)
    return responder(data=result, message="Tipo de documento creado con exito", status=201)
    

@tipos_documento_bp.route('/<int:id>', methods=['PUT'])
def editar_tipo_documento(id):
    data = request.json
    result = TiposDocumentoService.editar_tipo_documento(id, data)
    return responder(data=result, message="Tipo de documento actualizado con exito")


@tipos_documento_bp.route('/<int:id>', methods=['DELETE'])
def eliminar_tipo_documento(id):
    TiposDocumentoService.delete_tipo_documento(id)
    return responder(data=[], message="Tipo de documento eliminado correctamente")