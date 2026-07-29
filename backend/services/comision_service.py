from models.comision import Comision
from models.autoridad_comision import AutoridadComision
from models.comision_asignatura import ComisionAsignatura
from schemas.comision_schema import ComisionSchema, comision_schema
from db import db
from utils.auditoria import Auditoria

"""
Este archivo contiene la lógica de negocio del CRUD de Comision
"""

def obtener_todos():
    return Comision.query.all()

def obtener_por_id(id_comision):
    return Comision.query.filter_by(id_comision=id_comision).first()

def crear(datos):
    nueva_comision = comision_schema.load(datos)
    Auditoria.preparar_alta(nueva_comision)
    db.session.add(nueva_comision)
    db.session.commit()
    return nueva_comision

def actualizar(comision, datos):
    Auditoria.preparar_modificacion(comision)
    schema = ComisionSchema(partial=True)

    schema.context = {"comision_id": comision.id_comision}
    schema.load(datos, instance=comision, partial=True)

    db.session.commit()
    return comision

def eliminar(comision):
    Auditoria.preparar_baja(comision)
    comisiones_asignaturas = ComisionAsignatura.query.filter_by(
        comision_id=comision.id_comision
    ).all()

    for comision_asignatura in comisiones_asignaturas:
        autoridades = AutoridadComision.query.filter_by(
            comision_id=comision_asignatura.id_comision_asignatura
        ).all()

        for autoridad in autoridades:
            autoridad.estado = 0

        comision_asignatura.estado = 0

    comision.estado = 0

    db.session.commit()
    return comision