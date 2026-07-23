from models.tipo_contacto import TipoContacto
from schemas.tipo_contacto_schema import TipoContactoSchema, tipo_contacto_schema
from db import db


"""
Este archivo contiene la logica de negocio del CRUD de TipoContacto
"""


def obtener_todos():
    return TipoContacto.query.all()


def obtener_por_id(id):
    return TipoContacto.query.get(id)


def crear(datos):
    nuevo_tipo_contacto = tipo_contacto_schema.load(datos)

    db.session.add(nuevo_tipo_contacto)
    db.session.commit()

    return nuevo_tipo_contacto


def actualizar(tipo_contacto, datos):
    schema = TipoContactoSchema(partial=True)

    # Evita que la validacion de tipo unico tome como duplicado
    # al mismo tipo de contacto que estamos editando.
    schema.context = {"tipo_contacto_id": tipo_contacto.id}

    schema.load(datos, instance=tipo_contacto, partial=True)

    db.session.commit()

    return tipo_contacto


def eliminar(tipo_contacto):
    db.session.delete(tipo_contacto)
    db.session.commit()

    return tipo_contacto