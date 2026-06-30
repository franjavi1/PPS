from models.asignaturas import Asignaturas

from db import ma

from marshmallow import ValidationError, validates, pre_load, post_dump
from marshmallow.validate import Length


class AsignaturasSchema(ma.SQLAlchemySchema):
    # Configuracion del schema asociado al modelo.
    class Meta:
        model = Asignaturas
        load_instance = True

    # Campo de solo lectura para las respuestas.
    id = ma.auto_field(dump_only=True)

    # Nombre de la asignatura.
    nombre = ma.auto_field(
        required=True,
        allow_none=False,
        validate=[
            Length(min=1, max=105,
                   error="El nombre debe tener entre 1 y 105 caracteres")
        ],
        error_messages={
            "required": "El nombre es obligatorio",
            "null": "El nombre no puede ser null",
            "invalid": "El nombre debe ser un texto valido"

        }
    )

    # Estado del registro.
    estado = ma.auto_field(dump_only=True)

    # Formato de cursado de la asignatura.
    formato = ma.auto_field(
        required=True,
        allow_none=False,
        validate=[
            Length(min=1, max=45,
                   error="El formato debe tener entre 1 y 45 caracteres")
        ],
        error_messages={
            "required": "El formato es obligatorio",
            "null": "El formato no puede ser null",
            "invalid": "El formato debe ser un texto valido"
        }
    )

    # Usuario que realiza la accion.
    usuario_accion = ma.auto_field(
        required=True,
        allow_none=False,
        error_messages={
            "required": "El usuario de accion es obligatorio",
            "null": "El usuario de accion no puede ser null",
            "invalid": "El usuario de accion debe ser un numero entero"
        }
    )

    # Fechas manejadas por la base de datos.

    ts_creacion = ma.auto_field(dump_only=True)
    ts_modificacion = ma.auto_field(dump_only=True)

    # Verifica que el usuario informado sea valido.
    @validates("usuario_accion")
    def validar_usuario_accion(self, value, **kwargs):
        if value <= 0:
            raise ValidationError(
                "El usuario de accion debe ser un numero entero positivo")

    # Limpia los datos recibidos antes de validar y guardar.

    @pre_load
    def normalizar_entrada(self, data, **kwargs):
        if "nombre" in data and isinstance(data["nombre"], str):
            data["nombre"] = data["nombre"].strip().title()

        if "formato" in data and isinstance(data["formato"], str):
            data["formato"] = data["formato"].strip().title()

        return data

    # Mantiene el formato del nombre al devolver la respuesta.
    @post_dump
    def capitalizar_salida(self, data, **kwargs):
        if "nombre" in data and isinstance(data["nombre"], str):
            data["nombre"] = data["nombre"].strip().title()

        if "formato" in data and isinstance(data["formato"], str):
            data["formato"] = data["formato"].strip().title()

        return data


# Instancias usadas por las rutas y servicios.
asignatura_schema = AsignaturasSchema()
asignaturas_schema = AsignaturasSchema(many=True)
