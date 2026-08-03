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
    # La baja de la persona también deja inactivos sus legajos.
    # Los contactos y datos médicos se conservan como historial.
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

def es_legajo_de_persona(legajo_id, persona_id):
    
    ## Verifica si un legajo activo pertenece a una persona activa específica
    
    if not legajo_id or not persona_id:
        return False
        
    legajo = Legajo.query.filter_by(id=legajo_id, estado=1).first()
    
    if legajo and legajo.persona_id == persona_id:
        return True
        
    return False

def obtener_persona_activa(persona_id):
    
    ## Obtiene una persona por su ID siempre que su estado sea 1
    return Persona.query.filter_by(id=persona_id, estado=1).first()