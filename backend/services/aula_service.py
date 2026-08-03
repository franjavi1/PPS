from models.aula import Aula
from schemas.aula_schema import AulaSchema, aula_schema
from db import db
from utils.auditoria import Auditoria

"""
Este archivo contiene la lógica de negocio del CRUD de Aula
"""

def obtener_todos():
    # Asumimos que estado=1 es "Activo" según el TINYINT de la BD
    return Aula.query.filter_by(estado=1).all()

def obtener_por_id(id_aula):
    return Aula.query.filter_by(id_aula=id_aula, estado=1).first()

def crear(datos):
    nueva_aula = aula_schema.load(datos)
    Auditoria.preparar_alta(nueva_aula)
    db.session.add(nueva_aula)
    db.session.commit()
    return nueva_aula

def actualizar(aula, datos):
    Auditoria.preparar_modificacion(aula)
    schema = AulaSchema(partial=True)
    schema.context = {"aula_id": aula.id_aula}
    schema.load(datos, instance=aula, partial=True)
    db.session.commit()
    return aula

def eliminar(aula):
    Auditoria.preparar_baja(aula)
    aula.estado = 0
    db.session.commit()
    return aula