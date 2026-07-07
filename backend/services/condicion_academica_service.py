from models.condicion_academica import CondicionAcademica
from schemas.condicion_academica_schema import (
    CondicionAcademicaSchema,
    condicion_academica_schema
)
from db import db


def obtener_todos():
    return CondicionAcademica.query.all()


def obtener_por_id(id):
    return CondicionAcademica.query.get(id)


def crear(datos):
    nueva_condicion = condicion_academica_schema.load(datos)

    db.session.add(nueva_condicion)
    db.session.commit()

    return nueva_condicion


def actualizar(condicion_academica, datos):
    schema = CondicionAcademicaSchema(partial=True)
    schema.context = {
        "condicion_academica_id": condicion_academica.id_condicion_academica
    }

    schema.load(datos, instance=condicion_academica, partial=True)

    db.session.commit()

    return condicion_academica


def eliminar(condicion_academica):
    db.session.delete(condicion_academica)
    db.session.commit()

    return condicion_academica
