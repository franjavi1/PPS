# /backend/utils/regex.py
import re

# EXPRESIONES REGULARES CENTRALIZADAS

REGEX_CUIT = r"^\d{2}-?\d{8}-?\d{1}$"
REGEX_DNI = r"^\d{6,9}$"
REGEX_SOLO_LETRAS = r"^[A-Za-zÁÉÍÓÚÜáéíóúüñÑ ]+$"
REGEX_TELEFONO = r"^\+?\d{7,15}$"
REGEX_EMAIL = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"

# aca debemos crear funciones para validacion

def comprobarMail(campo):
    # Si el campo viene vacío, nulo o no es texto, no es válido
    if not campo or not isinstance(campo, str):
        return False
        
    # re.match busca si el texto coincide desde el inicio con la expresión regular
    return bool(re.match(REGEX_EMAIL, campo.strip()))
