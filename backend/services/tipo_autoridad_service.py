from models.tipos_autoridad import TipoAutoridad
from schemas.tipo_autoridad_schema import TipoAutoridadSchema, tipo_autoridad_schema
from db import db

"""
Este archivo contiene la lógica de negocio del CRUD de TipoAutoridad
"""

def obtener_todos():
    return TipoAutoridad.query.all()

def obtener_por_id(id_tipo_autoridad):
    return TipoAutoridad.query.filter_by(id=id_tipo_autoridad).first()

def crear(datos):
    nuevo_tipo = tipo_autoridad_schema.load(datos)
    db.session.add(nuevo_tipo)
    db.session.commit()
    return nuevo_tipo

def actualizar(tipo_autoridad, datos):
    schema = TipoAutoridadSchema(partial=True)
    schema.context = {"tipo_autoridad_id": tipo_autoridad.id}
    schema.load(datos, instance=tipo_autoridad, partial=True)
    db.session.commit()
    return tipo_autoridad

def eliminar(tipo_autoridad):
    db.session.delete(tipo_autoridad)
    db.session.commit()
    return tipo_autoridad