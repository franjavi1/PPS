from backend.models.tipo_documento_model import TipoDocumento
from schemas.tipo_documento_schema import TipoDocumentoSchema, tipo_documento_schema
from db import db
from models.tipo_documento_model import TipoDocumentoModel
from datetime import datetime


"""
Este archivo contiene la logica de negocio del CRUD de TipoDocumento
"""

class TipoDocumentoService:

    @staticmethod
    def obtener_todos():
        # con esto hacemos como un join
        return TipoDocumentoModel.query.filter(TipoDocumentoModel.ts_baja == None).options(
            # joinedload(TipoDocumentoModel.documentos)
        ).all()

    @staticmethod
    def obtener_por_id(id):
        return TipoDocumento.query.get(id)

    @staticmethod
    def crear(datos):
        nuevo_tipo_documento = tipo_documento_schema.load(datos)

        db.session.add(nuevo_tipo_documento)
        db.session.commit()
        
        # tipo_documento.ts_alta = datetime.now()
        # tipo_documento.id_persona_alta = 1
        # damos de alta logica

        return nuevo_tipo_documento

    @staticmethod
    def actualizar(tipo_documento, datos):
        schema = TipoDocumentoSchema(partial=True)

        schema.context = {"tipo_documento_id": tipo_documento.id}

        schema.load(datos, instance=tipo_documento, partial=True)
        
        # tipo_documento.ts_modificacion = datetime.now()
        # tipo_documento.id_persona_modificacion = 1
        # damos de modificacion logica

        db.session.commit()

        return tipo_documento

    @staticmethod
    def eliminar(tipo_documento):
        
        # tipo_documento.ts_baja = datetime.now()
        # tipo_documento.id_persona_baja = 1
        # damos de baja logica
        db.session.commit()

        return tipo_documento
