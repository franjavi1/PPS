from models.comision_asignatura import ComisionAsignatura
from models.modalidades import Modalidades
from schemas.comision_asignatura_schema import (
    ComisionAsignaturaSchema,
    comision_asignatura_schema
)
from db import db
from sqlalchemy import func
from utils.errores import APIError


def obtener_modalidad(modalidad):
    descripcion = str(modalidad or "").strip()

    return Modalidades.query.filter(
        func.lower(Modalidades.descripcion) == descripcion.lower()
    ).first()


def obtener_todos():
    return ComisionAsignatura.query.all()


def obtener_por_id(id_comision_asignatura):
    return ComisionAsignatura.query.filter_by(
        id_comision_asignatura=id_comision_asignatura
    ).first()


def crear(datos):
    nueva_comision_asignatura = comision_asignatura_schema.load(datos)
    modalidad = obtener_modalidad(nueva_comision_asignatura.modalidad)

    if modalidad is None:
        raise APIError("La modalidad indicada no existe", status=400)

    nueva_comision_asignatura.modalidadesid = modalidad.modalidadesid

    db.session.add(nueva_comision_asignatura)
    db.session.commit()

    return nueva_comision_asignatura


def actualizar(comision_asignatura, datos):
    schema = ComisionAsignaturaSchema(partial=True)
    schema.context = {
        "comision_asignatura_id": comision_asignatura.id_comision_asignatura
    }

    schema.load(datos, instance=comision_asignatura, partial=True)

    if "modalidad" in datos:
        modalidad = obtener_modalidad(comision_asignatura.modalidad)

        if modalidad is None:
            raise APIError("La modalidad indicada no existe", status=400)

        comision_asignatura.modalidadesid = modalidad.modalidadesid

    db.session.commit()

    return comision_asignatura


def eliminar(comision_asignatura):
    db.session.delete(comision_asignatura)
    db.session.commit()

    return comision_asignatura