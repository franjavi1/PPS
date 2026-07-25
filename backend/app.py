from flask import Flask
from flask_cors import CORS
from auth_common import AuthCommon
from flask_jwt_extended import JWTManager

from db import db, ma
from config.config import Config

from models.persona import Persona
from models.tipo_documento import TipoDocumento
from models.planes import Planes
from models.tipo_planes import TipoPlanes
from models.asignaturas import Asignaturas
from models.tipo_sede import TipoSede
from models.sedes import Sedes
from models.comision import Comision
from models.comision_asignatura import ComisionAsignatura
from models.autoridad_comision import AutoridadComision
from models.aula import Aula
from models.pa_correlativa import PACorrelativa
from models.tipos_autoridad import TipoAutoridad
from models.plan_asignatura import PlanAsignatura
from models.datos_medicos import DatosMedicos
from models.tipo_contacto import TipoContacto
from models.contactos import Contactos

from models.legajo import Legajo
from models.rangos_institucionales import RangosInstitucionales
from models.legajo_rangos import LegajoRangos
from models.legajo_sedes import LegajoSedes
from models.tipo_legajo import TipoLegajo
from models.legajo_tipos_legajo import LegajoTiposLegajo

from routes.personas import personas_bp
from routes.tipos_documentos import tipos_documentos_bp
from routes.planes import planes_bp
from routes.tipos_planes import tipos_planes_bp
from routes.asignaturas import asignaturas_bp
from routes.tipos_sedes import tipos_sedes_bp
from routes.sedes import sedes_bp
from routes.comisiones import comisiones_bp
from routes.comisiones_asignaturas import comisiones_asignaturas_bp
from routes.autoridades_comision import autoridades_comision_bp
from routes.aulas import aulas_bp
from routes.pa_correlativas import pa_correlativas_bp
from routes.tipos_autoridad import tipos_autoridad_bp
from routes.planes_asignaturas import planes_asignaturas_bp
from routes.legajos import legajos_bp
from routes.rangos_institucionales import rangos_institucionales_bp
from routes.legajo_rangos import legajo_rangos_bp
from routes.legajo_sedes import legajo_sedes_bp
from routes.datos_medicos import datos_medicos_bp
from routes.tipos_contacto import tipos_contacto_bp
from routes.contactos import contactos_bp
from routes.personas_relaciones import personas_relaciones_bp
from routes.tipos_legajo import tipos_legajo_bp
from routes.legajo_tipos_legajo import legajo_tipos_legajo_bp

app = Flask(__name__)
app.config.from_object(Config)

AuthCommon(app)
JWTManager(app)

def registrar_acciones():
    import yaml
    import requests
    try:
        with open("acciones.yml", encoding="utf-8") as f:
            datos = yaml.safe_load(f)
        response = requests.post("http://auth:5000/acciones", json=datos, timeout=5)
        print(f"Registro de acciones exitoso: {response.status_code}")
    except Exception as e:
        print(f"Advertencia: No se pudo registrar las acciones contra el servicio de Auth ({e}). Esto es esperado si el servicio de Auth no está levantado en este momento.")

registrar_acciones()

db.init_app(app)
ma.init_app(app)

CORS(app)


@app.route("/health", methods=["GET"])
def health():
    return {
        "status": "success",
        "message": "API funcionando"
    }, 200


@app.route("/login", methods=["POST"])
def login():
    from flask import request
    from flask_jwt_extended import create_access_token
    req = request.get_json(silent=True) or {}
    usuario = req.get("usuario", "admin")
    rol = req.get("rol")
    if not rol:
        usuario_lower = usuario.lower()
        if "admin" in usuario_lower:
            rol = "ROLE_ADMIN"
        elif "instructor" in usuario_lower or "docente" in usuario_lower:
            rol = "ROLE_INSTRUCTOR"
        else:
            rol = "ROLE_USER"
    
    id_usuario = 1234567890
    
    token = create_access_token(identity=str(id_usuario), additional_claims={"rol": rol, "usuario": usuario})
    
    redis_client = app.extensions["auth_common"]["redis_client"]
    ttl = app.extensions["auth_common"]["session_ttl"]
    
    acciones = []
    if rol == "ROLE_ADMIN":
        acciones = [
            "planes.planes.leer", "planes.planes.crear", "planes.planes.editar", "planes.planes.eliminar",
            "planes.comisiones.leer", "planes.comisiones.crear", "planes.comisiones.editar", "planes.comisiones.eliminar",
            "planes.sedes.leer", "planes.sedes.crear", "planes.sedes.editar", "planes.sedes.eliminar",
            "planes.legajos.leer", "planes.legajos.crear", "planes.legajos.editar", "planes.legajos.eliminar",
            "planes.personas.leer", "planes.personas.crear", "planes.personas.editar", "planes.personas.eliminar"
        ]
    elif rol in ["ROLE_INSTRUCTOR", "ROLE_USER"]:
        acciones = [
            "planes.planes.leer", "planes.comisiones.leer", "planes.sedes.leer", "planes.legajos.leer", "planes.personas.leer"
        ]
        
    import json
    redis_client.hset(f"session:{id_usuario}", mapping={
        "roles": json.dumps([rol]),
        "acciones": json.dumps(acciones),
        "refresh_jti": "mock_refresh_jti",
        "id_persona": "1"
    })
    redis_client.expire(f"session:{id_usuario}", ttl)
    
    return {
        "status": "success",
        "token": token
    }, 200


app.register_blueprint(personas_bp)
app.register_blueprint(tipos_documentos_bp)
app.register_blueprint(planes_bp)
app.register_blueprint(tipos_planes_bp)
app.register_blueprint(asignaturas_bp)
app.register_blueprint(tipos_sedes_bp)
app.register_blueprint(sedes_bp)
app.register_blueprint(comisiones_bp)
app.register_blueprint(comisiones_asignaturas_bp)
app.register_blueprint(autoridades_comision_bp)
app.register_blueprint(aulas_bp)
app.register_blueprint(pa_correlativas_bp)
app.register_blueprint(tipos_autoridad_bp)
app.register_blueprint(planes_asignaturas_bp)
app.register_blueprint(legajos_bp)
app.register_blueprint(rangos_institucionales_bp)
app.register_blueprint(legajo_rangos_bp)
app.register_blueprint(legajo_sedes_bp)
app.register_blueprint(datos_medicos_bp)
app.register_blueprint(tipos_contacto_bp)
app.register_blueprint(contactos_bp)
app.register_blueprint(personas_relaciones_bp)
app.register_blueprint(tipos_legajo_bp)
app.register_blueprint(legajo_tipos_legajo_bp)

with app.app_context():
    db.create_all()
    # Semillado automático de tipos de legajo si no existen
    from models.tipo_legajo import TipoLegajo
    if not TipoLegajo.query.first():
        db.session.add_all([
            TipoLegajo(descripcion="Bombero Activo", usuario_accion=1),
            TipoLegajo(descripcion="Aspirante", usuario_accion=1),
            TipoLegajo(descripcion="Retirado", usuario_accion=1),
            TipoLegajo(descripcion="Auxiliar", usuario_accion=1)
        ])
        db.session.commit()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
