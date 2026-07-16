from models.comision_asignatura import ComisionAsignatura
from schemas.comision_asignatura_schema import (
    ComisionAsignaturaSchema,
    comision_asignatura_schema
)
from db import db


def obtener_todos():
    return ComisionAsignatura.query.all()


def obtener_por_id(id_comision_asignatura):
    return ComisionAsignatura.query.filter_by(
        id_comision_asignatura=id_comision_asignatura
    ).first()


def crear(datos):
    nueva_comision_asignatura = comision_asignatura_schema.load(datos)

    db.session.add(nueva_comision_asignatura)
    db.session.commit()

    return nueva_comision_asignatura


def actualizar(comision_asignatura, datos):
    schema = ComisionAsignaturaSchema(partial=True)
    schema.context = {
        "comision_asignatura_id": comision_asignatura.id_comision_asignatura
    }

    schema.load(datos, instance=comision_asignatura, partial=True)

    db.session.commit()

    return comision_asignatura


def eliminar(comision_asignatura):
    comision_asignatura.estado = 0
    db.session.commit()

    return comision_asignatura
