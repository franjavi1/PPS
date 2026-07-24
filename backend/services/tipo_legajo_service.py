from models.tipo_legajo import TipoLegajo
from schemas.tipo_legajo_schema import TipoLegajoSchema, tipo_legajo_schema
from db import db


def obtener_todos():
    return TipoLegajo.query.all()


def obtener_por_id(id):
    return TipoLegajo.query.get(id)


def crear(datos):
    nuevo_tipo_legajo = tipo_legajo_schema.load(datos)

    db.session.add(nuevo_tipo_legajo)
    db.session.commit()

    return nuevo_tipo_legajo


def actualizar(tipo_legajo, datos):
    schema = TipoLegajoSchema(partial=True)
    schema.context = {"tipo_legajo_id": tipo_legajo.id}

    schema.load(datos, instance=tipo_legajo, partial=True)

    db.session.commit()

    return tipo_legajo


def eliminar(tipo_legajo):
    db.session.delete(tipo_legajo)
    db.session.commit()

    return tipo_legajo
