from models.tipos_autoridad import TipoAutoridad
from db import ma
from marshmallow import ValidationError, validates, pre_load
from marshmallow.validate import Length

class TipoAutoridadSchema(ma.SQLAlchemySchema):
    class Meta:
        model = TipoAutoridad
        load_instance = True

    # Campo de solo lectura para las respuestas.
    id = ma.auto_field(dump_only=True)

    descripcion = ma.auto_field(
        required=True,
        allow_none=False,
        validate=[
            Length(min=1, max=45, error="La descripción debe tener entre 1 y 45 caracteres")
        ],
        error_messages={
            "required": "La descripción es obligatoria",
            "null": "La descripción no puede ser null"
        }
    )

    estado = ma.auto_field(dump_only=True)
    usuario_accion = ma.auto_field(
        required=True,
        allow_none=False,
        error_messages={
            "required": "El usuario de acción es obligatorio",
            "null": "El usuario de acción no puede ser null",
            "invalid": "El usuario de acción debe ser un número entero"
        }
    )

    # Fechas administradas por la base de datos.
    ts_creacion = ma.auto_field(dump_only=True)
    ts_modificacion = ma.auto_field(dump_only=True)

    @validates("usuario_accion")
    def validar_usuario_accion(self, value, **kwargs):
        if value <= 0:
            raise ValidationError("El usuario de acción debe ser un número entero positivo")

    @pre_load
    def normalizar_entrada(self, data, **kwargs):
        if "descripcion" in data and isinstance(data["descripcion"], str):
            data["descripcion"] = data["descripcion"].strip()
        return data

# Instancias usadas por las rutas y servicios.
tipo_autoridad_schema = TipoAutoridadSchema()
tipos_autoridad_schema = TipoAutoridadSchema(many=True)