from models.tipo_sede import TipoSede

from db import ma

from marshmallow import ValidationError, validates_schema, pre_load, post_dump
from marshmallow.validate import Length, Regexp


REGEX_SOLO_LETRAS = r"^[A-Za-zÃÃ‰ÃÃ“ÃšÃ¡Ã©Ã­Ã³ÃºÃ±Ã‘\s]+$"


class TipoSedeSchema(ma.SQLAlchemySchema):
    # Configuracion del schema asociado al modelo.
    class Meta:
        model = TipoSede
        load_instance = True

    # Campo de solo lectura para las respuestas.
    id = ma.auto_field(dump_only=True)

    # Descripcion del tipo de sede.
    descripcion = ma.auto_field(
        required=True,
        allow_none=False,
        validate=[
            Length(min=1, max=45, error="La descripcion debe tener entre 1 y 45 caracteres"),
            Regexp(REGEX_SOLO_LETRAS, error="La descripcion solo puede contener letras")
        ],
        error_messages={
            "required": "La descripcion es obligatoria",
            "null": "La descripcion no puede ser null",
            "invalid": "La descripcion debe ser un texto valido"
        }
    )

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

    # Evita cargar tipos de sede con descripciones repetidas.
    @validates_schema
    def validar_descripcion_unica(self, data, **kwargs):
        descripcion = data.get("descripcion")

        if not descripcion:
            return

        existente = TipoSede.query.filter_by(
            descripcion=descripcion
        ).first()

        tipo_sede_id = getattr(self, "context", {}).get("tipo_sede_id")

        if existente and existente.id != tipo_sede_id:
            raise ValidationError({
                "descripcion": ["Ya existe un tipo de sede con esa descripcion"]
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
tipo_sede_schema = TipoSedeSchema()
tipos_sedes_schema = TipoSedeSchema(many=True)
