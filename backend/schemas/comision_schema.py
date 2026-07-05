from models.comision import Comision
from db import ma
from marshmallow import ValidationError, validates, pre_load, validates_schema
from marshmallow.validate import Length

class ComisionSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Comision
        load_instance = True

    # Campo de solo lectura para las respuestas.
    id_comision = ma.auto_field(dump_only=True)

    plan_asignaturas_id = ma.auto_field(
        required=True,
        allow_none=False,
        error_messages={
            "required": "El plan de asignaturas es obligatorio",
            "null": "El plan de asignaturas no puede ser null",
            "invalid": "El ID debe ser un número entero"
        }
    )

    aula_id = ma.auto_field(
        required=True,
        allow_none=False,
        error_messages={
            "required": "El aula es obligatoria",
            "null": "El aula no puede ser null",
            "invalid": "El ID debe ser un número entero"
        }
    )

    nombre = ma.auto_field(
        required=True,
        allow_none=False,
        validate=[
            Length(min=1, max=45, error="El nombre debe tener entre 1 y 45 caracteres")
        ],
        error_messages={
            "required": "El nombre es obligatorio",
            "null": "El nombre no puede ser null"
        }
    )

    modalidad = ma.auto_field(
        required=True,
        allow_none=False,
        validate=[
            Length(min=1, max=45, error="La modalidad debe tener entre 1 y 45 caracteres")
        ],
        error_messages={
            "required": "La modalidad es obligatoria",
            "null": "La modalidad no puede ser null"
        }
    )

    cupo_maximo = ma.auto_field(
        required=True,
        allow_none=False,
        error_messages={
            "required": "El cupo máximo es obligatorio",
            "null": "El cupo máximo no puede ser null",
            "invalid": "El cupo máximo debe ser un número entero"
        }
    )

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

    @validates("cupo_maximo")
    def validar_cupo_maximo(self, value, **kwargs):
        if value <= 0:
            raise ValidationError("El cupo máximo debe ser mayor a cero.")

    @validates("usuario_accion")
    def validar_usuario_accion(self, value, **kwargs):
        if value <= 0:
            raise ValidationError("El usuario de acción debe ser un número entero positivo")

    @pre_load
    def normalizar_entrada(self, data, **kwargs):
        for campo in ["nombre", "modalidad"]:
            if campo in data and isinstance(data[campo], str):
                data[campo] = data[campo].strip()
        return data

# Instancias usadas por las rutas y servicios.
comision_schema = ComisionSchema()
comisiones_schema = ComisionSchema(many=True)