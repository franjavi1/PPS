from models.tipos_autoridad import TipoAutoridad
from schemas.tipo_autoridad_schema import TipoAutoridadSchema, tipo_autoridad_schema
from db import db
from utils.auditoria import Auditoria

"""
Este archivo contiene la lógica de negocio del CRUD de TipoAutoridad
"""

def obtener_todos():
    return TipoAutoridad.query.filter_by(estado=1).all()

def obtener_por_id(id_tipo_autoridad):
    return TipoAutoridad.query.filter_by(id=id_tipo_autoridad).first()

def crear(datos):
    nuevo_tipo = tipo_autoridad_schema.load(datos)
    Auditoria.preparar_alta(nuevo_tipo)
    db.session.add(nuevo_tipo)
    db.session.commit()
    return nuevo_tipo

def actualizar(tipo_autoridad, datos):
    Auditoria.preparar_modificacion(tipo_autoridad)
    schema = TipoAutoridadSchema(partial=True)
    schema.context = {"tipo_autoridad_id": tipo_autoridad.id}
    schema.load(datos, instance=tipo_autoridad, partial=True)
    db.session.commit()
    return tipo_autoridad

def eliminar(tipo_autoridad):
    Auditoria.preparar_baja(tipo_autoridad)
    tipo_autoridad.estado = 0
    db.session.commit()
    return tipo_autoridad