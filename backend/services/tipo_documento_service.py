from models.tipo_documento import TipoDocumento
from schemas.tipo_documento_schema import TipoDocumentoSchema, tipo_documento_schema
from db import db
from utils.auditoria import Auditoria


"""
Este archivo contiene la logica de negocio del CRUD de TipoDocumento
"""


def obtener_todos():
    return TipoDocumento.query.filter_by(estado=1).all()


def obtener_por_id(id):
    return TipoDocumento.query.get(id)


def crear(datos):
    nuevo_tipo_documento = tipo_documento_schema.load(datos)
    Auditoria.preparar_alta(nuevo_tipo_documento)
    db.session.add(nuevo_tipo_documento)
    db.session.commit()

    return nuevo_tipo_documento


def actualizar(tipo_documento, datos):
    Auditoria.preparar_modificacion(tipo_documento)
    schema = TipoDocumentoSchema(partial=True)

    # Evita que la validacion de descripcion unica tome como duplicado
    # al mismo tipo de documento que estamos editando.
    schema.context = {"tipo_documento_id": tipo_documento.id}

    schema.load(datos, instance=tipo_documento, partial=True)

    db.session.commit()

    return tipo_documento


def eliminar(tipo_documento):
    Auditoria.preparar_baja(tipo_documento)
    tipo_documento.estado = 0
    db.session.commit()

    return tipo_documento