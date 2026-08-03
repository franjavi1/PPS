from models.datos_medicos import DatosMedicos
from schemas.datos_medicos_schema import DatosMedicosSchema, datos_medicos_schema
from db import db
from utils.auditoria import Auditoria


"""
Este archivo contiene la logica de negocio del CRUD de DatosMedicos
"""


def obtener_todos():
    return DatosMedicos.query.filter_by(estado=1).all()


def obtener_por_id(id):
    return DatosMedicos.query.get(id)


def crear(datos):
    nuevos_datos_medicos = datos_medicos_schema.load(datos)
    Auditoria.preparar_alta(nuevos_datos_medicos)
    db.session.add(nuevos_datos_medicos)
    db.session.commit()

    return nuevos_datos_medicos


def actualizar(datos_medicos, datos):
    Auditoria.preparar_modificacion(datos_medicos)
    schema = DatosMedicosSchema(partial=True)

    schema.load(datos, instance=datos_medicos, partial=True)

    db.session.commit()

    return datos_medicos


def eliminar(datos_medicos):
    Auditoria.preparar_baja(datos_medicos)
    datos_medicos.estado = 0
    db.session.commit()

    return datos_medicos