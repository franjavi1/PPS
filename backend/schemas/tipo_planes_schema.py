from models.tipo_planes import TipoPlanes

from db import ma

from marshmallow import ValidationError, validates_schema, pre_load, post_dump
from marshmallow.validate import Length, Regexp


REGEX_SOLO_LETRAS = r"^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$"


class TipoPlanesSchema(ma.SQLAlchemySchema):
    # Configuracion del schema asociado al modelo.
    class Meta:
        model = TipoPlanes
        load_instance = True

    # Campo de solo lectura para las respuestas.
    id_tipo_planes = ma.auto_field(dump_only=True)

    # Descripcion del tipo de plan.
    descripcion = ma.auto_field(
        required=True,
        allow_none=False,
        validate=[
            Length(min=1, max=100, error="La descripcion debe tener entre 1 y 100 caracteres"),
            Regexp(REGEX_SOLO_LETRAS, error="La descripcion solo puede contener letras")
        ],
        error_messages={
            "required": "La descripcion es obligatoria",
            "null": "La descripcion no puede ser null",
            "invalid": "La descripcion debe ser un texto valido"
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

    # Evita cargar tipos de plan con descripciones repetidas.
    @validates_schema
    def validar_descripcion_unica(self, data, **kwargs):
        descripcion = data.get("descripcion")

        if not descripcion:
            return

        existente = TipoPlanes.query.filter_by(
            descripcion=descripcion,
            estado=1
        ).first()

        tipo_planes_id = getattr(self, "context", {}).get("tipo_planes_id")

        if existente and existente.id_tipo_planes != tipo_planes_id:
            raise ValidationError({
                "descripcion": ["Ya existe un tipo de plan con esa descripcion"]
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
tipo_planes_schema = TipoPlanesSchema()
tipos_planes_schema = TipoPlanesSchema(many=True)
