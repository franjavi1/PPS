from models.rangos_institucionales import RangosInstitucionales
from schemas.rangos_institucionales_schema import (
    RangosInstitucionalesSchema,
    rango_institucional_schema
)
from db import db
from utils.auditoria import Auditoria


"""
Este archivo contiene la logica de negocio del CRUD de RangosInstitucionales
"""


def obtener_todos():
    return RangosInstitucionales.query.filter_by(estado=1).all()


def obtener_por_id(id):
    return RangosInstitucionales.query.get(id)


def crear(datos):
    nuevo_rango = rango_institucional_schema.load(datos)
    Auditoria.preparar_alta(nuevo_rango)
    db.session.add(nuevo_rango)
    db.session.commit()

    return nuevo_rango


def actualizar(rango, datos):
    Auditoria.preparar_modificacion(rango)
    schema = RangosInstitucionalesSchema(partial=True)

    # Evita que la validacion de descripcion unica tome como duplicado
    # al mismo rango que estamos editando.
    schema.context = {"rango_id": rango.id}

    schema.load(datos, instance=rango, partial=True)

    db.session.commit()

    return rango


def eliminar(rango):
    Auditoria.preparar_baja(rango)
    rango.estado = 0
    db.session.commit()

    return rango