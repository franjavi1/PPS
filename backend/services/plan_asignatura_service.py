from models.plan_asignatura import PlanAsignatura
from schemas.plan_asignatura_schema import PlanAsignaturaSchema, plan_asignatura_schema
from db import db

def obtener_todos():
    return PlanAsignatura.query.filter_by(estado=1).all()

def obtener_por_id(id_plan_asignatura):
    return PlanAsignatura.query.filter_by(id=id_plan_asignatura, estado=1).first()

def crear(datos):
    nuevo_plan = plan_asignatura_schema.load(datos)
    db.session.add(nuevo_plan)
    db.session.commit()
    return nuevo_plan

def actualizar(plan, datos):
    schema = PlanAsignaturaSchema(partial=True)
    schema.context = {"plan_id": plan.id}
    schema.load(datos, instance=plan, partial=True)
    db.session.commit()
    return plan

def eliminar(plan):
    plan.estado = 0
    db.session.commit()
    return plan
