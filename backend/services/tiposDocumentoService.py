# /backend/services/tiposDocumentoService.py
from models.tiposDocumentoModel import TiposDocumentoModel
from schemas.tiposDocumentoSchema import tipoDocumentoSchema, tiposDocumentoSchema
from extensions import db
from utils.errores import APIError
from utils.auditoria import Auditoria

class TiposDocumentoService:

    @staticmethod
    def listar_todos():
        listado = TiposDocumentoModel.query.filter(TiposDocumentoModel.tsBaja == None).all()
        return tiposDocumentoSchema.dump(listado)
    
    @staticmethod
    def contar_todos():
        listado = TiposDocumentoModel.query.filter(TiposDocumentoModel.tsBaja == None).count()
        return tiposDocumentoSchema.dump(listado)

    @staticmethod
    def get_por_id(id):
        tipo_doc = TiposDocumentoModel.query.filter(TiposDocumentoModel.idTipoDocumento == id, TiposDocumentoModel.tsBaja == None).first()
        if not tipo_doc or tipo_doc.tsBaja is not None:
            raise APIError("Tipo de documento no encontrado.", status=404)
        return tipoDocumentoSchema.dump(tipo_doc)

    @staticmethod
    def crear_tipo_documento(data):

        tipo_doc = tipoDocumentoSchema.load(data)
        
        descripcion = data.get('descripcion')
        if descripcion:
            descripcion_normalizada = descripcion.strip().upper()
            if descripcion_normalizada != tipo_doc.descripcion:
                if TiposDocumentoService.existe_descripcion(descripcion_normalizada):
                    raise APIError("La nueva descripcion ya se encuentra registrada", status=400)
        else:
            raise APIError("La descripcion no puede estar vacia", status=400)

        if TiposDocumentoService.existe_descripcion(tipo_doc.descripcion):
            raise APIError("La descripcion del tipo de documento ya se encuentra registrada", status=400)

        Auditoria.preparar_alta(tipo_doc)

        db.session.add(tipo_doc)
        db.session.commit()
        return tipoDocumentoSchema.dump(tipo_doc)

    @staticmethod
    def editar_tipo_documento(id, data):
        tipo_doc = db.session.get(TiposDocumentoModel, id)
        if not tipo_doc or tipo_doc.tsBaja is not None:
            raise APIError("Tipo de documento no encontrado", status=404)

        descripcion = data.get('descripcion')
        if descripcion:
            descripcion_normalizada = descripcion.strip().upper()
            if descripcion_normalizada != tipo_doc.descripcion:
                if TiposDocumentoService.existe_descripcion(descripcion_normalizada):
                    raise APIError("La nueva descripcion ya se encuentra registrada", status=400)
        else:
            raise APIError("La descripcion no puede estar vacia", status=400)

        tipo_doc_modificado = tipoDocumentoSchema.load(data, instance=tipo_doc, partial=True)
        
        Auditoria.preparar_modificacion(tipo_doc_modificado)

        db.session.commit()
        return tipoDocumentoSchema.dump(tipo_doc_modificado)
        

    @staticmethod
    def delete_tipo_documento(id):
        tipo_doc = db.session.get(TiposDocumentoModel, id)
        if not tipo_doc or tipo_doc.tsBaja is not None:
            raise APIError("Tipo de documento no encontrado", status=404)
        
        Auditoria.preparar_baja(tipo_doc)

        db.session.commit()
        return True

    @staticmethod
    def existe_descripcion(descripcion):
        tipo_doc = TiposDocumentoModel.query.filter(
            TiposDocumentoModel.descripcion == descripcion,
            TiposDocumentoModel.tsBaja == None
        ).first()
        return tipo_doc is not None