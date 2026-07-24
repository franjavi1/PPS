from models.legajo_tipos_legajo import LegajoTiposLegajo
from db import ma

class LegajoTiposLegajoSchema(ma.SQLAlchemySchema):
    class Meta:
        model = LegajoTiposLegajo
        load_instance = True

    id_legajo_tipos_legajo = ma.auto_field(dump_only=True)
    legajo_id = ma.auto_field(required=True)
    tipo_legajo_id = ma.auto_field(required=True)
    usuario_accion = ma.auto_field(required=True)
    ts_creacion = ma.auto_field(dump_only=True)
    ts_modificacion = ma.auto_field(dump_only=True)


legajo_tipos_legajo_schema = LegajoTiposLegajoSchema()
legajo_tipos_legajos_schema = LegajoTiposLegajoSchema(many=True)
