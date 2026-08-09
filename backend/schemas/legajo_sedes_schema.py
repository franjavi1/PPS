from models.legajo import Legajo
from models.legajo_sedes import LegajoSedes
from models.sedes import Sedes

from db import ma

from marshmallow import ValidationError, validates, validates_schema


class LegajoSedesSchema(ma.SQLAlchemySchema):
    # Configuracion del schema asociado al modelo.
    class Meta:
        model = LegajoSedes
        load_instance = True

    # Campo de solo lectura para las respuestas.
    id = ma.auto_field(dump_only=True)

    # Sede asociada.
    sede_id = ma.auto_field(
        required=True,
        allow_none=False,
        error_messages={
            "required": "La sede es obligatoria",
            "null": "La sede no puede ser null",
            "invalid": "La sede debe ser un numero entero"
        }
    )

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

    # Indica si el legajo es autoridad en la sede.
    es_autoridad = ma.auto_field(
        required=True,
        allow_none=False,
        error_messages={
            "required": "Debe indicar si es autoridad",
            "null": "Es autoridad no puede ser null",
            "invalid": "Es autoridad debe ser verdadero o falso"
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

    # Indica si esta sede es la base principal del legajo.
    es_sede_base = ma.auto_field(
        required=True,
        allow_none=False,
        error_messages={
            "required": "Debe indicar si es sede base",
            "null": "Es sede base no puede ser null",
            "invalid": "Es sede base debe ser verdadero o falso"
        }
    )

    # Verifica que la sede exista y este activa.
    @validates("sede_id")
    def validar_sede_existente(self, value, **kwargs):
        if value <= 0:
            raise ValidationError("La sede debe ser un numero entero positivo")
        if Sedes.query.filter_by(id=value, estado=1).first() is None:
            raise ValidationError("La sede indicada no existe o no esta activa")

    # Verifica que el legajo exista y este activo.
    @validates("legajo_id")
    def validar_legajo_existente(self, value, **kwargs):
        if value <= 0:
            raise ValidationError("El legajo debe ser un numero entero positivo")
        if Legajo.query.filter_by(id=value, estado=1).first() is None:
            raise ValidationError("El legajo indicado no existe o no esta activo")

    # Verifica que el usuario informado sea valido.


    # Evita relaciones repetidas y mas de una sede base para el mismo legajo.
    @validates_schema
    def validar_relacion(self, data, **kwargs):
        legajo_sedes_id = getattr(self, "context", {}).get("legajo_sedes_id")
        legajo_sedes_actual = getattr(self, "context", {}).get("legajo_sedes")

        legajo_id = data.get("legajo_id")
        sede_id = data.get("sede_id")
        es_sede_base = data.get("es_sede_base")

        if legajo_sedes_actual is not None:
            legajo_id = legajo_id or legajo_sedes_actual.legajo_id
            sede_id = sede_id or legajo_sedes_actual.sede_id
            if es_sede_base is None:
                es_sede_base = legajo_sedes_actual.es_sede_base

        if legajo_id and sede_id:
            existente = LegajoSedes.query.filter_by(
                legajo_id=legajo_id,
                sede_id=sede_id,
                estado=1
            ).first()

            if existente and existente.id != legajo_sedes_id:
                raise ValidationError({
                    "sede_id": [
                        "Ya existe esa sede para el legajo indicado"
                    ]
                })

        if legajo_id and es_sede_base is True:
            sede_base = LegajoSedes.query.filter_by(
                legajo_id=legajo_id,
                es_sede_base=True,
                estado=1
            ).first()

            if sede_base and sede_base.id != legajo_sedes_id:
                raise ValidationError({
                    "es_sede_base": [
                        "El legajo indicado ya tiene una sede base"
                    ]
                })


# Instancias usadas por las rutas y servicios.
legajo_sedes_schema = LegajoSedesSchema()
legajos_sedes_schema = LegajoSedesSchema(many=True)
