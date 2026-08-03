from models.pa_correlativa import PACorrelativa
from db import ma
from marshmallow import ValidationError, validates
from marshmallow.validate import Range

class PACorrelativaSchema(ma.SQLAlchemySchema):
    class Meta:
        model = PACorrelativa
        load_instance = True

    # Campo de solo lectura para las respuestas.
    id = ma.auto_field(dump_only=True)

    asignatura_id = ma.auto_field(
        required=True,
        allow_none=False,
        error_messages={
            "required": "El ID de la asignatura es obligatorio",
            "null": "El ID de la asignatura no puede ser null",
            "invalid": "El ID debe ser un número entero"
        }
    )

    pa_id = ma.auto_field(
        required=True,
        allow_none=False,
        error_messages={
            "required": "El ID del plan de asignatura (paId) es obligatorio",
            "null": "El ID del plan de asignatura no puede ser null",
            "invalid": "El ID debe ser un número entero"
        }
    )
    estado = ma.auto_field(dump_only=True)


    # Fechas administradas por la base de datos.

    id_persona_alta = ma.auto_field(dump_only=True)
    id_persona_modificacion = ma.auto_field(dump_only=True)
    id_persona_baja= ma.auto_field(dump_only=True)
    ts_creacion = ma.auto_field(dump_only=True)
    ts_modificacion = ma.auto_field(dump_only=True)
    ts_baja = ma.auto_field(dump_only=True)

    @validates("asignatura_id")
    def validar_asignatura_id(self, value, **kwargs):
        if value <= 0:
            raise ValidationError("El ID de la asignatura debe ser mayor a 0")

    @validates("pa_id")
    def validar_pa_id(self, value, **kwargs):
        if value <= 0:
            raise ValidationError("El ID del plan de asignatura debe ser mayor a 0")



# Instancias usadas por las rutas y servicios.
pa_correlativa_schema = PACorrelativaSchema()
pa_correlativas_schema = PACorrelativaSchema(many=True)