from models.tipo_planes import TipoPlanes
from schemas.tipo_planes_schema import TipoPlanesSchema, tipo_planes_schema
from db import db

"""
Este archivo contiene la logica de negocio del CRUD de TipoPlanes
"""


def obtener_todos():
    return TipoPlanes.query.all()


def obtener_por_id(id):
    return TipoPlanes.query.get(id)


def crear(datos):
    nuevo_tipo_plan = tipo_planes_schema.load(datos)

    db.session.add(nuevo_tipo_plan)
    db.session.commit()

    return nuevo_tipo_plan


def actualizar(tipo_plan, datos):

    schema = TipoPlanesSchema(partial=True)

    # Evita que la validacion de nombre unico tome como duplicado
    # al mismo tipo de plan que estamos editando.
    schema.context = {"tipo_planes_id": tipo_plan.id_tipo_planes}

    schema.load(datos, instance=tipo_plan, partial=True)

    db.session.commit()

    return tipo_plan


def eliminar(tipo_plan):
    db.session.delete(tipo_plan)
    db.session.commit()

    return tipo_plan
