import json
import os
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from flask import Blueprint, request, jsonify

from db import db
from models.legajo_sedes import LegajoSedes
from models.datos_medicos import DatosMedicos
from models.legajo import Legajo
from models.legajo_rangos import LegajoRangos
from schemas.legajo_schema import legajo_schema
from schemas.datos_medicos_schema import datos_medicos_schema
from schemas.legajo_rangos_schema import legajo_rangos_schema
from schemas.legajo_sedes_schema import legajo_sedes_schema
from services.legajo_service import crear as crear_legajo
from services.datos_medicos_service import crear as crear_datos_medicos
from services.legajo_rangos_service import crear as crear_legajo_rango
from services.legajo_sedes_service import crear as crear_legajo_sede
from auth_common.decorador import requires_permission
from utils.utilidades import respuesta_api
from utils.errores import APIError


personas_relaciones_bp = Blueprint("personas_relaciones_bp", __name__)

@personas_relaciones_bp.route("/personas/<int:persona_id>/datos-medicos", methods=["GET"])
@requires_permission("planes.personas.editar", "planes.personas.ver_propio", policy="ANY")
def obtener_datos_medicos_de_persona(persona_id):
    datos_medicos = DatosMedicos.query.filter_by(persona_id=persona_id).first()

    if not datos_medicos:
        return respuesta_api(
            True,
            None,
            "La persona no tiene datos medicos cargados",
            404
        )

    data = datos_medicos_schema.dump(datos_medicos)

    return respuesta_api(
        True,
        data,
        "Datos medicos obtenidos correctamente para la persona",
        200
    )


@personas_relaciones_bp.route("/personas/<int:persona_id>/legajo", methods=["POST"])
@requires_permission("legajos.crear")
def crear_legajo_de_persona(persona_id):
    req = request.get_json(silent=True) or {}
    req["persona_id"] = persona_id

    legajo_existente = Legajo.query.filter_by(
        persona_id=persona_id,
        estado=1
    ).first()

    if legajo_existente:
        raise APIError(
            "La persona ya tiene un legajo activo",
            status=409
        )

    nuevo_legajo = crear_legajo(req)
    data = legajo_schema.dump(nuevo_legajo)

    return respuesta_api(
        True,
        {"id": data["id"]},
        "Legajo creado correctamente para la persona",
        201
    )


@personas_relaciones_bp.route("/personas/<int:persona_id>/datos-medicos", methods=["POST"])
@requires_permission("planes.datos_medicos.crear")
def crear_datos_medicos_de_persona(persona_id):
    req = request.get_json(silent=True) or {}
    req["persona_id"] = persona_id

    datos_medicos_existentes = DatosMedicos.query.filter_by(
        persona_id=persona_id
    ).first()

    if datos_medicos_existentes:
        raise APIError(
            "La persona ya tiene datos medicos cargados",
            status=409
        )

    nuevos_datos_medicos = crear_datos_medicos(req)
    data = datos_medicos_schema.dump(nuevos_datos_medicos)

    return respuesta_api(
        True,
        {"id": data["id"]},
        "Datos medicos creados correctamente para la persona",
        201
    )


@personas_relaciones_bp.route("/legajos/<int:legajo_id>/rangos", methods=["POST"])
@requires_permission("planes.legajo_rangos.crear")
def crear_rango_de_legajo(legajo_id):
    req = request.get_json(silent=True) or {}
    req["legajo_id"] = legajo_id

    rango_existente = LegajoRangos.query.filter_by(
        legajo_id=legajo_id
    ).first()

    if rango_existente:
        raise APIError(
            "El legajo ya tiene un rango asignado",
            status=409
        )

    nuevo_legajo_rango = crear_legajo_rango(req)
    data = legajo_rangos_schema.dump(nuevo_legajo_rango)

    return respuesta_api(
        True,
        {"id": data["id"]},
        "Rango creado correctamente para el legajo",
        201
    )


@personas_relaciones_bp.route("/legajos/<int:legajo_id>/sedes", methods=["POST"])
@requires_permission("planes.legajo_sedes.crear")
def crear_sede_de_legajo(legajo_id):
    req = request.get_json(silent=True) or {}
    req["legajo_id"] = legajo_id

    nueva_legajo_sede = crear_legajo_sede(req)
    data = legajo_sedes_schema.dump(nueva_legajo_sede)

    return respuesta_api(
        True,
        {"id": data["id"]},
        "Sede creada correctamente para el legajo",
        201
    )


@personas_relaciones_bp.route("/personas/<int:persona_id>/usuario", methods=["POST"])
@requires_permission("planes.personas.solicitar_usuario")
def solicitar_usuario_de_persona(persona_id):
    req = request.get_json(silent=True) or {}
    usuarios_service_url = os.getenv("USUARIOS_SERVICE_URL")

    payload = {
        "persona_id": persona_id,
        "legajo_id": req.get("legajo_id"),
        "dni": req.get("dni"),
        "email": req.get("email"),
        "rol": req.get("rol", "bombero")
    }

    if not usuarios_service_url:
        usuario_mock = {
            "mock": True,
            "usuario_id": f"mock-{persona_id}",
            "persona_id": persona_id,
            "legajo_id": payload["legajo_id"],
            "dni": payload["dni"],
            "email": payload["email"],
            "rol": payload["rol"],
            "estado": "creado_mock"
        }

        return respuesta_api(
            True,
            usuario_mock,
            "Usuario mock creado correctamente. Falta conectar el microservicio Login",
            201
        )

    try:
        request_login = Request(
            usuarios_service_url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST"
        )

        with urlopen(request_login, timeout=5) as response:
            usuario = json.loads(response.read().decode("utf-8"))

        return respuesta_api(
            True,
            usuario,
            "Usuario creado correctamente por el microservicio Login",
            201
        )

    except HTTPError as e:
        error_data = e.read().decode("utf-8")
        raise APIError(f"Error del microservicio Login: {error_data}", status=e.code)

    except URLError:
        raise APIError("Servicio de usuarios no disponible", status=503)

    except Exception as e:
        print(e)
        raise APIError("Ocurrio un error inesperado al solicitar usuario", status=500)

@personas_relaciones_bp.route("/legajos/<int:legajo_id>/rangos", methods=["GET"])
@requires_permission("planes.legajo_rangos.ver", "planes.personas.ver_propio", policy="ANY") 
def obtener_rangos_de_legajo(legajo_id):
    rangos = LegajoRangos.query.filter_by(legajo_id=legajo_id).all()
    
    if not rangos:
        return respuesta_api(True, [], "El legajo no tiene rangos asignados")

    data = [legajo_rangos_schema.dump(rango) for rango in rangos]

    return respuesta_api(
        True, 
        data, 
        "Rangos del legajo obtenidos correctamente"
    )


@personas_relaciones_bp.route("/legajos/<int:legajo_id>/sedes", methods=["GET"])
@requires_permission("planes.legajo_sedes.ver", "planes.personas.ver_propio", policy="ANY")
def obtener_sedes_de_legajo(legajo_id):
    sedes = LegajoSedes.query.filter_by(legajo_id=legajo_id).all()
    
    if not sedes:
        return respuesta_api(True, [], "El legajo no tiene sedes asignadas")

    data = [legajo_sedes_schema.dump(sede) for sede in sedes]

    return respuesta_api(
        True, 
        data, 
        "Sedes del legajo obtenidas correctamente"
    )