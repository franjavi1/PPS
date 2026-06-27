from models.persona import Persona
from schemas.persona_schema import PersonaSchema, persona_schema
from db import db


"""
Este archivo contiene la lógica de negocio del CRUD de Persona
"""


def obtener_todos():
    return Persona.query.filter_by(estado=1).all()


def obtener_por_id(id):
    return Persona.query.filter_by(id=id, estado=1).first()


def crear(datos):
    nueva_persona = persona_schema.load(datos)

    db.session.add(nueva_persona)
    db.session.commit()

    return nueva_persona


def actualizar(persona, datos):
    schema = PersonaSchema(partial=True)

    # Esto sirve para que la validación de documento único
    # no tome como duplicada a la misma persona que estamos editando
    schema.context = {"persona_id": persona.id}

    schema.load(datos, instance=persona, partial=True)

    db.session.commit()

    return persona


def eliminar(persona):
    persona.estado = 0
    db.session.commit()

    return persona
