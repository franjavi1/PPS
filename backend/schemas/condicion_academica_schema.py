from models.condicion_academica import CondicionAcademica

from db import ma
from marshmallow import ValidationError, validates, validates_schema, pre_load
from marshmallow.validate import Length


class CondicionAcademicaSchema(ma.SQLAlchemySchema):
    class Meta:
        model = CondicionAcademica
        load_instance = True

    id_condicion_academica = ma.auto_field(dump_only=True)

    condicion = ma.auto_field(
        required=True,
        allow_none=False,
        validate=[
            Length(min=1, max=45, error="La condicion debe tener entre 1 y 45 caracteres")
        ],
        error_messages={
            "required": "La condicion es obligatoria",
            "null": "La condicion no puede ser null",
            "invalid": "La condicion debe ser un texto valido"
        }
    )

    usuario_accion = ma.auto_field(
        required=False,
        allow_none=True,
        error_messages={
            "invalid": "El usuario de accion debe ser un numero entero"
        }
    )

    ts_creacion = ma.auto_field(dump_only=True)
    ts_modificacion = ma.auto_field(dump_only=True)

    @validates("usuario_accion")
    def validar_usuario_accion(self, value, **kwargs):
        if value is not None and value <= 0:
            raise ValidationError("El usuario de accion debe ser un numero entero positivo")

    @validates_schema
    def validar_condicion_unica(self, data, **kwargs):
        condicion = data.get("condicion")

        if not condicion:
            return

        existente = CondicionAcademica.query.filter_by(
            condicion=condicion
        ).first()

        condicion_academica_id = getattr(self, "context", {}).get(
            "condicion_academica_id"
        )

        if existente and existente.id_condicion_academica != condicion_academica_id:
            raise ValidationError({
                "condicion": ["Ya existe una condicion academica con ese nombre"]
            })

    @pre_load
    def normalizar_entrada(self, data, **kwargs):
        if "condicion" in data and isinstance(data["condicion"], str):
            data["condicion"] = data["condicion"].strip()

        return data


condicion_academica_schema = CondicionAcademicaSchema()
condiciones_academicas_schema = CondicionAcademicaSchema(many=True)
