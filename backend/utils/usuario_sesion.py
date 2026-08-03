from flask import g
from auth_common.sesion_common import obtener_sesion

def cargar_datos_sesion():

    if hasattr(g, "id_usuario"):

        sesion = obtener_sesion(g.id_usuario)
        
        if sesion:
            # guarda datos de redis en g para que las rutas los puedan usar
            if sesion.get("id_persona"):
                g.id_persona = int(sesion.get("id_persona"))
            
            if sesion.get("id_legajo"):
                g.id_legajo = int(sesion.get("id_legajo"))
