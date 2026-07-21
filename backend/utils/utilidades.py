# /backend/utils/utilidades.py
from flask import jsonify
import re

# EXPRESIONES REGULARES CENTRALIZADAS
REGEX_CUIT = r"^\d{2}-?\d{8}-?\d{1}$"
REGEX_DNI = r"^\d{6,9}$"
REGEX_SOLO_LETRAS = r"^[A-Za-zAEIOUÜaeiouüñÑ ]+$"
REGEX_TELEFONO = r"^\+?\d{7,15}$"
REGEX_EMAIL = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"


def responder(data=None, message="Exito", ok=True, error=None, status=200):
 
    if data is None:
        lista_data = []
    elif isinstance(data, list):
        lista_data = data
    else:
        lista_data = [data]
        
    response_json = {
        "ok": ok,
        "data": lista_data,
        "count": len(lista_data),
        "message": message,
        "error": error
    }
    
    return jsonify(response_json), status