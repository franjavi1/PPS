from flask import Blueprint, request
from utils.utilidades import respuesta_api
from utils.errores import APIError

from models.autoridad_comision import AutoridadComision
from schemas.comision_asignatura_schema import (
    comision_asignatura_schema,
    comisiones_asignaturas_schema
)
from services.comision_asignatura_service import (
    actualizar,
    crear,
    eliminar,
    obtener_por_id,
    obtener_todos,
    obtener_comisiones_por_legajo
)

comisiones_asignaturas_bp = Blueprint(
    "comisiones_asignaturas_bp",
    __name__,
    url_prefix="/comisiones-asignaturas"
)

#Devuelve el detalle de comisiones asignaturas para el idlegajo indicado
@comisiones_asignaturas_bp.route("/GetDetalleFromLegajoID", methods=["GET"])
def get_detalle_comision_asignatura():
    legajoid = request.args.get("id") or request.args.get("legajoid")

    if not legajoid:
        raise APIError("El parámetro 'id' del legajo es requerido.", status=400)

    try:
        legajoid = int(legajoid)
    except ValueError:
        raise APIError("El ID del legajo debe ser un número entero válido.", status=400)

    comisiones = obtener_comisiones_por_legajo(legajoid)

    if not comisiones:
        return respuesta_api(
            success=True,
            data=[],
            message="No se encontraron comisiones habilitadas para el rango de este legajo",
            status=200
        )

    data = comisiones_asignaturas_schema.dump(comisiones)

    return respuesta_api(
        success=True,
        data=data,
        message="Comisiones asignaturas habilitadas obtenidas correctamente",
        status=200
    )


@comisiones_asignaturas_bp.route("", methods=["GET"])
def get_comisiones_asignaturas():
    comisiones_asignaturas = obtener_todos()
    data = comisiones_asignaturas_schema.dump(comisiones_asignaturas)

    if len(data) == 0:
        return respuesta_api(success=True, data=[], message="No se encontraron resultados", status=200)

    return respuesta_api(success=True, data=data, message="Lista de comisiones asignaturas obtenida", status=200)


@comisiones_asignaturas_bp.route("/<int:id>", methods=["GET"])
def get_comision_asignatura(id):
    comision_asignatura = obtener_por_id(id)

    if not comision_asignatura:
        raise APIError("Comision asignatura no encontrada", status=404)

    data = comision_asignatura_schema.dump(comision_asignatura)

    return respuesta_api(success=True, data=data, message="Comision asignatura obtenida correctamente", status=200)


@comisiones_asignaturas_bp.route("", methods=["POST"])
def crear_comision_asignatura():
    req = request.get_json(silent=True) or {}

    nueva_comision_asignatura = crear(req)
    data = comision_asignatura_schema.dump(nueva_comision_asignatura)

    return respuesta_api(
        success=True,
        data={"id_comision_asignatura": data["id_comision_asignatura"]},
        message="Comision asignatura creada correctamente",
        status=201
    )


@comisiones_asignaturas_bp.route("/<int:id>", methods=["PUT"])
def editar_comision_asignatura(id):
    comision_asignatura = obtener_por_id(id)

    if not comision_asignatura:
        raise APIError("Comision asignatura no encontrada", status=404)

    req = request.get_json(silent=True) or {}
    comision_asignatura_actualizada = actualizar(comision_asignatura, req)
    data = comision_asignatura_schema.dump(comision_asignatura_actualizada)

    return respuesta_api(
        success=True,
        data={"id_comision_asignatura": data["id_comision_asignatura"]},
        message="Comision asignatura actualizada correctamente",
        status=200
    )


@comisiones_asignaturas_bp.route("/<int:id>", methods=["DELETE"])
def eliminar_comision_asignatura(id):
    comision_asignatura = obtener_por_id(id)

    if not comision_asignatura:
        raise APIError("Comision asignatura no encontrada", status=404)

    esta_en_uso = AutoridadComision.query.filter_by(
        comision_id=id,
    ).first()

    if esta_en_uso:
        raise APIError("No se puede eliminar una comision asignatura con autoridades asociadas", status=409)

    eliminar(comision_asignatura)

    return respuesta_api(
        success=True,
        data={"id_comision_asignatura": id},
        message="Comision asignatura eliminada correctamente",
        status=200
    )