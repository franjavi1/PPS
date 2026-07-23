# /backend/utils/utilidades.py
from flask import jsonify
import re

# EXPRESIONES REGULARES CENTRALIZADAS
REGEX_CUIT = r"^\d{2}-?\d{8}-?\d{1}$"
REGEX_DNI = r"^\d{6,9}$"
REGEX_SOLO_LETRAS = r"^[A-Za-zAEIOUÜaeiouüñÑ ]+$"
REGEX_TELEFONO = r"^\+?\d{7,15}$"
REGEX_EMAIL = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"


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