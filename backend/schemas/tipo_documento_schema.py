from models.tipo_documento import TipoDocumento

from db import ma

from marshmallow import ValidationError, validates_schema, pre_load, post_dump
from marshmallow.validate import Length, Regexp


REGEX_SOLO_LETRAS = r"^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$"


class TipoDocumentoSchema(ma.SQLAlchemySchema):
    # Configuracion del schema asociado al modelo.
    class Meta:
        model = TipoDocumento
        load_instance = True

    # Campo de solo lectura para las respuestas.
    id = ma.auto_field(dump_only=True)

    # Descripcion del tipo de documento.
    descripcion = ma.auto_field(
        required=True,
        allow_none=False,
        validate=[
            Length(min=1, max=45, error="La descripción debe tener entre 1 y 45 caracteres"),
            Regexp(REGEX_SOLO_LETRAS, error="La descripción solo puede contener letras")
        ],
        error_messages={
            "required": "La descripción es obligatoria",
            "null": "La descripción no puede ser null",
            "invalid": "La descripción debe ser un texto válido"
        }
    )

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

    # Evita cargar tipos de documento con descripciones repetidas.
    @validates_schema
    def validar_descripcion_unica(self, data, **kwargs):
        descripcion = data.get("descripcion")

        if not descripcion:
            return

        existente = TipoDocumento.query.filter_by(
            descripcion=descripcion
        ).first()

        tipo_documento_id = getattr(self, "context", {}).get("tipo_documento_id")

        if existente and existente.id != tipo_documento_id:
            raise ValidationError({
                "descripcion": ["Ya existe un tipo de documento con esa descripción"]
            })

    # Limpia el texto recibido antes de validar y guardar.
    @pre_load
    def normalizar_entrada(self, data, **kwargs):
        if "descripcion" in data and isinstance(data["descripcion"], str):
            data["descripcion"] = data["descripcion"].strip().title()

        return data

    # Mantiene el formato de la descripcion al devolver la respuesta.
    @post_dump
    def capitalizar_salida(self, data, **kwargs):
        if "descripcion" in data and isinstance(data["descripcion"], str):
            data["descripcion"] = data["descripcion"].title()

        return data


# Instancias usadas por las rutas y servicios.
tipo_documento_schema = TipoDocumentoSchema()
tipos_documento_schema = TipoDocumentoSchema(many=True)
