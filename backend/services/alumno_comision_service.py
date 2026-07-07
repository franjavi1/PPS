from models.alumno_comision import AlumnoComision
from schemas.alumno_comision_schema import (
    AlumnoComisionSchema,
    alumno_comision_schema
)
from db import db


def obtener_todos():
    return AlumnoComision.query.all()


def obtener_por_id(id):
    return AlumnoComision.query.get(id)


def crear(datos):
    nuevo_alumno_comision = alumno_comision_schema.load(datos)

    db.session.add(nuevo_alumno_comision)
    db.session.commit()

    return nuevo_alumno_comision


def actualizar(alumno_comision, datos):
    schema = AlumnoComisionSchema(partial=True)
    schema.context = {
        "alumno_comision_id": alumno_comision.id_historia_alumnos
    }

    schema.load(datos, instance=alumno_comision, partial=True)

    db.session.commit()

    return alumno_comision


def eliminar(alumno_comision):
    db.session.delete(alumno_comision)
    db.session.commit()

    return alumno_comision
