from models.contactos import Contactos
from schemas.contactos_schema import ContactosSchema, contacto_schema
from db import db


"""
Este archivo contiene la logica de negocio del CRUD de Contactos
"""


def obtener_todos():
    return Contactos.query.all()


def obtener_por_id(id):
    return Contactos.query.get(id)


def crear(datos):
    nuevo_contacto = contacto_schema.load(datos)

    db.session.add(nuevo_contacto)
    db.session.commit()

    return nuevo_contacto


def actualizar(contacto, datos):
    schema = ContactosSchema(partial=True)

    # Evita que la validacion de contacto unico tome como duplicado
    # al mismo contacto que estamos editando.
    schema.context = {"contacto_id": contacto.id}

    schema.load(datos, instance=contacto, partial=True)

    db.session.commit()

    return contacto


def eliminar(contacto):
    contacto.estado = 0
    db.session.commit()

    return contacto
