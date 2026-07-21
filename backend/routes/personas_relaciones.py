import json
import os
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError

from extensions import db
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


personas_relaciones_bp = Blueprint("personas_relaciones_bp", __name__)


# Helper para formatear todas las respuestas de la API
def respuesta_api(success=True, data=None, message="", status=200, errors=None):
    response = {
        "status": "success" if success else "error",
        "message": message
    }
    if data is not None:
        response["data"] = data

        if isinstance(data, list):
            response["total"] = len(data)

    if errors is not None:
        response["errors"] = errors

    return jsonify(response), status


@personas_relaciones_bp.route("/personas/<int:persona_id>/legajo", methods=["POST"])
def crear_legajo_de_persona(persona_id):
    req = request.get_json(silent=True) or {}
    req["persona_id"] = persona_id

    try:
        legajo_existente = Legajo.query.filter_by(
            persona_id=persona_id,
            estado=1
        ).first()

        if legajo_existente:
            return respuesta_api(
                False,
                None,
                "La persona ya tiene un legajo activo",
                409,
                {
                    "persona_id": [
                        "No se puede crear mas de un legajo activo para la misma persona"
                    ]
                }
            )

        nuevo_legajo = crear_legajo(req)
        data = legajo_schema.dump(nuevo_legajo)

        return respuesta_api(
            True,
            {"id": data["id"]},
            "Legajo creado correctamente para la persona",
            201
        )

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validacion", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al crear el legajo de la persona"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@personas_relaciones_bp.route("/personas/<int:persona_id>/datos-medicos", methods=["POST"])
def crear_datos_medicos_de_persona(persona_id):
    req = request.get_json(silent=True) or {}
    req["persona_id"] = persona_id

    try:
        datos_medicos_existentes = DatosMedicos.query.filter_by(
            persona_id=persona_id
        ).first()

        if datos_medicos_existentes:
            return respuesta_api(
                False,
                None,
                "La persona ya tiene datos medicos cargados",
                409,
                {
                    "persona_id": [
                        "No se puede crear mas de una ficha medica para la misma persona"
                    ]
                }
            )

        nuevos_datos_medicos = crear_datos_medicos(req)
        data = datos_medicos_schema.dump(nuevos_datos_medicos)

        return respuesta_api(
            True,
            {"id": data["id"]},
            "Datos medicos creados correctamente para la persona",
            201
        )

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validacion", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al crear los datos medicos de la persona"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@personas_relaciones_bp.route("/legajos/<int:legajo_id>/rangos", methods=["POST"])
def crear_rango_de_legajo(legajo_id):
    req = request.get_json(silent=True) or {}
    req["legajo_id"] = legajo_id

    try:
        rango_existente = LegajoRangos.query.filter_by(
            legajo_id=legajo_id
        ).first()

        if rango_existente:
            return respuesta_api(
                False,
                None,
                "El legajo ya tiene un rango asignado",
                409,
                {
                    "legajo_id": [
                        "No se puede crear mas de un rango para el mismo legajo"
                    ]
                }
            )

        nuevo_legajo_rango = crear_legajo_rango(req)
        data = legajo_rangos_schema.dump(nuevo_legajo_rango)

        return respuesta_api(
            True,
            {"id": data["id"]},
            "Rango creado correctamente para el legajo",
            201
        )

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validacion", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al crear el rango del legajo"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@personas_relaciones_bp.route("/legajos/<int:legajo_id>/sedes", methods=["POST"])
def crear_sede_de_legajo(legajo_id):
    req = request.get_json(silent=True) or {}
    req["legajo_id"] = legajo_id

    try:
        nueva_legajo_sede = crear_legajo_sede(req)
        data = legajo_sedes_schema.dump(nueva_legajo_sede)

        return respuesta_api(
            True,
            {"id": data["id"]},
            "Sede creada correctamente para el legajo",
            201
        )

    except ValidationError as e:
        db.session.rollback()
        return respuesta_api(False, None, "Error de validacion", 400, e.messages)

    except SQLAlchemyError:
        db.session.rollback()
        return respuesta_api(False, None, "Error de base de datos", 500, {
            "database": "Ocurrio un error al crear la sede del legajo"
        })

    except Exception as e:
        db.session.rollback()
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado"
        })


@personas_relaciones_bp.route("/personas/<int:persona_id>/usuario", methods=["POST"])
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
        return respuesta_api(False, None, "Error del microservicio Login", e.code, {
            "usuarios": error_data
        })

    except URLError:
        return respuesta_api(False, None, "No se pudo conectar al microservicio Login", 503, {
            "usuarios": "Servicio de usuarios no disponible"
        })

    except Exception as e:
        print(e)
        return respuesta_api(False, None, "Error inesperado", 500, {
            "server": "Ocurrio un error inesperado al solicitar usuario"
        })
