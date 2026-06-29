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

    # Nombre del tipo de plan.
    nombre = ma.auto_field(
        required=True,
        allow_none=False,
        validate=[
            Length(min=1, max=100, error="El nombre debe tener entre 1 y 100 caracteres"),
            Regexp(REGEX_SOLO_LETRAS, error="El nombre solo puede contener letras")
        ],
        error_messages={
            "required": "El nombre es obligatorio",
            "null": "El nombre no puede ser null",
            "invalid": "El nombre debe ser un texto valido"
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

    # Evita cargar tipos de plan con nombres repetidos.
    @validates_schema
    def validar_nombre_unico(self, data, **kwargs):
        nombre = data.get("nombre")

        if not nombre:
            return

        existente = TipoPlanes.query.filter_by(
            nombre=nombre
        ).first()

        tipo_planes_id = getattr(self, "context", {}).get("tipo_planes_id")

        if existente and existente.id_tipo_planes != tipo_planes_id:
            raise ValidationError({
                "nombre": ["Ya existe un tipo de plan con ese nombre"]
            })

    # Limpia el texto recibido antes de validar y guardar.
    @pre_load
    def normalizar_entrada(self, data, **kwargs):
        if "nombre" in data and isinstance(data["nombre"], str):
            data["nombre"] = data["nombre"].strip().title()

        return data

    # Mantiene el formato del nombre al devolver la respuesta.
    @post_dump
    def capitalizar_salida(self, data, **kwargs):
        if "nombre" in data and isinstance(data["nombre"], str):
            data["nombre"] = data["nombre"].title()

        return data


# Instancias usadas por las rutas y servicios.
tipo_planes_schema = TipoPlanesSchema()
tipos_planes_schema = TipoPlanesSchema(many=True)
