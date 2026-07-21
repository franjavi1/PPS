from models.datos_medicos import DatosMedicos
from models.persona import Persona

from extensions import ma

from marshmallow import ValidationError, validates, pre_load, post_dump
from marshmallow.validate import Length, OneOf


class DatosMedicosSchema(ma.SQLAlchemySchema):
    # Configuracion del schema asociado al modelo.
    class Meta:
        model = DatosMedicos
        load_instance = True

    # Campo de solo lectura para las respuestas.
    id = ma.auto_field(dump_only=True)

    # Persona asociada a los datos medicos.
    persona_id = ma.auto_field(
        required=True,
        allow_none=False,
        error_messages={
            "required": "La persona es obligatoria",
            "null": "La persona no puede ser null",
            "invalid": "La persona debe ser un numero entero"
        }
    )

    # Grupo sanguineo de la persona.
    grupo_sanguineo = ma.auto_field(
        required=True,
        allow_none=False,
        validate=[
            OneOf(
                ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
                error="El grupo sanguineo indicado no es valido"
            )
        ],
        error_messages={
            "required": "El grupo sanguineo es obligatorio",
            "null": "El grupo sanguineo no puede ser null",
            "invalid": "El grupo sanguineo debe ser un texto valido"
        }
    )

    # Alergias registradas de la persona.
    alergias = ma.auto_field(
        required=False,
        allow_none=True,
        validate=[
            Length(max=45, error="Las alergias no pueden superar los 45 caracteres")
        ],
        error_messages={
            "invalid": "Las alergias deben ser un texto valido"
        }
    )

    # Aptitud fisica de la persona.
    aptitud_fisica = ma.auto_field(
        required=True,
        allow_none=False,
        error_messages={
            "required": "La aptitud fisica es obligatoria",
            "null": "La aptitud fisica no puede ser null",
            "invalid": "La aptitud fisica debe ser verdadero o falso"
        }
    )

    # Seguro medico de la persona.
    seguro = ma.auto_field(
        required=True,
        allow_none=False,
        validate=[
            Length(min=1, max=45, error="El seguro debe tener entre 1 y 45 caracteres")
        ],
        error_messages={
            "required": "El seguro es obligatorio",
            "null": "El seguro no puede ser null",
            "invalid": "El seguro debe ser un texto valido"
        }
    )

    # Usuario que realiza la accion sobre el registro.
    usuario_accion = ma.auto_field(
        required=False,
        allow_none=True,
        error_messages={
            "invalid": "El usuario de accion debe ser un numero entero"
        }
    )

    # Fechas administradas por la base de datos.
    ts_creacion = ma.auto_field(dump_only=True)
    ts_modificacion = ma.auto_field(dump_only=True)

    # Verifica que la persona exista y este activa.
    @validates("persona_id")
    def validar_persona_existente(self, value, **kwargs):
        if value <= 0:
            raise ValidationError("La persona debe ser un numero entero positivo")
        if Persona.query.filter_by(id=value, estado=1).first() is None:
            raise ValidationError("La persona indicada no existe o no esta activa")

    # Verifica que el usuario informado sea valido.
    @validates("usuario_accion")
    def validar_usuario_accion(self, value, **kwargs):
        if value is not None and value <= 0:
            raise ValidationError("El usuario de accion debe ser un numero entero positivo")

    # Limpia los textos recibidos antes de validar y guardar.
    @pre_load
    def normalizar_entrada(self, data, **kwargs):
        for campo in ["grupo_sanguineo", "alergias", "seguro"]:
            if campo in data and isinstance(data[campo], str):
                data[campo] = data[campo].strip()

        if "grupo_sanguineo" in data and isinstance(data["grupo_sanguineo"], str):
            data["grupo_sanguineo"] = data["grupo_sanguineo"].upper()

        return data

    # Mantiene los textos limpios al devolver la respuesta.
    @post_dump
    def normalizar_salida(self, data, **kwargs):
        for campo in ["grupo_sanguineo", "alergias", "seguro"]:
            if campo in data and isinstance(data[campo], str):
                data[campo] = data[campo].strip()

        return data


# Instancias usadas por las rutas y servicios.
datos_medicos_schema = DatosMedicosSchema()
datos_medicos_lista_schema = DatosMedicosSchema(many=True)
