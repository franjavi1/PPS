from models.asignaturas import Asignaturas
from schemas.asignaturas_schema import AsignaturasSchema, asignatura_schema
from db import db

"""
Este archivo contiene la logica de negocio del CRUD de Asignaturas
"""

def obtener_todos():
    return Asignaturas.query.filter_by(estado=1).all()

def obtener_por_id(id):
    return Asignaturas.query.filter_by(id=id, estado=1).first()


def crear(datos):
    nueva_asignatura = asignatura_schema.load(datos)

    db.session.add(nueva_asignatura)
    db.session.commit()

    return nueva_asignatura


def actualizar(asignatura, datos):
    schema = AsignaturasSchema(partial=True)

    schema.load(datos, instance=asignatura, partial=True)

    db.session.commit()

    return asignatura


def eliminar(asignatura):
    asignatura.estado = 0
    db.session.commit()

    return asignatura
