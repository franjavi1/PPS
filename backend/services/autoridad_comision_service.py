from models.autoridad_comision import AutoridadComision
from schemas.autoridad_comision_schema import (
    AutoridadComisionSchema,
    autoridad_comision_schema
)
from db import db


def obtener_todos():
    return AutoridadComision.query.all()


def obtener_por_id(id):
    return AutoridadComision.query.get(id)


def crear(datos):
    nueva_autoridad_comision = autoridad_comision_schema.load(datos)

    db.session.add(nueva_autoridad_comision)
    db.session.commit()

    return nueva_autoridad_comision


def actualizar(autoridad_comision, datos):
    schema = AutoridadComisionSchema(partial=True)
    schema.context = {"autoridad_comision_id": autoridad_comision.id}

    schema.load(datos, instance=autoridad_comision, partial=True)

    db.session.commit()

    return autoridad_comision


def eliminar(autoridad_comision):
    db.session.delete(autoridad_comision)
    db.session.commit()

    return autoridad_comision
