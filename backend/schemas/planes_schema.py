from models.planes import Planes
from models.tipo_planes import TipoPlanes

from db import ma

from marshmallow import ValidationError, validates, validates_schema, pre_load, post_dump
from marshmallow.validate import Length


class PlanesSchema(ma.SQLAlchemySchema):
    # Configuracion del schema asociado al modelo.
    class Meta:
        model = Planes
        load_instance = True

    # Campo de solo lectura para las respuestas.
    id = ma.auto_field(dump_only=True)

    # Tipo de plan asociado.
    tipo_planes_id_tipo_planes = ma.auto_field(
        required=True,
        allow_none=False,
        error_messages={
            "required": "El tipo de plan es obligatorio",
            "null": "El tipo de plan no puede ser null",
            "invalid": "El tipo de plan debe ser un numero entero"
        }
    )

    # Numero de resolucion ministerial.
    resolucion_ministerial = ma.auto_field(
        required=True,
        allow_none=False,
        error_messages={
            "required": "La resolucion ministerial es obligatoria",
            "null": "La resolucion ministerial no puede ser null",
            "invalid": "La resolucion ministerial debe ser un numero entero"
        }
    )

    # Nombre del plan.
    nombre = ma.auto_field(
        required=True,
        allow_none=False,
        validate=[
            Length(min=1, max=100, error="El nombre debe tener entre 1 y 100 caracteres")
        ],
        error_messages={
            "required": "El nombre es obligatorio",
            "null": "El nombre no puede ser null",
            "invalid": "El nombre debe ser un texto valido"
        }
    )

    # Descripcion general del plan.
    descrip = ma.auto_field(
        required=False,
        allow_none=True
    )

    # Fecha desde la que tiene vigencia.
    vigencia_dde = ma.auto_field(
        required=True,
        allow_none=False,
        error_messages={
            "required": "La fecha de inicio de vigencia es obligatoria",
            "null": "La fecha de inicio de vigencia no puede ser null",
            "invalid": "La fecha de inicio de vigencia debe ser valida"
        }
    )

    # Fecha hasta la que tiene vigencia.
    vigencia_hta = ma.auto_field(
        required=True,
        allow_none=False,
        error_messages={
            "required": "La fecha de fin de vigencia es obligatoria",
            "null": "La fecha de fin de vigencia no puede ser null",
            "invalid": "La fecha de fin de vigencia debe ser valida"
        }
    )

    # Estado actual del registro.
    estado = ma.auto_field(dump_only=True)

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

    # Verifica que el tipo de plan exista.
    @validates("tipo_planes_id_tipo_planes")
    def validar_tipo_plan_existente(self, value, **kwargs):
        if value <= 0:
            raise ValidationError("El tipo de plan debe ser un numero entero positivo")
        if TipoPlanes.query.get(value) is None:
            raise ValidationError("El tipo de plan indicado no existe.")

    # Verifica que la resolucion ministerial sea valida.
    @validates("resolucion_ministerial")
    def validar_resolucion_ministerial(self, value, **kwargs):
        if value <= 0:
            raise ValidationError("La resolucion ministerial debe ser un numero entero positivo")

    # Verifica que el usuario informado sea valido.
    @validates("usuario_accion")
    def validar_usuario_accion(self, value, **kwargs):
        if value <= 0:
            raise ValidationError("El usuario de accion debe ser un numero entero positivo")

    # Controla que el rango de vigencia sea correcto.
    @validates_schema
    def validar_rango_vigencia(self, data, **kwargs):
        vigencia_dde = data.get("vigencia_dde")
        vigencia_hta = data.get("vigencia_hta")

        if not vigencia_dde or not vigencia_hta:
            return

        if vigencia_hta < vigencia_dde:
            raise ValidationError({
                "vigencia_hta": ["La fecha de fin no puede ser anterior a la fecha de inicio"]
            })

    # Limpia los textos recibidos antes de validar y guardar.
    @pre_load
    def normalizar_entrada(self, data, **kwargs):
        if "nombre" in data and isinstance(data["nombre"], str):
            data["nombre"] = data["nombre"].strip().title()

        if "descrip" in data and isinstance(data["descrip"], str):
            data["descrip"] = data["descrip"].strip()

        return data

    # Mantiene el formato del nombre al devolver la respuesta.
    @post_dump
    def capitalizar_salida(self, data, **kwargs):
        if "nombre" in data and isinstance(data["nombre"], str):
            data["nombre"] = data["nombre"].title()

        return data


# Instancias usadas por las rutas y servicios.
plan_schema = PlanesSchema()
planes_schema = PlanesSchema(many=True)
