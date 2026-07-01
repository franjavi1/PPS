from models.legajo import Legajo
from schemas.legajo_schema import LegajoSchema, legajo_schema
from db import db


"""
Este archivo contiene la logica de negocio del CRUD de Legajo
"""


def obtener_todos():
    return Legajo.query.filter_by(estado=1).all()


def obtener_por_id(id):
    return Legajo.query.filter_by(id=id, estado=1).first()


def crear(datos):
    nuevo_legajo = legajo_schema.load(datos)

    db.session.add(nuevo_legajo)
    db.session.commit()

    return nuevo_legajo


def actualizar(legajo, datos):
    schema = LegajoSchema(partial=True)

    # Evita que la validacion de numero unico tome como duplicado
    # al mismo legajo que estamos editando.
    schema.context = {"legajo_id": legajo.id}

    schema.load(datos, instance=legajo, partial=True)

    db.session.commit()

    return legajo


def eliminar(legajo):
    legajo.estado = 0
    db.session.commit()

    return legajo
