from models.tipo_contacto import TipoContacto

from db import ma

from marshmallow import ValidationError, validates, validates_schema, pre_load, post_dump
from marshmallow.validate import Length


class TipoContactoSchema(ma.SQLAlchemySchema):
    # Configuracion del schema asociado al modelo.
    class Meta:
        model = TipoContacto
        load_instance = True

    # Campo de solo lectura para las respuestas.
    id = ma.auto_field(dump_only=True)

    # Tipo de contacto.
    tipo = ma.auto_field(
        required=True,
        allow_none=False,
        validate=[
            Length(min=1, max=45, error="El tipo debe tener entre 1 y 45 caracteres")
        ],
        error_messages={
            "required": "El tipo de contacto es obligatorio",
            "null": "El tipo de contacto no puede ser null",
            "invalid": "El tipo de contacto debe ser un texto valido"
        }
    )
    estado = ma.auto_field(dump_only=True)
    # Usuario que realiza la accion sobre el registro.


    # Fechas administradas por la base de datos.

    id_persona_alta = ma.auto_field(dump_only=True)
    id_persona_modificacion = ma.auto_field(dump_only=True)
    id_persona_baja= ma.auto_field(dump_only=True)
    ts_creacion = ma.auto_field(dump_only=True)
    ts_modificacion = ma.auto_field(dump_only=True)
    ts_baja = ma.auto_field(dump_only=True)

    # Verifica que el usuario informado sea valido.


    # Evita cargar tipos de contacto repetidos.
    @validates_schema
    def validar_tipo_unico(self, data, **kwargs):
        tipo = data.get("tipo")

        if not tipo:
            return

        existente = TipoContacto.query.filter_by(
            tipo=tipo,
            estado=1
        ).first()

        tipo_contacto_id = getattr(self, "context", {}).get("tipo_contacto_id")

        if existente and existente.id != tipo_contacto_id:
            raise ValidationError({
                "tipo": ["Ya existe un tipo de contacto con ese tipo"]
            })

    # Limpia el texto recibido antes de validar y guardar.
    @pre_load
    def normalizar_entrada(self, data, **kwargs):
        if "tipo" in data and isinstance(data["tipo"], str):
            data["tipo"] = data["tipo"].strip().title()

        return data

    # Mantiene el formato del tipo al devolver la respuesta.
    @post_dump
    def capitalizar_salida(self, data, **kwargs):
        if "tipo" in data and isinstance(data["tipo"], str):
            data["tipo"] = data["tipo"].title()

        return data


# Instancias usadas por las rutas y servicios.
tipo_contacto_schema = TipoContactoSchema()
tipos_contacto_schema = TipoContactoSchema(many=True)
