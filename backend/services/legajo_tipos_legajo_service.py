from models.legajo_tipos_legajo import LegajoTiposLegajo
from db import db


def obtener_todos():
    return LegajoTiposLegajo.query.all()


def obtener_por_id(id):
    return LegajoTiposLegajo.query.get(id)


def obtener_por_legajo(legajo_id):
    return LegajoTiposLegajo.query.filter_by(legajo_id=legajo_id).all()


def crear(datos):
    relacion = LegajoTiposLegajo(
        legajo_id=datos.get("legajo_id"),
        tipo_legajo_id=datos.get("tipo_legajo_id"),
        usuario_accion=datos.get("usuario_accion", 1)
    )

    db.session.add(relacion)
    db.session.commit()

    return relacion


def eliminar(relacion):
    db.session.delete(relacion)
    db.session.commit()

    return relacion
