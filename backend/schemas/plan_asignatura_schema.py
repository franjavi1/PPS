from models.plan_asignatura import PlanAsignatura
from db import ma
from marshmallow import ValidationError, validates, pre_load, fields
from marshmallow.validate import Length
from schemas.pa_correlativa_schema import PACorrelativaSchema
from schemas.planes_schema import PlanesSchema

class PlanAsignaturaSchema(ma.SQLAlchemySchema):
    class Meta:
        model = PlanAsignatura
        load_instance = True

    correlativas = fields.Nested(PACorrelativaSchema, many=True)
    plan = fields.Nested(PlanesSchema, dump_only=True)
    
    id = ma.auto_field(dump_only=True)

    asignatura_id = ma.auto_field(required=True)
    plan_id = ma.auto_field(required=True)
    rango_minimo_id = ma.auto_field(required=True)
    sedes_id = ma.auto_field(required=True)
    
    presentismo_porc = ma.auto_field(required=True)
    regularizacion_prom = ma.auto_field(required=False)
    final_aprobacion = ma.auto_field(required=False)
    duracion = ma.auto_field(required=True)

    regimen = ma.auto_field(
        required=True,
        validate=[Length(min=1, max=45, error="El régimen debe tener entre 1 y 45 caracteres")]
    )
    
    modalidad = ma.auto_field(
        required=True,
        validate=[Length(min=1, max=45, error="La modalidad debe tener entre 1 y 45 caracteres")]
    )

    estado = ma.auto_field(dump_only=True)



    id_persona_alta = ma.auto_field(dump_only=True)
    id_persona_modificacion = ma.auto_field(dump_only=True)
    id_persona_baja= ma.auto_field(dump_only=True)
    ts_creacion = ma.auto_field(dump_only=True)
    ts_modificacion = ma.auto_field(dump_only=True)
    ts_baja = ma.auto_field(dump_only=True)



    @pre_load
    def normalizar_entrada(self, data, **kwargs):
        for campo in ["regimen", "modalidad"]:
            if campo in data and isinstance(data[campo], str):
                data[campo] = data[campo].strip()
        return data

plan_asignatura_schema = PlanAsignaturaSchema()
planes_asignaturas_schema = PlanAsignaturaSchema(many=True)