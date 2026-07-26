from flask import Blueprint, request
from sqlalchemy.exc import SQLAlchemyError

from db import db
from models.autoridad_comision import AutoridadComision
from models.legajo_rangos import LegajoRangos
from models.legajo_sedes import LegajoSedes
from schemas.legajo_schema import legajo_schema, legajos_schema
from utils.utilidades import respuesta_api
from utils.errores import APIError

from services.legajo_service import (
    obtener_todos,
    obtener_por_id,
    crear,
    actualizar,
    eliminar,
    obtener_por_numero
)


legajos_bp = Blueprint("legajos_bp", __name__, url_prefix="/legajos")

#Se obtiene la Persona a partir del numero de legajo
@legajos_bp.route("/GetPersonaFromLegajoNum", methods=["GET"])
def get_legajo_por_numero():
    numero = request.args.get("numero") or request.args.get("legajo")

    if not numero or not numero.strip():
        raise APIError("Debe incluir el 'numero' de legajo en la URL", status=400)

    legajo = obtener_por_numero(numero)

    if not legajo:
        raise APIError(f"No se encontró un legajo activo con el numero '{numero}'", status=404)

    data = legajo_schema.dump(legajo)

    return respuesta_api(True, data, "Legajo y persona obtenidos correctamente")

@legajos_bp.route("", methods=["GET"])
def get_legajos():
    estado = request.args.get("estado", default=1, type=int)

    if estado not in (0, 1):
        raise APIError("Estado no valido", status=400)

    legajos = obtener_todos(estado)
    data = legajos_schema.dump(legajos)

    if len(data) == 0:
        return respuesta_api(True, [], "No se encontraron resultados")

    return respuesta_api(True, data, "Lista de legajos obtenida")


@legajos_bp.route("/<int:id>", methods=["GET"])
def get_legajo(id):
    legajo = obtener_por_id(id)

    if not legajo:
        raise APIError("Legajo no encontrado", status=404)

    data = legajo_schema.dump(legajo)

    return respuesta_api(True, data, "Legajo obtenido correctamente")


@legajos_bp.route("", methods=["POST"])
def crear_legajo():
    req = request.get_json(silent=True) or {}

    nuevo_legajo = crear(req)
    data = legajo_schema.dump(nuevo_legajo)

    return respuesta_api(True, {"id": data["id"]}, "Legajo creado correctamente", 201)


@legajos_bp.route("/<int:id>", methods=["PUT"])
def editar_legajo(id):
    legajo = obtener_por_id(id)

    if not legajo:
        raise APIError("Legajo no encontrado", status=404)

    req = request.get_json(silent=True) or {}
    legajo_actualizado = actualizar(legajo, req)
    data = legajo_schema.dump(legajo_actualizado)

    return respuesta_api(True, {"id": data["id"]}, "Legajo actualizado correctamente")


@legajos_bp.route("/<int:id>", methods=["DELETE"])
def eliminar_legajo(id):
    legajo = obtener_por_id(id)

    if not legajo:
        raise APIError("Legajo no encontrado", status=404)

    if legajo.persona and legajo.persona.estado == 1:
        raise APIError("No se puede eliminar un legajo asociado a una persona activa", status=409)

    tiene_relaciones = (
        LegajoRangos.query.filter_by(legajo_id=id).first()
        or LegajoSedes.query.filter_by(legajo_id=id).first()
        or AutoridadComision.query.filter_by(legajo_id=id).first()
    )

    if tiene_relaciones:
        raise APIError("No se puede eliminar un legajo con rango, sede o autoridad asociada", status=409)

    eliminar(legajo)

    return respuesta_api(True, {"id": id}, "Legajo eliminado correctamente")