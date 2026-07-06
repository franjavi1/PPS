from flask import Flask
from flask_cors import CORS

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

from routes.personas import personas_bp
from routes.tipos_documentos import tipos_documentos_bp
from routes.planes import planes_bp
from routes.tipos_planes import tipos_planes_bp
from routes.asignaturas import asignaturas_bp
from routes.tipos_sedes import tipos_sedes_bp
from routes.sedes import sedes_bp
from routes.comisiones import comisiones_bp
from routes.aulas import aulas_bp
from routes.pa_correlativas import pa_correlativas_bp
from routes.tipos_autoridad import tipos_autoridad_bp
from routes.planes_asignaturas import planes_asignaturas_bp
from routes.legajos import legajos_bp
from routes.rangos_institucionales import rangos_institucionales_bp
from routes.legajo_rangos import legajo_rangos_bp
from routes.datos_medicos import datos_medicos_bp
from routes.tipos_contacto import tipos_contacto_bp
from routes.contactos import contactos_bp

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
ma.init_app(app)

CORS(app)


@app.route("/health", methods=["GET"])
def health():
    return {
        "status": "success",
        "message": "API funcionando"
    }, 200


app.register_blueprint(personas_bp)
app.register_blueprint(tipos_documentos_bp)
app.register_blueprint(planes_bp)
app.register_blueprint(tipos_planes_bp)
app.register_blueprint(asignaturas_bp)
app.register_blueprint(tipos_sedes_bp)
app.register_blueprint(sedes_bp)
app.register_blueprint(comisiones_bp)
app.register_blueprint(aulas_bp)
app.register_blueprint(pa_correlativas_bp)
app.register_blueprint(tipos_autoridad_bp)
app.register_blueprint(planes_asignaturas_bp)
app.register_blueprint(legajos_bp)
app.register_blueprint(rangos_institucionales_bp)
app.register_blueprint(legajo_rangos_bp)
app.register_blueprint(datos_medicos_bp)
app.register_blueprint(tipos_contacto_bp)
app.register_blueprint(contactos_bp)

with app.app_context():
    db.create_all()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
