from models.persona import Persona
from models.legajo import Legajo
from schemas.persona_schema import PersonaSchema, persona_schema
from db import db
from utils.auditoria import Auditoria


"""
Este archivo contiene la lógica de negocio del CRUD de Persona
"""


def obtener_todos(estado=1):
    return Persona.query.filter_by(estado=estado).all()


def obtener_por_id(id):
    return Persona.query.filter_by(id=id, estado=1).first()


def obtener_por_id_sin_filtrar_estado(id):
    return Persona.query.filter_by(id=id).first()


def crear(datos):
    nueva_persona = persona_schema.load(datos)
    Auditoria.preparar_alta(nueva_persona)
    db.session.add(nueva_persona)
    db.session.commit()

    return nueva_persona


def actualizar(persona, datos):
    Auditoria.preparar_modificacion(persona)
    schema = PersonaSchema(partial=True)

    # Esto sirve para que la validación de documento único
    # no tome como duplicada a la misma persona que estamos editando
    schema.context = {"persona_id": persona.id}

    schema.load(datos, instance=persona, partial=True)

    db.session.commit()

    return persona


def eliminar(persona):
    # La baja de la persona también deja inactivos sus legajos.
    # Los contactos y datos médicos se conservan como historial.
    Auditoria.preparar_baja(persona)
    legajos_activos = Legajo.query.filter_by(
        persona_id=persona.id,
        estado=1
    ).all()
    for legajo in legajos_activos:
        legajo.estado = 0

    persona.estado = 0
    db.session.commit()

    return persona


def reactivar(persona):
    legajos_inactivos = Legajo.query.filter_by(
        persona_id=persona.id,
        estado=0
    ).all()

    for legajo in legajos_inactivos:
        legajo.estado = 1

    persona.estado = 1
    db.session.commit()

    return persona
