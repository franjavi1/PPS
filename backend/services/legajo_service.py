from models.legajo import Legajo
from schemas.legajo_schema import LegajoSchema, legajo_schema
from db import db


"""
Este archivo contiene la logica de negocio del CRUD de Legajo
"""


def obtener_todos():
    return Legajo.query.filter_by(estado=1).all()


def obtener_por_id(id):
    return Legajo.query.filter_by(id=id, estado=1).first()


def crear(datos):
    # Extraer los tipos de legajo seleccionados
    tipo_legajo_ids = datos.pop("tipo_legajo_ids", [])
    
    nuevo_legajo = legajo_schema.load(datos)
    db.session.add(nuevo_legajo)
    db.session.flush()

    from models.legajo_tipos_legajo import LegajoTiposLegajo
    for t_id in tipo_legajo_ids:
        relacion = LegajoTiposLegajo(
            legajo_id=nuevo_legajo.id,
            tipo_legajo_id=int(t_id),
            usuario_accion=datos.get("usuario_accion", 1)
        )
        db.session.add(relacion)

    db.session.commit()
    return nuevo_legajo


def actualizar(legajo, datos):
    # Extraer los tipos de legajo seleccionados si vienen en el payload
    tipo_legajo_ids = datos.pop("tipo_legajo_ids", None)
    
    schema = LegajoSchema(partial=True)
    schema.context = {"legajo_id": legajo.id}
    schema.load(datos, instance=legajo, partial=True)

    if tipo_legajo_ids is not None:
        from models.legajo_tipos_legajo import LegajoTiposLegajo
        # Limpiar asociaciones anteriores
        LegajoTiposLegajo.query.filter_by(legajo_id=legajo.id).delete()
        # Agregar nuevas asociaciones
        for t_id in tipo_legajo_ids:
            relacion = LegajoTiposLegajo(
                legajo_id=legajo.id,
                tipo_legajo_id=int(t_id),
                usuario_accion=datos.get("usuario_accion", 1)
            )
            db.session.add(relacion)

    db.session.commit()
    return legajo


def eliminar(legajo):
    legajo.estado = 0
    
    from models.legajo_tipos_legajo import LegajoTiposLegajo
    # Al eliminar lógicamente el legajo, removemos las asociaciones físicas de tipos
    LegajoTiposLegajo.query.filter_by(legajo_id=legajo.id).delete()
    
    db.session.commit()
    return legajo
