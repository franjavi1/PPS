from flask import Flask
from flask_cors import CORS

from db import db, ma
from config.config import Config

from models.persona import Persona
from models.tipo_documento import TipoDocumento
from models.planes import Planes
from models.tipo_planes import TipoPlanes

from routes.personas import personas_bp
from routes.tipos_documentos import tipos_documentos_bp
from routes.planes import planes_bp
from routes.tipos_planes import tipos_planes_bp


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

with app.app_context():
    db.create_all()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
