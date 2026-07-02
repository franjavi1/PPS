from models.rangos_institucionales import RangosInstitucionales
from schemas.rangos_institucionales_schema import (
    RangosInstitucionalesSchema,
    rango_institucional_schema
)
from db import db


"""
Este archivo contiene la logica de negocio del CRUD de RangosInstitucionales
"""


def obtener_todos():
    return RangosInstitucionales.query.all()


def obtener_por_id(id):
    return RangosInstitucionales.query.get(id)


def crear(datos):
    nuevo_rango = rango_institucional_schema.load(datos)

    db.session.add(nuevo_rango)
    db.session.commit()

    return nuevo_rango


def actualizar(rango, datos):
    schema = RangosInstitucionalesSchema(partial=True)

    # Evita que la validacion de descripcion unica tome como duplicado
    # al mismo rango que estamos editando.
    schema.context = {"rango_id": rango.id}

    schema.load(datos, instance=rango, partial=True)

    db.session.commit()

    return rango


def eliminar(rango):
    db.session.delete(rango)
    db.session.commit()

    return rango
