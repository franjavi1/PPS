from models.comision_asignatura import ComisionAsignatura
from models.modalidades import Modalidades
from models.legajo import Legajo
from models.legajo_rangos import LegajoRangos
from models.rangos_institucionales import RangosInstitucionales
from models.plan_asignatura import PlanAsignatura
from utils.errores import APIError

from schemas.comision_asignatura_schema import (
    ComisionAsignaturaSchema,
    comision_asignatura_schema
)
from db import db
from sqlalchemy import func
from utils.errores import APIError


def obtener_modalidad(modalidad):
    descripcion = str(modalidad or "").strip()

    return Modalidades.query.filter(
        func.lower(Modalidades.descripcion) == descripcion.lower()
    ).first()


def obtener_todos():
    return ComisionAsignatura.query.all()


def obtener_por_id(id_comision_asignatura):
    return ComisionAsignatura.query.filter_by(
        id_comision_asignatura=id_comision_asignatura
    ).first()


def crear(datos):
    nueva_comision_asignatura = comision_asignatura_schema.load(datos)
    modalidad = obtener_modalidad(nueva_comision_asignatura.modalidad)

    if modalidad is None:
        raise APIError("La modalidad indicada no existe", status=400)

    nueva_comision_asignatura.modalidadesid = modalidad.modalidadesid

    db.session.add(nueva_comision_asignatura)
    db.session.commit()

    return nueva_comision_asignatura


def actualizar(comision_asignatura, datos):
    schema = ComisionAsignaturaSchema(partial=True)
    schema.context = {
        "comision_asignatura_id": comision_asignatura.id_comision_asignatura
    }

    schema.load(datos, instance=comision_asignatura, partial=True)

    if "modalidad" in datos:
        modalidad = obtener_modalidad(comision_asignatura.modalidad)

        if modalidad is None:
            raise APIError("La modalidad indicada no existe", status=400)

        comision_asignatura.modalidadesid = modalidad.modalidadesid

    db.session.commit()

    return comision_asignatura


def eliminar(comision_asignatura):
    comision_asignatura.estado = 0
    db.session.commit()

    return comision_asignatura

def obtener_comisiones_por_legajo(legajo_id: int):
    # 1. Verificar si el Legajo existe y esta activo
    legajo = Legajo.query.filter_by(id=legajo_id, estado=1).first()
    if not legajo:
        raise APIError(f"Legajo con ID {legajo_id} no encontrado.", status=404)

    # 2. Obtener el ultimo rango registrado del legajo (el mas reciente por ID o ts_creacion)
    ultimo_legajo_rango = (
        LegajoRangos.query
        .filter_by(legajo_id=legajo_id, estado=1)
        .order_by(LegajoRangos.id.desc())
        .first()
    )

    if not ultimo_legajo_rango or not ultimo_legajo_rango.rangos_institucionales:
        raise APIError("El legajo no tiene un rango institucional asignado.", status=400)

    # Nivel de jerarquia actual de la persona
    nivel_jerarquia_legajo = ultimo_legajo_rango.rangos_institucionales.nivel_jerarquia

    # 3. Filtrar ComisionAsignatura comparando el nivelJerarquia del rango mínimo con el del legajo
    comisiones = (
        ComisionAsignatura.query
        .join(PlanAsignatura, ComisionAsignatura.plan_asignaturas_id == PlanAsignatura.id)
        .join(RangosInstitucionales, PlanAsignatura.rango_minimo_id == RangosInstitucionales.id)
        .filter(
            ComisionAsignatura.estado == 1,
            PlanAsignatura.estado == 1,
            RangosInstitucionales.estado == 1,
            RangosInstitucionales.nivel_jerarquia <= nivel_jerarquia_legajo
        )
        .all()
    )

    return comisiones