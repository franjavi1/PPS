from models.tipo_documento import TipoDocumento
from schemas.tipo_documento_schema import TipoDocumentoSchema, tipo_documento_schema
from db import db


"""
Este archivo contiene la logica de negocio del CRUD de TipoDocumento
"""


def obtener_todos():
    return TipoDocumento.query.all()


def obtener_por_id(id):
    return TipoDocumento.query.get(id)


def crear(datos):
    nuevo_tipo_documento = tipo_documento_schema.load(datos)

    db.session.add(nuevo_tipo_documento)
    db.session.commit()

    return nuevo_tipo_documento


def actualizar(tipo_documento, datos):
    schema = TipoDocumentoSchema(partial=True)

    # Evita que la validacion de descripcion unica tome como duplicado
    # al mismo tipo de documento que estamos editando.
    schema.context = {"tipo_documento_id": tipo_documento.id}

    schema.load(datos, instance=tipo_documento, partial=True)

    db.session.commit()

    return tipo_documento


def eliminar(tipo_documento):
    db.session.delete(tipo_documento)
    db.session.commit()

    return tipo_documento
