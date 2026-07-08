from models.legajo_rangos import LegajoRangos
from schemas.legajo_rangos_schema import LegajoRangosSchema, legajo_rangos_schema
from db import db


"""
Este archivo contiene la logica de negocio del CRUD de LegajoRangos
"""


def obtener_todos():
    return LegajoRangos.query.all()


def obtener_por_id(id):
    return LegajoRangos.query.get(id)


def crear(datos):
    nuevo_legajo_rangos = legajo_rangos_schema.load(datos)

    db.session.add(nuevo_legajo_rangos)
    db.session.commit()

    return nuevo_legajo_rangos


def actualizar(legajo_rangos, datos):
    schema = LegajoRangosSchema(partial=True)

    # Evita que la validacion de relacion unica tome como duplicado
    # al mismo registro que estamos editando.
    schema.context = {"legajo_rangos_id": legajo_rangos.id}

    schema.load(datos, instance=legajo_rangos, partial=True)

    db.session.commit()

    return legajo_rangos


def eliminar(legajo_rangos):
    db.session.delete(legajo_rangos)
    db.session.commit()

    return legajo_rangos
