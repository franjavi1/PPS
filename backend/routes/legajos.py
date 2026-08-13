from flask import Blueprint, request, g
from sqlalchemy.exc import SQLAlchemyError

from db import db
from models.autoridad_comision import AutoridadComision
from models.legajo_rangos import LegajoRangos
from models.legajo_sedes import LegajoSedes
from schemas.legajo_schema import legajo_schema, legajos_schema
from utils.utilidades import respuesta_api
from utils.errores import APIError
from auth_common.decorador import requires_permission
from services.legajo_service import (
    obtener_todos,
    obtener_por_id,
    crear,
    actualizar,
    eliminar,
    obtener_por_numero,
    obtener_legajo_completo_por_id,
    obtener_legajo_completo_por_persona_id
)


legajos_bp = Blueprint("legajos_bp", __name__, url_prefix="/legajos")

@legajos_bp.route("/GetPersonaFromPersonaId", methods=["GET"])
@requires_permission("planes.legajos.ver", "planes.legajos.ver_propio", policy="ANY")
def get_detalle_legajo_por_persona_id():
    persona_id_raw = request.args.get("persona_id") or request.args.get("id")

    if not persona_id_raw:
        raise APIError("Debe incluir el ID de la persona en el parametro 'id'", status=400)

    try:
        persona_id = int(persona_id_raw)
    except ValueError:
        raise APIError("El ID de la persona debe ser un numero entero valido", status=400)

    tiene_acceso_total = "planes.legajos.ver" in g.acciones
    es_propio = persona_id == g.id_persona

    if not tiene_acceso_total and not es_propio:
        raise APIError("No tenes permiso para ver este legajo", status=403)

    legajo = obtener_legajo_completo_por_persona_id(persona_id)

    if not legajo:
        raise APIError("Legajo no encontrado", status=404)

    data = legajo_schema.dump(legajo)

    return respuesta_api(True, data, "Legajo, persona y contactos obtenidos correctamente")

@legajos_bp.route("/GetPersonaFromLegajoId", methods=["GET"])
@requires_permission(only_services=True)
#@requires_permission("planes.legajos.ver", "planes.legajos.ver_propio", policy="ANY")
def get_detalle_legajo_persona():
    legajo_id_raw = request.args.get("id") or request.args.get("legajo_id")

    if not legajo_id_raw:
        raise APIError("Debe incluir el ID del legajo en el parametro 'id'", status=400)

    try:
        legajo_id = int(legajo_id_raw)
    except ValueError:
        raise APIError("El ID del legajo debe ser un numero entero valido", status=400)

    legajo = obtener_legajo_completo_por_id(legajo_id)

    if not legajo:
        raise APIError("Legajo no encontrado", status=404)

    tiene_acceso_total = "planes.legajos.ver" in g.acciones
    es_propio = legajo.persona_id == g.id_persona

    if not tiene_acceso_total and not es_propio:
        raise APIError("No tenes permiso para ver este legajo", status=403)

    data = legajo_schema.dump(legajo)

    return respuesta_api(True, data, "Legajo, persona y contactos obtenidos correctamente")

#Se obtiene la Persona a partir del numero de legajo
@legajos_bp.route("/GetPersonaFromLegajoNum", methods=["GET"])
@requires_permission("planes.legajos.ver", "planes.legajos.ver_propio", policy="ANY")
def get_legajo_por_numero():
    numero = request.args.get("numero") or request.args.get("legajo")

    if not numero or not numero.strip():
        raise APIError("Debe incluir el 'numero' de legajo en la URL", status=400)

    legajo = obtener_por_numero(numero)

    if not legajo:
        raise APIError(f"No se encontró un legajo activo con el numero '{numero}'", status=404)

    tiene_acceso_total = "planes.legajos.ver" in g.acciones
    es_propio = legajo.persona_id == g.id_persona

    if not tiene_acceso_total and not es_propio:
        raise APIError("No tenes permiso para ver este legajo", status=403)

    data = legajo_schema.dump(legajo)

    return respuesta_api(True, data, "Legajo y persona obtenidos correctamente")

@legajos_bp.route("", methods=["GET"])
@requires_permission("planes.legajos.ver", "planes.personas.ver_propio", policy="ANY")
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
@requires_permission("planes.legajos.ver", "planes.legajos.ver_propio", policy="ANY")
def get_legajo(id):
    legajo = obtener_por_id(id)

    if not legajo:
        raise APIError("Legajo no encontrado", status=404)

    data = legajo_schema.dump(legajo)

    return respuesta_api(True, data, "Legajo obtenido correctamente")


@legajos_bp.route("", methods=["POST"])
@requires_permission("planes.legajos.crear")
def crear_legajo():
    req = request.get_json(silent=True) or {}

    nuevo_legajo = crear(req)
    data = legajo_schema.dump(nuevo_legajo)

    return respuesta_api(True, {"id": data["id"]}, "Legajo creado correctamente", 201)


@legajos_bp.route("/<int:id>", methods=["PUT"])
@requires_permission("planes.legajos.editar")
def editar_legajo(id):
    legajo = obtener_por_id(id)

    if not legajo:
        raise APIError("Legajo no encontrado", status=404)

    req = request.get_json(silent=True) or {}
    legajo_actualizado = actualizar(legajo, req)
    data = legajo_schema.dump(legajo_actualizado)

    return respuesta_api(True, {"id": data["id"]}, "Legajo actualizado correctamente")


@legajos_bp.route("/<int:id>", methods=["DELETE"])
@requires_permission("planes.legajos.eliminar")
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

@legajos_bp.route("/interno/contacto-principal", methods=["GET"])
@requires_permission(only_services=True)
def get_contacto_principal_interno():
    """
    Variante interna de GetPersonaFromPersonaId, pensada para llamadas
    servicio a servicio.
    Devuelve unicamente el contacto de tipo email marcado como principal, no el legajo completo.
    """
    persona_id_raw = request.args.get("id")

    if not persona_id_raw:
        raise APIError("Debe incluir el ID de la persona en el parametro 'id'", status=400)

    try:
        persona_id = int(persona_id_raw)
    except ValueError:
        raise APIError("El ID de la persona debe ser un numero entero valido", status=400)

    legajo = obtener_legajo_completo_por_persona_id(persona_id)

    email = None
    for contacto in legajo.persona.contactos_items:
        if contacto.tipo_contacto_id == 2 and contacto.principal and contacto.estado == 1:
            email = contacto.contacto
            break

    return respuesta_api(True, {"email": email}, "Contacto principal obtenido")