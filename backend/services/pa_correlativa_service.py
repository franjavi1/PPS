from models.pa_correlativa import PACorrelativa
from schemas.pa_correlativa_schema import PACorrelativaSchema, pa_correlativa_schema
from db import db
from utils.auditoria import Auditoria

"""
Este archivo contiene la lógica de negocio del CRUD de PACorrelativas
"""

def obtener_todos():
    return PACorrelativa.query.all()

def obtener_por_id(id_pa_correlativa):
    return PACorrelativa.query.filter_by(id=id_pa_correlativa).first()

def crear(datos):
    nueva_relacion = pa_correlativa_schema.load(datos)
    db.session.add(nueva_relacion)
    db.session.commit()
    return nueva_relacion

def actualizar(pa_correlativa, datos):
    schema = PACorrelativaSchema(partial=True)
    schema.context = {"pa_correlativa_id": pa_correlativa.id}
    schema.load(datos, instance=pa_correlativa, partial=True)
    db.session.commit()
    return pa_correlativa


def eliminar(pa_correlativa):
    pa_correlativa.estado = 0
    db.session.commit()
    return pa_correlativa