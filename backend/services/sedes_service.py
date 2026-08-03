from models.sedes import Sedes
from schemas.sedes_schema import sede_schema
from db import db
from utils.auditoria import Auditoria


"""
Este archivo contiene la logica de negocio del CRUD de Sedes
"""


def obtener_todos():
    return Sedes.query.filter_by(estado=1).all()


def obtener_por_id(id):
    return Sedes.query.get(id)


def crear(datos):
    nueva_sede = sede_schema.load(datos)
    Auditoria.preparar_alta(nueva_sede)
    db.session.add(nueva_sede)
    db.session.commit()

    return nueva_sede


def actualizar(sede, datos):
    Auditoria.preparar_modificacion(sede)
    sede_schema.load(datos, instance=sede, partial=True)

    db.session.commit()

    return sede


def eliminar(sede):
    Auditoria.preparar_baja(sede)
    sede.estado = 0
    db.session.commit()

    return sede