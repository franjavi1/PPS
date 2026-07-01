from models.rangos_institucionales import RangosInstitucionales

from db import ma

from marshmallow import ValidationError, validates, validates_schema, pre_load, post_dump
from marshmallow.validate import Length


class RangosInstitucionalesSchema(ma.SQLAlchemySchema):
    # Configuracion del schema asociado al modelo.
    class Meta:
        model = RangosInstitucionales
        load_instance = True

    # Campo de solo lectura para las respuestas.
    id = ma.auto_field(dump_only=True)

    # Descripcion del rango institucional.
    descripcion = ma.auto_field(
        required=True,
        allow_none=False,
        validate=[
            Length(min=1, max=45, error="La descripcion debe tener entre 1 y 45 caracteres")
        ],
        error_messages={
            "required": "La descripcion es obligatoria",
            "null": "La descripcion no puede ser null",
            "invalid": "La descripcion debe ser un texto valido"
        }
    )

    # Nivel de jerarquia del rango institucional.
    nivel_jerarquia = ma.auto_field(
        required=True,
        allow_none=False,
        error_messages={
            "required": "El nivel de jerarquia es obligatorio",
            "null": "El nivel de jerarquia no puede ser null",
            "invalid": "El nivel de jerarquia debe ser un numero entero"
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

    # Verifica que el nivel de jerarquia sea positivo.
    @validates("nivel_jerarquia")
    def validar_nivel_jerarquia(self, value, **kwargs):
        if value <= 0:
            raise ValidationError("El nivel de jerarquia debe ser un numero entero positivo")

    # Verifica que el usuario informado sea valido.
    @validates("usuario_accion")
    def validar_usuario_accion(self, value, **kwargs):
        if value <= 0:
            raise ValidationError("El usuario de accion debe ser un numero entero positivo")

    # Evita cargar rangos con descripciones repetidas.
    @validates_schema
    def validar_descripcion_unica(self, data, **kwargs):
        descripcion = data.get("descripcion")

        if not descripcion:
            return

        existente = RangosInstitucionales.query.filter_by(
            descripcion=descripcion
        ).first()

        rango_id = getattr(self, "context", {}).get("rango_id")

        if existente and existente.id != rango_id:
            raise ValidationError({
                "descripcion": ["Ya existe un rango institucional con esa descripcion"]
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
rango_institucional_schema = RangosInstitucionalesSchema()
rangos_institucionales_schema = RangosInstitucionalesSchema(many=True)
