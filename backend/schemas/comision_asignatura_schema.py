from models.aula import Aula
from models.comision import Comision
from models.comision_asignatura import ComisionAsignatura
from models.plan_asignatura import PlanAsignatura
from models.modalidades import Modalidades

from db import ma
from marshmallow import ValidationError, validates, validates_schema, pre_load, fields
from marshmallow.validate import Length, OneOf
from schemas.plan_asignatura_schema import PlanAsignaturaSchema
from schemas.comision_schema import ComisionSchema 
from schemas.autoridad_comision_schema import AutoridadComisionSchema


class ComisionAsignaturaSchema(ma.SQLAlchemySchema):
    class Meta:
        model = ComisionAsignatura
        load_instance = True

    # Objetos anidados para respuestas de lectura (dump_only)
    plan_asignaturas = fields.Nested(PlanAsignaturaSchema, dump_only=True)
    comision = fields.Nested(ComisionSchema, dump_only=True) 
    
    autoridades = fields.Nested(AutoridadComisionSchema, attribute="autoridad_comision_items", many=True, dump_only=True)
    
    id_comision_asignatura = ma.auto_field(dump_only=True)

    plan_asignaturas_id = ma.auto_field(required=True, allow_none=False)
    aula_id = ma.auto_field(required=True, allow_none=False)
    comision_id = ma.auto_field(required=True, allow_none=False)
    nombre = ma.auto_field(
        required=True,
        allow_none=False,
        validate=[
            Length(min=1, max=45, error="El nombre debe tener entre 1 y 45 caracteres")
        ]
    )

    modalidad = ma.auto_field(
        required=True,
        allow_none=False,
        validate=[
            Length(min=1, max=45, error="El horario debe tener entre 1 y 45 caracteres")
        ]
    )
    modalidadesid = ma.auto_field(
    required=True,
    allow_none=False
)

    cupo_maximo = ma.auto_field(required=True, allow_none=False)

    estado = ma.auto_field(
        required=True,
        allow_none=False,
        validate=[OneOf([0, 1], error="El estado debe ser 0 o 1")]
    )




    id_persona_alta = ma.auto_field(dump_only=True)
    id_persona_modificacion = ma.auto_field(dump_only=True)
    id_persona_baja= ma.auto_field(dump_only=True)
    ts_creacion = ma.auto_field(dump_only=True)
    ts_modificacion = ma.auto_field(dump_only=True)
    ts_baja = ma.auto_field(dump_only=True)

    @validates("plan_asignaturas_id")
    def validar_plan_asignaturas(self, value, **kwargs):
        if value <= 0:
            raise ValidationError("El plan de asignatura debe ser un numero entero positivo")
        if PlanAsignatura.query.filter_by(id=value).first() is None:
            raise ValidationError("El plan de asignatura indicado no existe")

    @validates("aula_id")
    def validar_aula(self, value, **kwargs):
        if value <= 0:
            raise ValidationError("El aula debe ser un numero entero positivo")
        if Aula.query.filter_by(id_aula=value, estado=1).first() is None:
            raise ValidationError("El aula indicada no existe o no esta activa")

    @validates("comision_id")
    def validar_comision(self, value, **kwargs):
        if value <= 0:
            raise ValidationError("La comision debe ser un numero entero positivo")
        if Comision.query.filter_by(id_comision=value).first() is None:
            raise ValidationError("La comision indicada no existe")

    @validates("cupo_maximo")
    def validar_cupo_maximo(self, value, **kwargs):
        if value <= 0:
            raise ValidationError("El cupo maximo debe ser mayor a cero")
        if value > 500:
            raise ValidationError("El cupo máximo no puede ser mayor a 500")
        

        
    @validates("modalidadesid")
    def validar_modalidad(self, value, **kwargs):
        if value <= 0:
            raise ValidationError("La modalidad debe ser un numero entero positivo")
        modalidad = Modalidades.query.filter_by(
     modalidadesid=value,
        estado=1
    ).first()

    if modalidad is None:
        raise ValidationError(
            "La modalidad indicada no existe o no esta activa"
        )

    @validates_schema
    def validar_relacion_unica(self, data, **kwargs):
        plan_asignaturas_id = data.get("plan_asignaturas_id")
        aula_id = data.get("aula_id")
        comision_id = data.get("comision_id")

        if not plan_asignaturas_id or not aula_id or not comision_id:
            return

        existente = ComisionAsignatura.query.filter_by(
            plan_asignaturas_id=plan_asignaturas_id,
            aula_id=aula_id,
            comision_id=comision_id
        ).first()

        comision_asignatura_id = getattr(self, "context", {}).get(
            "comision_asignatura_id"
        )

        if existente and existente.id_comision_asignatura != comision_asignatura_id:
            raise ValidationError({
                "comision_id": [
                    "Ya existe esa comision para el plan de asignatura y aula indicados"
                ]
            })

    @pre_load
    def normalizar_entrada(self, data, **kwargs):
        for campo in ["nombre", "modalidad", "estado"]:
            if campo in data and isinstance(data[campo], str):
                data[campo] = data[campo].strip()

        return data


comision_asignatura_schema = ComisionAsignaturaSchema()
comisiones_asignaturas_schema = ComisionAsignaturaSchema(many=True)