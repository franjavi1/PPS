from models.aula import Aula
from db import ma
from marshmallow import ValidationError, validates, pre_load
from marshmallow.validate import Length, OneOf

class AulaSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Aula
        load_instance = True

    # Campo de solo lectura para las respuestas.
    id_aula = ma.auto_field(dump_only=True)

    sedes_id = ma.auto_field(
        required=True,
        allow_none=False,
        error_messages={
            "required": "La sede es obligatoria",
            "null": "La sede no puede ser null",
            "invalid": "El ID debe ser un número entero"
        }
    )

    # Estado actual del registro.
    estado = ma.auto_field(dump_only=True)

    aula = ma.auto_field(
        required=True,
        allow_none=False,
        validate=[
            Length(min=1, max=45, error="El nombre del aula debe tener entre 1 y 45 caracteres")
        ],
        error_messages={
            "required": "El nombre del aula es obligatorio",
            "null": "El nombre del aula no puede ser null"
        }
    )

    es_virtual = ma.auto_field(
        required=True,
        allow_none=False,
        validate=[OneOf([0, 1], error="es_virtual debe ser 0 o 1")],
        error_messages={
            "required": "El campo esVirtual es obligatorio",
            "null": "El campo esVirtual no puede ser null",
            "invalid": "Debe ser un número entero (0 o 1)"
        }
    )

    # Estado actual del registro.
    estado = ma.auto_field(dump_only=True)

    # Usuario que realiza la acción sobre el registro.
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
        if "aula" in data and isinstance(data["aula"], str):
            data["aula"] = data["aula"].strip()
        return data

# Instancias usadas por las rutas y servicios.
aula_schema = AulaSchema()
aulas_schema = AulaSchema(many=True)