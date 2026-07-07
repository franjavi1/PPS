from models.alumno_comision import AlumnoComision
from models.comision_asignatura import ComisionAsignatura
from models.condicion_academica import CondicionAcademica
from models.legajo import Legajo

from db import ma
from marshmallow import ValidationError, validates, validates_schema


class AlumnoComisionSchema(ma.SQLAlchemySchema):
    class Meta:
        model = AlumnoComision
        load_instance = True

    id_historia_alumnos = ma.auto_field(dump_only=True)

    legajo_id = ma.auto_field(required=True, allow_none=False)
    comision_id_comision = ma.auto_field(required=True, allow_none=False)
    condicion_academica_id = ma.auto_field(required=True, allow_none=False)

    nota_final = ma.auto_field(required=False, allow_none=True)
    presentismo_porc = ma.auto_field(required=False, allow_none=True)
    usuario_accion = ma.auto_field(required=False, allow_none=True)

    ts_creacion = ma.auto_field(dump_only=True)
    ts_modificacion = ma.auto_field(dump_only=True)

    @validates("legajo_id")
    def validar_legajo(self, value, **kwargs):
        if value <= 0:
            raise ValidationError("El legajo debe ser un numero entero positivo")
        if Legajo.query.filter_by(id=value, estado=1).first() is None:
            raise ValidationError("El legajo indicado no existe o no esta activo")

    @validates("comision_id_comision")
    def validar_comision(self, value, **kwargs):
        if value <= 0:
            raise ValidationError("La comision debe ser un numero entero positivo")
        if ComisionAsignatura.query.filter_by(id_comision_asignatura=value).first() is None:
            raise ValidationError("La comision indicada no existe")

    @validates("condicion_academica_id")
    def validar_condicion_academica(self, value, **kwargs):
        if value <= 0:
            raise ValidationError("La condicion academica debe ser un numero entero positivo")
        if CondicionAcademica.query.filter_by(id_condicion_academica=value).first() is None:
            raise ValidationError("La condicion academica indicada no existe")

    @validates("nota_final")
    def validar_nota_final(self, value, **kwargs):
        if value is not None and (value < 0 or value > 10):
            raise ValidationError("La nota final debe estar entre 0 y 10")

    @validates("presentismo_porc")
    def validar_presentismo(self, value, **kwargs):
        if value is not None and (value < 0 or value > 100):
            raise ValidationError("El presentismo debe estar entre 0 y 100")

    @validates("usuario_accion")
    def validar_usuario_accion(self, value, **kwargs):
        if value is not None and value <= 0:
            raise ValidationError("El usuario de accion debe ser un numero entero positivo")

    @validates_schema
    def validar_inscripcion_unica(self, data, **kwargs):
        legajo_id = data.get("legajo_id")
        comision_id_comision = data.get("comision_id_comision")

        if not legajo_id or not comision_id_comision:
            return

        existente = AlumnoComision.query.filter_by(
            legajo_id=legajo_id,
            comision_id_comision=comision_id_comision
        ).first()

        alumno_comision_id = getattr(self, "context", {}).get(
            "alumno_comision_id"
        )

        if existente and existente.id_historia_alumnos != alumno_comision_id:
            raise ValidationError({
                "legajo_id": ["El legajo ya esta inscripto en esa comision"]
            })


alumno_comision_schema = AlumnoComisionSchema()
alumnos_comision_schema = AlumnoComisionSchema(many=True)
