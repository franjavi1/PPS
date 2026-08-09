from models.contactos import Contactos
from models.legajo import Legajo
from schemas.contactos_schema import ContactosSchema, contacto_schema
from db import db
from utils.auditoria import Auditoria


"""
Este archivo contiene la logica de negocio del CRUD de Contactos
"""


def obtener_todos():
    return Contactos.query.filter_by(estado=1).all()


def obtener_por_id(id):
    return Contactos.query.get(id)


def crear(datos):
    nuevo_contacto = contacto_schema.load(datos)
    Auditoria.preparar_alta(nuevo_contacto)
    db.session.add(nuevo_contacto)
    db.session.commit()

    return nuevo_contacto


def actualizar(contacto, datos):
    Auditoria.preparar_modificacion(contacto)
    schema = ContactosSchema(partial=True)

    # Evita que la validacion de contacto unico tome como duplicado
    # al mismo contacto que estamos editando.
    schema.context = {"contacto_id": contacto.id}

    schema.load(datos, instance=contacto, partial=True)

    db.session.commit()

    return contacto


def eliminar(contacto):
    Auditoria.preparar_baja(contacto)
    contacto.estado = 0
    db.session.commit()

    return contacto

# Obtener PersonaID a partir del mail
def obtener_personaid_por_email(email: str):
    contacto = Contactos.query.filter_by(contacto=email).first()

    if not contacto:
        return None, None
    
    persona_id = contacto.persona_id
    legajo = Legajo.query.filter_by(persona_id=persona_id, estado=1).first()
    legajo_id = legajo.id if legajo else None
    
    return persona_id, legajo_id