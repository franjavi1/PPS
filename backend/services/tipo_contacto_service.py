from models.tipo_contacto import TipoContacto
from schemas.tipo_contacto_schema import TipoContactoSchema, tipo_contacto_schema
from db import db
from utils.auditoria import Auditoria


"""
Este archivo contiene la logica de negocio del CRUD de TipoContacto
"""


def obtener_todos():
    return TipoContacto.query.filter_by(estado=1).all()


def obtener_por_id(id):
    return TipoContacto.query.get(id)


def crear(datos):
    nuevo_tipo_contacto = tipo_contacto_schema.load(datos)
    Auditoria.preparar_alta(nuevo_tipo_contacto)
    db.session.add(nuevo_tipo_contacto)
    db.session.commit()

    return nuevo_tipo_contacto


def actualizar(tipo_contacto, datos):
    Auditoria.preparar_modificacion(tipo_contacto)
    schema = TipoContactoSchema(partial=True)

    # Evita que la validacion de tipo unico tome como duplicado
    # al mismo tipo de contacto que estamos editando.
    schema.context = {"tipo_contacto_id": tipo_contacto.id}

    schema.load(datos, instance=tipo_contacto, partial=True)

    db.session.commit()

    return tipo_contacto


def eliminar(tipo_contacto):
    Auditoria.preparar_baja(tipo_contacto)
    tipo_contacto.estado = 0
    db.session.commit()

    return tipo_contacto