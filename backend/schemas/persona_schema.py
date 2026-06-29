from models.persona import Persona
from models.tipo_documento import TipoDocumento

from db import ma

from marshmallow import ValidationError, validates, pre_load, post_dump, validates_schema
from marshmallow.validate import Regexp, Length

REGEX_SOLO_LETRAS = r"^[A-Za-zÁÉÍÓÚáéíóúñÑ\s'-]+$"


class PersonaSchema(ma.SQLAlchemySchema):
    # Configuracion del schema asociado al modelo.
    class Meta:
        model = Persona
        load_instance = True

    # Campo de solo lectura para las respuestas.
    id = ma.auto_field(dump_only=True)

    # Tipo de documento asociado a la persona.
    td_id = ma.auto_field(
        required=True,
        allow_none=False,
        error_messages={
            "required": "El tipo de documento es obligatorio",
            "null": "El tipo de documento no puede ser null",
            "invalid": "El tipo de documento debe ser un número entero"


        }
    )

    # Nombre de la persona.
    nombre = ma.auto_field(
        required=True,
        allow_none=False,
        validate=[
            Length(min=1, error="El nombre no puede estar vacío"),
            Regexp(REGEX_SOLO_LETRAS, error="El nombre solo puede contener letras")
        ],
        error_messages={
            "required": "El nombre es obligatorio",
            "invalid": "El nombre debe ser un texto válido",
            "null": "El nombre no puede ser null"
        }
    )

    # Apellido de la persona.
    apellido = ma.auto_field(
        required=True,
        allow_none=False,
        validate=[
            Length(min=1, error="El apellido no puede estar vacío"),
            Regexp(REGEX_SOLO_LETRAS,
                   error="El apellido solo puede contener letras")
        ],
        error_messages={
            "required": "El apellido es obligatorio",
            "invalid": "El apellido debe ser un texto válido",
            "null": "El apellido no puede ser null"
        }
    )

    # Numero de documento registrado.
    numero_doc = ma.auto_field(
        required=True,
        allow_none=False,
        error_messages={
            "required": "El número de documento es obligatorio",
            "null": "El número de documento no puede ser null",
            "invalid": "El número de documento debe ser un número entero"
        }
    )

    # Estado actual del registro.
    estado = ma.auto_field(dump_only=True)

    # Usuario que realiza la accion sobre el registro.
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

    # Verifica que el tipo de documento exista.
    @validates("td_id")
    def validar_tipo_documento_existente(self, value, **kwargs):
        if value <= 0:
            raise ValidationError(
                "El tipo de documento debe ser un número entero positivo")
        if TipoDocumento.query.get(value) is None:
            raise ValidationError("El tipo de documento indicado no existe.")

    # Verifica que el numero de documento sea valido.
    @validates("numero_doc")
    def validar_numero_doc(self, value, **kwargs):
        if value <= 0:
            raise ValidationError(
                "El número de documento debe ser un número entero positivo")

    # Verifica que el usuario informado sea valido.
    @validates("usuario_accion")
    def validar_usuario_accion(self, value, **kwargs):
        if value <= 0:
            raise ValidationError(
                "El usuario de acción debe ser un número entero positivo")

    # Evita registrar la misma persona con igual tipo y numero de documento.
    @validates_schema
    def validar_documento_unico(self, data, **kwargs):
        td_id = data.get("td_id")
        numero_doc = data.get("numero_doc")

        if not td_id or not numero_doc:
            return

        existente = Persona.query.filter_by(
            td_id=td_id,
            numero_doc=numero_doc

        ).first()

        persona_id = getattr(self, "context", {}).get("persona_id")

        if existente and existente.id != persona_id:
            raise ValidationError({
                "numero_doc": ["Ya existe una persona con ese tipo y número de documento"]
            })

    # Limpia los textos recibidos antes de validar y guardar.
    @pre_load
    def normalizar_entrada(self, data, **kwargs):
        for campo in ["nombre", "apellido"]:
            if campo in data and isinstance(data[campo], str):
                data[campo] = data[campo].strip().title()
        return data

    # Mantiene el formato de nombres y apellidos en la respuesta.
    @post_dump
    def capitalizar_salida(self, data, **kwargs):
        for campo in ["nombre", "apellido"]:
            if campo in data and isinstance(data[campo], str):
                data[campo] = data[campo].title()
        return data


# Instancias usadas por las rutas y servicios.
persona_schema = PersonaSchema()
personas_schema = PersonaSchema(many=True)
