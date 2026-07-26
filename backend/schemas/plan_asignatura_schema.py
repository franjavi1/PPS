from models.plan_asignatura import PlanAsignatura
from db import ma
from marshmallow import ValidationError, validates, pre_load, fields
from marshmallow.validate import Length
from schemas.pa_correlativa_schema import PACorrelativaSchema

class PlanAsignaturaSchema(ma.SQLAlchemySchema):
    class Meta:
        model = PlanAsignatura
        load_instance = True

    correlativas = fields.Nested(PACorrelativaSchema, many=True)
    
    id = ma.auto_field(dump_only=True)

    asignatura_id = ma.auto_field(required=True)
    plan_id = ma.auto_field(required=True)
    rango_minimo_id = ma.auto_field(required=True)
    sedes_id = ma.auto_field(required=True)
    
    presentismo_porc = ma.auto_field(required=True)
    regularizacion_prom = ma.auto_field(required=True)
    final_aprobacion = ma.auto_field(required=True)
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

    usuario_accion = ma.auto_field(
        required=True,
        error_messages={"required": "El usuario de acción es obligatorio"}
    )

    ts_creacion = ma.auto_field(dump_only=True)
    ts_modificacion = ma.auto_field(dump_only=True)

    @validates("usuario_accion")
    def validar_usuario_accion(self, value, **kwargs):
        if value <= 0:
            raise ValidationError("El usuario de acción debe ser un número entero positivo")

    @pre_load
    def normalizar_entrada(self, data, **kwargs):
        for campo in ["regimen", "modalidad"]:
            if campo in data and isinstance(data[campo], str):
                data[campo] = data[campo].strip()
        return data

plan_asignatura_schema = PlanAsignaturaSchema()
planes_asignaturas_schema = PlanAsignaturaSchema(many=True)