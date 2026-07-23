from flask import Blueprint, jsonify
from sqlalchemy.exc import SQLAlchemyError

from services.modalidades_service import obtener_todas


modalidades_bp = Blueprint(
    "modalidades_bp",
    __name__,
    url_prefix="/modalidades"
)


@modalidades_bp.route("", methods=["GET"])
def get_modalidades():
    try:
        modalidades = [
            {
                "modalidadesid": modalidad.modalidadesid,
                "descripcion": modalidad.descripcion,
            }
            for modalidad in obtener_todas()
        ]

        return jsonify({
            "status": "success",
            "message": "Lista de modalidades obtenida",
            "data": modalidades,
            "total": len(modalidades),
        }), 200

    except SQLAlchemyError:
        return jsonify({
            "status": "error",
            "message": "No se pudieron obtener las modalidades",
        }), 500
