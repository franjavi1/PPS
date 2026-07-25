from flask import Blueprint, jsonify

from services.modalidades_service import obtener_todas
from utils.utilidades import respuesta_api
from auth_common.decorador import requires_permission

modalidades_bp = Blueprint(
    "modalidades_bp",
    __name__,
    url_prefix="/modalidades"
)


@modalidades_bp.route("", methods=["GET"])
@requires_permission("micro1.modalidades.ver")
def get_modalidades():
    modalidades = [
        {
            "modalidadesid": modalidad.modalidadesid,
            "descripcion": modalidad.descripcion,
        }
        for modalidad in obtener_todas()
    ]

    return respuesta_api(
        success=True,
        data=modalidades,
        message="Lista de modalidades obtenida",
        status=200
    )