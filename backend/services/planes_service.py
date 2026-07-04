from models.planes import Planes
from schemas.planes_schema import PlanesSchema, plan_schema
from db import db

"""
Este archivo contiene la logica de negocio del CRUD de Planes
"""


def obtener_todos():
    return Planes.query.filter_by(estado=1).all()


def obtener_por_id(id):
    return Planes.query.filter_by(id=id, estado=1).first()


def crear(datos):
    nuevo_plan = plan_schema.load(datos)

    db.session.add(nuevo_plan)
    db.session.commit()

    return nuevo_plan


def actualizar(plan, datos):
    schema = PlanesSchema(partial=True)

    schema.load(datos, instance=plan, partial=True)

    db.session.commit()

    return plan


def eliminar(plan):
    plan.estado = 0
    db.session.commit()

    return plan
