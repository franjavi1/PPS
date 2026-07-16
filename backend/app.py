from flask import Flask
from flask_cors import CORS

from db import db, ma
from config.config import Config

from utils.response import responder
from utils.errores import Error_de_negocio 
from marshmallow import ValidationError
from sqlalchemy.exc import DataError, IntegrityError
from werkzeug.exceptions import HTTPException

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    
    
    @app.route("/health", methods=["GET"])
    def health():
        return {
            "status": "success",
            "message": "API funcionando"
        }, 200
        
    # se ejecuta al finalizar una peticion
    @app.teardown_request
    def gestionar_sesion(exception=None):
        # si falla elimina cambios, para evitar modificaciones corruptas
        if exception:
            db.session.rollback()
        # se librea la session para que pueda ser utilizada nuevamente en otra peticion
        db.session.remove()
        
    # captura errores cuando datos no concuerda con las reglas que pusimos en marshmellow o schemas
    @app.errorhandler(ValidationError)
    def manejar_validacion_marshmallow(err):
        # lo intercepta en error y lo revuelve con la nueva funcion de utils
        return responder(
            ok=False, 
            message=err.messages, 
            error=err.messages,
            status=400
        )
    
    # errores de la logica_de_negocio que implementamos
    @app.errorhandler(Error_de_negocio)
    def manejar_errores_negocio(err):
        return responder(
            ok=False,
            message=err.message,
            error="",
            status=err.status
        )
        
    # lleva dos decoradores para detectar fallos de la base de datos
    # - DataError - mandar un texto gigante a una columna de pocos caracteres.
    # - IntegrityError - intentar registrar un email que ya existe, uniquie = True en el modelo
    @app.errorhandler(DataError)
    @app.errorhandler(IntegrityError)
    def manejar_errores_base_datos(err):
        db.session.rollback()
        
        # Extraemos el mensaje de error original que devolvió el motor de la BD (PostgreSQL/MySQL),
        # 1. ¿Tiene el error original de la BD? (hasattr busca el atributo 'orig' en 'err').
        # 2. Si existe (True): extrae y convierte a texto el error real de la base de datos (err.orig).
        # 3. Si no existe (False): usa el error genérico de SQLAlchemy (err).
        detalles_bd = str(err.orig) if hasattr(err, 'orig') else str(err)
        
        return responder(
            ok=False,
            message="Error de persistencia o consistencia en la base de datos.",
            error=detalles_bd,
            status=400
        )
    
    # manejador de error globar, si no fue capturado por lo anteriores lo captura este
    @app.errorhandler(Exception)
    def manejar_error_general(e):
        # Si el error capturado es en realidad una excepción HTTP estándar de Flask como un error 404 de "Ruta no encontrada" o 405 de "Método no permitido")
        if isinstance(e, HTTPException):
            return responder(ok=False, message=e.description, error=e.name, status=e.code)
            
        # Si es un error de código imprevisto (ej. un bug de programación, división por cero, KeyError)
        # Devolvemos un error 500 (Internal Server Error) para que la app no colapse y ocultamos los detalles internos sensibles en un JSON controlado.
        return responder(
            ok=False, 
            message="Ocurrió un error inesperado en el servidor.", 
            error=str(e), 
            status=500
        )
        
    # CORS(app) -> lo cambie por seguridad para no recibir peticiones de cualquier lado
    CORS(app, resources={r"/api/g1/*" : {"origins" : ["http://localhost:5000"]}})
    
    db.init_app(app)
    ma.init_app(app)
    
    with app.app_context():

        from models.persona import Persona
        from backend.models.tipo_documento_model import TipoDocumentoModel
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
        
        
        from routes.personas import personas_bp
        from backend.routes.tipos_documentos_routes import tipos_documentos_bp
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

        app.register_blueprint(personas_bp)
        app.register_blueprint(tipos_documentos_bp, url_prefix="/tipos-documentos")
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
        
        db.create_all()
        
    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
