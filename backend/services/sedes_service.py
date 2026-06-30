from models.sedes import Sedes
from schemas.sedes_schema import sede_schema
from db import db


"""
Este archivo contiene la logica de negocio del CRUD de Sedes
"""


def obtener_todos():
    return Sedes.query.all()


def obtener_por_id(id):
    return Sedes.query.get(id)


def crear(datos):
    nueva_sede = sede_schema.load(datos)

    db.session.add(nueva_sede)
    db.session.commit()

    return nueva_sede


def actualizar(sede, datos):
    sede_schema.load(datos, instance=sede, partial=True)

    db.session.commit()

    return sede


def eliminar(sede):
    db.session.delete(sede)
    db.session.commit()

    return sede
