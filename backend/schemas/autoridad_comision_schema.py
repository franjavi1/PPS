from models.autoridad_comision import AutoridadComision
from models.comision_asignatura import ComisionAsignatura
from models.legajo import Legajo
from models.tipos_autoridad import TipoAutoridad
from schemas.tipo_autoridad_schema import TipoAutoridadSchema
from schemas.legajo_schema import LegajoSchema

from db import ma
from marshmallow import ValidationError, validates, validates_schema, fields


class AutoridadComisionSchema(ma.SQLAlchemySchema):
    class Meta:
        model = AutoridadComision
        load_instance = True

    id = ma.auto_field(dump_only=True)

    tipo_autoridad_id = ma.auto_field(required=True, allow_none=False)
    legajo_id = ma.auto_field(required=True, allow_none=False)
    comision_id = ma.auto_field(required=True, allow_none=False)
    usuario_accion = ma.auto_field(required=False, allow_none=True)
    estado = ma.auto_field(dump_only=True)
    ts_creacion = ma.auto_field(dump_only=True)
    ts_modificacion = ma.auto_field(dump_only=True)
    
    tipo_autoridad = fields.Nested(TipoAutoridadSchema, dump_only=True)
    legajo = fields.Nested(LegajoSchema, dump_only=True)

    @validates("tipo_autoridad_id")
    def validar_tipo_autoridad(self, value, **kwargs):
        if value <= 0:
            raise ValidationError("El tipo de autoridad debe ser un numero entero positivo")
        if TipoAutoridad.query.filter_by(id=value, estado=1).first() is None:
            raise ValidationError("El tipo de autoridad indicado no existe o no esta activo")

    @validates("legajo_id")
    def validar_legajo(self, value, **kwargs):
        if value <= 0:
            raise ValidationError("El legajo debe ser un numero entero positivo")
        if Legajo.query.filter_by(id=value, estado=1).first() is None:
            raise ValidationError("El legajo indicado no existe o no esta activo")

    @validates("comision_id")
    def validar_comision_asignatura(self, value, **kwargs):
        if value <= 0:
            raise ValidationError("La comision de asignatura debe ser un numero entero positivo")
        if ComisionAsignatura.query.filter_by(id_comision_asignatura=value).first() is None:
            raise ValidationError("La comision de asignatura indicada no existe")

    @validates("usuario_accion")
    def validar_usuario_accion(self, value, **kwargs):
        if value is not None and value <= 0:
            raise ValidationError("El usuario de accion debe ser un numero entero positivo")

    @validates_schema
    def validar_relacion_unica(self, data, **kwargs):
        tipo_autoridad_id = data.get("tipo_autoridad_id")
        legajo_id = data.get("legajo_id")
        comision_id = data.get("comision_id")

        if not tipo_autoridad_id or not legajo_id or not comision_id:
            return

        existente = AutoridadComision.query.filter_by(
            tipo_autoridad_id=tipo_autoridad_id,
            legajo_id=legajo_id,
            comision_id=comision_id,
            estado=1
        ).first()

        autoridad_comision_id = getattr(self, "context", {}).get(
            "autoridad_comision_id"
        )

        if existente and existente.id != autoridad_comision_id:
            raise ValidationError({
                "legajo_id": [
                    "Ya existe esa autoridad para el legajo y comision indicados"
                ]
            })


autoridad_comision_schema = AutoridadComisionSchema()
autoridades_comision_schema = AutoridadComisionSchema(many=True)
