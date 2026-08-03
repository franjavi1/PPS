from models.legajo import Legajo
from models.legajo_rangos import LegajoRangos
from models.rangos_institucionales import RangosInstitucionales

from db import ma

from marshmallow import ValidationError, validates, validates_schema


class LegajoRangosSchema(ma.SQLAlchemySchema):
    # Configuracion del schema asociado al modelo.
    class Meta:
        model = LegajoRangos
        load_instance = True

    # Campo de solo lectura para las respuestas.
    id = ma.auto_field(dump_only=True)

    # Legajo asociado.
    legajo_id = ma.auto_field(
        required=True,
        allow_none=False,
        error_messages={
            "required": "El legajo es obligatorio",
            "null": "El legajo no puede ser null",
            "invalid": "El legajo debe ser un numero entero"
        }
    )

    # Rango institucional asociado.
    rangos_institucionales_id = ma.auto_field(
        required=False,
        allow_none=True,
        error_messages={
            "invalid": "El rango institucional debe ser un numero entero"
        }
    )
    estado = ma.auto_field(dump_only=True)
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

    # Verifica que el legajo exista y este activo.
    @validates("legajo_id")
    def validar_legajo_existente(self, value, **kwargs):
        if value <= 0:
            raise ValidationError("El legajo debe ser un numero entero positivo")
        if Legajo.query.filter_by(id=value, estado=1).first() is None:
            raise ValidationError("El legajo indicado no existe o no esta activo")

    # Verifica que el rango institucional exista cuando se informa.
    @validates("rangos_institucionales_id")
    def validar_rango_existente(self, value, **kwargs):
        if value is None:
            return
        if value <= 0:
            raise ValidationError("El rango institucional debe ser un numero entero positivo")
        if RangosInstitucionales.query.get(value) is None:
            raise ValidationError("El rango institucional indicado no existe")

    # Verifica que el usuario informado sea valido.
    @validates("usuario_accion")
    def validar_usuario_accion(self, value, **kwargs):
        if value is not None and value <= 0:
            raise ValidationError("El usuario de accion debe ser un numero entero positivo")

    # Evita repetir el mismo rango para el mismo legajo.
    @validates_schema
    def validar_relacion_unica(self, data, **kwargs):
        legajo_id = data.get("legajo_id")
        rangos_institucionales_id = data.get("rangos_institucionales_id")

        if not legajo_id or rangos_institucionales_id is None:
            return

        existente = LegajoRangos.query.filter_by(
            legajo_id=legajo_id,
            rangos_institucionales_id=rangos_institucionales_id,
            estado=1
        ).first()

        legajo_rangos_id = getattr(self, "context", {}).get("legajo_rangos_id")

        if existente and existente.id != legajo_rangos_id:
            raise ValidationError({
                "rangos_institucionales_id": [
                    "Ya existe ese rango institucional para el legajo indicado"
                ]
            })


# Instancias usadas por las rutas y servicios.
legajo_rangos_schema = LegajoRangosSchema()
legajos_rangos_schema = LegajoRangosSchema(many=True)
