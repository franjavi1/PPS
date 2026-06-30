from models.sedes import Sedes
from models.tipo_sede import TipoSede

from db import ma

from marshmallow import ValidationError, validates, pre_load, post_dump
from marshmallow.validate import Length


class SedesSchema(ma.SQLAlchemySchema):
    # Configuracion del schema asociado al modelo.
    class Meta:
        model = Sedes
        load_instance = True

    # Campo de solo lectura para las respuestas.
    id = ma.auto_field(dump_only=True)

    # Tipo de sede asociado.
    tipo_sede_id = ma.auto_field(
        required=True,
        allow_none=False,
        error_messages={
            "required": "El tipo de sede es obligatorio",
            "null": "El tipo de sede no puede ser null",
            "invalid": "El tipo de sede debe ser un numero entero"
        }
    )

    # Nombre de la sede.
    nombre = ma.auto_field(
        required=True,
        allow_none=False,
        validate=[
            Length(min=1, max=100, error="El nombre debe tener entre 1 y 100 caracteres")
        ],
        error_messages={
            "required": "El nombre es obligatorio",
            "null": "El nombre no puede ser null",
            "invalid": "El nombre debe ser un texto valido"
        }
    )

    # Direccion de la sede.
    direccion = ma.auto_field(
        required=True,
        allow_none=False,
        validate=[
            Length(min=1, max=200, error="La direccion debe tener entre 1 y 200 caracteres")
        ],
        error_messages={
            "required": "La direccion es obligatoria",
            "null": "La direccion no puede ser null",
            "invalid": "La direccion debe ser un texto valido"
        }
    )

    # Estado actual del registro.
    estado = ma.auto_field(dump_only=True)

    # Usuario que realiza la accion sobre el registro.
    usuario_accion = ma.auto_field(
        required=True,
        allow_none=False,
        error_messages={
            "required": "El usuario de accion es obligatorio",
            "null": "El usuario de accion no puede ser null",
            "invalid": "El usuario de accion debe ser un numero entero"
        }
    )

    # Fechas administradas por la base de datos.
    ts_creacion = ma.auto_field(dump_only=True)
    ts_modificacion = ma.auto_field(dump_only=True)

    # Verifica que el tipo de sede exista.
    @validates("tipo_sede_id")
    def validar_tipo_sede_existente(self, value, **kwargs):
        if value <= 0:
            raise ValidationError("El tipo de sede debe ser un numero entero positivo")
        if TipoSede.query.get(value) is None:
            raise ValidationError("El tipo de sede indicado no existe.")

    # Verifica que el usuario informado sea valido.
    @validates("usuario_accion")
    def validar_usuario_accion(self, value, **kwargs):
        if value <= 0:
            raise ValidationError("El usuario de accion debe ser un numero entero positivo")

    # Limpia los textos recibidos antes de validar y guardar.
    @pre_load
    def normalizar_entrada(self, data, **kwargs):
        if "nombre" in data and isinstance(data["nombre"], str):
            data["nombre"] = data["nombre"].strip().title()

        if "direccion" in data and isinstance(data["direccion"], str):
            data["direccion"] = data["direccion"].strip()

        return data

    # Mantiene el formato del nombre al devolver la respuesta.
    @post_dump
    def capitalizar_salida(self, data, **kwargs):
        if "nombre" in data and isinstance(data["nombre"], str):
            data["nombre"] = data["nombre"].title()

        return data


# Instancias usadas por las rutas y servicios.
sede_schema = SedesSchema()
sedes_schema = SedesSchema(many=True)
