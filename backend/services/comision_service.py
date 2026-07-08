from models.comision import Comision
from schemas.comision_schema import ComisionSchema, comision_schema
from db import db

"""
Este archivo contiene la lógica de negocio del CRUD de Comision
"""

def obtener_todos():
    return Comision.query.all()

def obtener_por_id(id_comision):
    return Comision.query.filter_by(id_comision=id_comision).first()

def crear(datos):
    nueva_comision = comision_schema.load(datos)
    db.session.add(nueva_comision)
    db.session.commit()
    return nueva_comision

def actualizar(comision, datos):
    schema = ComisionSchema(partial=True)

    schema.context = {"comision_id": comision.id_comision}
    schema.load(datos, instance=comision, partial=True)

    db.session.commit()
    return comision

def eliminar(comision):
    db.session.delete(comision)
    db.session.commit()
    return comision
