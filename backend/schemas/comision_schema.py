from models.comision import Comision
from db import ma
from marshmallow import ValidationError, validates, validates_schema, pre_load, post_dump
from marshmallow.validate import Length


class ComisionSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Comision
        load_instance = True

    # Campo de solo lectura para las respuestas.
    id_comision = ma.auto_field(dump_only=True)

    # Descripcion de la comision.
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
    estado = ma.auto_field(dump_only=True)
    # Usuario que realiza la accion sobre el registro.


    # Fechas administradas por el modelo/base de datos.

    id_persona_alta = ma.auto_field(dump_only=True)
    id_persona_modificacion = ma.auto_field(dump_only=True)
    id_persona_baja= ma.auto_field(dump_only=True)
    ts_creacion = ma.auto_field(dump_only=True)
    ts_modificacion = ma.auto_field(dump_only=True)
    ts_baja = ma.auto_field(dump_only=True)



    @validates_schema
    def validar_descripcion_unica(self, data, **kwargs):
        descripcion = data.get("descripcion")

        if not descripcion:
            return

        existente = Comision.query.filter_by(descripcion=descripcion, estado=1).first()
        comision_id = getattr(self, "context", {}).get("comision_id")

        if existente and existente.id_comision != comision_id:
            raise ValidationError({
                "descripcion": ["Ya existe una comision con esa descripcion"]
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


# Instancias usadas por las rutas y servicios.
comision_schema = ComisionSchema()
comisiones_schema = ComisionSchema(many=True)
