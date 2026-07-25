import os
import yaml
import requests
import logging

logger = logging.getLogger(__name__)

def registrar_acciones():
    """
    Lee acciones.yml y registra las acciones/roles contra el servicio de Auth.
    Falla de manera silenciosa (loguea el error sin detener la aplicacion).
    """
    # Construye la ruta relativa a la ubicacion de este archivo
    ruta_yml = os.path.join(os.path.dirname(__file__), "acciones.yml")

    try:
        with open(ruta_yml, "r", encoding="utf-8") as f:
            datos = yaml.safe_load(f)
    except FileNotFoundError:
        logger.warning(f"No se encontro el archivo de acciones en {ruta_yml}. Se omite el registro.")
        return
    except Exception as e:
        logger.error(f"Error al leer o parsear {ruta_yml}: {e}")
        return

    # URL base del servicio de Auth
    auth_url = os.environ.get("AUTH_URL", "http://auth:5000")
    
    # Endpoint exacto: auth/acciones
    endpoint = f"{auth_url.rstrip('/')}/acciones"

    try:
        response = requests.post(endpoint, json=datos, timeout=5)
        response.raise_for_status()
        logger.info(f"Acciones/roles registrados exitosamente en Auth: {response.status_code}")
    except requests.exceptions.RequestException as e:
        # Como no es critico, solo registramos el error y dejamos que la app continue
        logger.error(f"No se pudieron registrar las acciones en Auth ({endpoint}): {e}")