from models.plan_asignatura import PlanAsignatura
from schemas.plan_asignatura_schema import PlanAsignaturaSchema, plan_asignatura_schema
from db import db
from utils.auditoria import Auditoria
from utils.errores import APIError

def obtener_todos():
    return PlanAsignatura.query.filter_by(estado=1).all()

def obtener_por_id(id_plan_asignatura):
    plan = PlanAsignatura.query.filter_by(id=id_plan_asignatura, estado=1).first()
    if not plan:
        raise APIError("Registro no encontrado.", status=404)
    return plan

def crear(datos):
    nuevo_plan = plan_asignatura_schema.load(datos)
    Auditoria.preparar_alta(nuevo_plan)
    db.session.add(nuevo_plan)
    db.session.commit()
    return nuevo_plan

def actualizar(plan, datos):
    Auditoria.preparar_modificacion(plan)
    schema = PlanAsignaturaSchema(partial=True)
    schema.context = {"plan_id": plan.id}
    schema.load(datos, instance=plan, partial=True)
    db.session.commit()
    return plan

def eliminar(plan):
    Auditoria.preparar_baja(plan)
    plan.estado = 0
    db.session.commit()
    return plan