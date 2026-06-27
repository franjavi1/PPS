from models.tipo_documento import TipoDocumento

from db import ma

from marshmallow import ValidationError, validates_schema, pre_load, post_dump
from marshmallow.validate import Length, Regexp


REGEX_SOLO_LETRAS = r"^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$"


class TipoDocumentoSchema(ma.SQLAlchemySchema):
    class Meta:
        model = TipoDocumento
        load_instance = True

    id = ma.auto_field(dump_only=True)

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

    usuario_accion = ma.auto_field(
        required=True,
        allow_none=False,
        error_messages={
            "required": "El usuario de acción es obligatorio",
            "null": "El usuario de acción no puede ser null",
            "invalid": "El usuario de acción debe ser un número entero"
        }
    )

    ts_creacion = ma.auto_field(dump_only=True)
    ts_modificacion = ma.auto_field(dump_only=True)

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

    @pre_load
    def normalizar_entrada(self, data, **kwargs):
        if "descripcion" in data and isinstance(data["descripcion"], str):
            data["descripcion"] = data["descripcion"].strip().title()

        return data

    @post_dump
    def capitalizar_salida(self, data, **kwargs):
        if "descripcion" in data and isinstance(data["descripcion"], str):
            data["descripcion"] = data["descripcion"].title()

        return data


tipo_documento_schema = TipoDocumentoSchema()
tipos_documento_schema = TipoDocumentoSchema(many=True)
