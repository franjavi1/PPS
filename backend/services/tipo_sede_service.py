from models.tipo_sede import TipoSede
from schemas.tipo_sede_schema import TipoSedeSchema, tipo_sede_schema
from db import db


"""
Este archivo contiene la logica de negocio del CRUD de TipoSede
"""


def obtener_todos():
    return TipoSede.query.all()


def obtener_por_id(id):
    return TipoSede.query.get(id)


def crear(datos):
    nuevo_tipo_sede = tipo_sede_schema.load(datos)

    db.session.add(nuevo_tipo_sede)
    db.session.commit()

    return nuevo_tipo_sede


def actualizar(tipo_sede, datos):
    schema = TipoSedeSchema(partial=True)

    # Evita que la validacion de descripcion unica tome como duplicado
    # al mismo tipo de sede que estamos editando.
    schema.context = {"tipo_sede_id": tipo_sede.id}

    schema.load(datos, instance=tipo_sede, partial=True)

    db.session.commit()

    return tipo_sede


def eliminar(tipo_sede):
    db.session.delete(tipo_sede)
    db.session.commit()

    return tipo_sede
