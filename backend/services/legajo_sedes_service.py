from models.legajo_sedes import LegajoSedes
from schemas.legajo_sedes_schema import LegajoSedesSchema, legajo_sedes_schema
from db import db


"""
Este archivo contiene la logica de negocio del CRUD de LegajoSedes
"""


def obtener_todos():
    return LegajoSedes.query.all()


def obtener_por_id(id):
    return LegajoSedes.query.get(id)


def crear(datos):
    nuevo_legajo_sedes = legajo_sedes_schema.load(datos)

    db.session.add(nuevo_legajo_sedes)
    db.session.commit()

    return nuevo_legajo_sedes


def actualizar(legajo_sedes, datos):
    schema = LegajoSedesSchema(partial=True)

    # Evita que las validaciones de relacion unica tomen como duplicado
    # al mismo registro que estamos editando.
    schema.context = {
        "legajo_sedes_id": legajo_sedes.id,
        "legajo_sedes": legajo_sedes
    }

    schema.load(datos, instance=legajo_sedes, partial=True)

    db.session.commit()

    return legajo_sedes


def eliminar(legajo_sedes):
    db.session.delete(legajo_sedes)
    db.session.commit()

    return legajo_sedes