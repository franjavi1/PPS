from models.datos_medicos import DatosMedicos
from schemas.datos_medicos_schema import DatosMedicosSchema, datos_medicos_schema
from extensions import db


"""
Este archivo contiene la logica de negocio del CRUD de DatosMedicos
"""


def obtener_todos():
    return DatosMedicos.query.all()


def obtener_por_id(id):
    return DatosMedicos.query.get(id)


def crear(datos):
    nuevos_datos_medicos = datos_medicos_schema.load(datos)

    db.session.add(nuevos_datos_medicos)
    db.session.commit()

    return nuevos_datos_medicos


def actualizar(datos_medicos, datos):
    schema = DatosMedicosSchema(partial=True)

    schema.load(datos, instance=datos_medicos, partial=True)

    db.session.commit()

    return datos_medicos


def eliminar(datos_medicos):
    db.session.delete(datos_medicos)
    db.session.commit()

    return datos_medicos
