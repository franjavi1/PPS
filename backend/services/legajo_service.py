from sqlalchemy.orm import joinedload
from models.legajo import Legajo
from models.contactos import Contactos
from models.persona import Persona
from schemas.legajo_schema import LegajoSchema, legajo_schema
from schemas.persona_schema import PersonaSchema
from db import db
from utils.auditoria import Auditoria
from utils.errores import APIError

"""
Este archivo contiene la logica de negocio del CRUD de Legajo
"""


def obtener_todos(estado=1):
    return Legajo.query.filter_by(estado=estado).all()


def obtener_por_id(id):
    return Legajo.query.filter_by(id=id, estado=1).first()


def crear(datos):
    nuevo_legajo = legajo_schema.load(datos)
    Auditoria.preparar_alta(nuevo_legajo)
    db.session.add(nuevo_legajo)
    db.session.commit()

    return nuevo_legajo


def actualizar(legajo, datos):
    Auditoria.preparar_modificacion(legajo)
    schema = LegajoSchema(partial=True)

    # Evita que la validacion de numero unico tome como duplicado
    # al mismo legajo que estamos editando.
    schema.context = {"legajo_id": legajo.id}

    schema.load(datos, instance=legajo, partial=True)

    db.session.commit()

    return legajo


def eliminar(legajo):
    Auditoria.preparar_baja(legajo)
    legajo.estado = 0
    db.session.commit()

    return legajo

def obtener_por_numero(numero: str):
    return Legajo.query.filter_by(numero=str(numero).strip(), estado=1).first()

def obtener_legajo_completo_por_id(legajo_id: int):
    legajo = (
        Legajo.query
        .options(
            joinedload(Legajo.persona)
            .joinedload(Legajo.persona.property.mapper.class_.contactos_items) 
            .joinedload(Contactos.tipo_contacto)
        )
        .filter_by(id=legajo_id, estado=1)
        .first()
    )

    if not legajo:
        raise APIError(f"Legajo con ID {legajo_id} no encontrado o inactivo", status=404)

    return legajo

def obtener_legajo_completo_por_persona_id(persona_id: int):
    legajo = (
        Legajo.query
        .options(
            joinedload(Legajo.persona)
            .joinedload(Persona.contactos_items)
            .joinedload(Contactos.tipo_contacto)
        )
        .filter_by(persona_id=persona_id, estado=1)
        .first()
    )

    if not legajo:
        raise APIError(f"No se encontro un legajo activo para la persona con ID {persona_id}", status=404)

    return legajo