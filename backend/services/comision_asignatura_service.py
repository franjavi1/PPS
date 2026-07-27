from models.comision_asignatura import ComisionAsignatura
from models.modalidades import Modalidades
from models.legajo import Legajo
from models.legajo_rangos import LegajoRangos
from models.rangos_institucionales import RangosInstitucionales
from models.plan_asignatura import PlanAsignatura
from models.planes import Planes
from models.comision import Comision
from utils.errores import APIError

from schemas.comision_asignatura_schema import (
    ComisionAsignaturaSchema,
    comision_asignatura_schema
)
from db import db
from utils.errores import APIError


def obtener_modalidad(modalidadesid):
    return Modalidades.query.filter_by(
        modalidadesid=modalidadesid,
        estado=1
    ).first()


def obtener_todos():
    return ComisionAsignatura.query.all()


def obtener_por_id(id_comision_asignatura):
    return ComisionAsignatura.query.filter_by(
        id_comision_asignatura=id_comision_asignatura
    ).first()


def crear(datos):
    nueva_comision_asignatura = comision_asignatura_schema.load(datos)
    modalidad = obtener_modalidad(
    nueva_comision_asignatura.modalidadesid
)

    if modalidad is None:
        raise APIError("La modalidad indicada no existe", status=400)


    db.session.add(nueva_comision_asignatura)
    db.session.commit()

    return nueva_comision_asignatura


def actualizar(comision_asignatura, datos):
    schema = ComisionAsignaturaSchema(partial=True)
    schema.context = {
        "comision_asignatura_id": comision_asignatura.id_comision_asignatura
    }

    schema.load(datos, instance=comision_asignatura, partial=True)

    if "modalidadesid" in datos:
        modalidad = obtener_modalidad(comision_asignatura.modalidadesid)

        if modalidad is None:
            raise APIError("La modalidad indicada no existe", status=400)


    db.session.commit()

    return comision_asignatura


def eliminar(comision_asignatura):
    comision_asignatura.estado = 0
    db.session.commit()

    return comision_asignatura

def obtener_comisiones_por_legajo(legajo_id: int | None = None):
    nivel_jerarquia_legajo = None

    # Si tenemos el ID del legajo, obtenemos su nivel de jerarquía actual
    if legajo_id is not None:
        legajo = Legajo.query.filter_by(id=legajo_id, estado=1).first()
        if not legajo:
            raise APIError(f"Legajo con ID {legajo_id} no encontrado.", status=404)

        ultimo_legajo_rango = (
            LegajoRangos.query
            .filter_by(legajo_id=legajo_id, estado=1)
            .order_by(LegajoRangos.id.desc())
            .first()
        )

        if not ultimo_legajo_rango or not ultimo_legajo_rango.rangos_institucionales:
            raise APIError("El legajo no tiene un rango institucional asignado.", status=400)

        nivel_jerarquia_legajo = ultimo_legajo_rango.rangos_institucionales.nivel_jerarquia

    # Busco la ComisionAsignatura uniendo Comision, PlanAsignatura, Planes y RangosInstitucionales
    query = (
        ComisionAsignatura.query
        .join(Comision, ComisionAsignatura.comision_id == Comision.id_comision)
        .join(PlanAsignatura, ComisionAsignatura.plan_asignaturas_id == PlanAsignatura.id)
        .join(Planes, PlanAsignatura.plan_id == Planes.id)
        .join(RangosInstitucionales, PlanAsignatura.rango_minimo_id == RangosInstitucionales.id)
        .filter(
            ComisionAsignatura.estado == 1,
            Comision.estado == 1,
            PlanAsignatura.estado == 1,
            Planes.estado == 1,
            RangosInstitucionales.estado == 1
        )
    )

    # Filtro de jerarquía únicamente si se envió un legajo
    if nivel_jerarquia_legajo is not None:
        query = query.filter(RangosInstitucionales.nivel_jerarquia <= nivel_jerarquia_legajo)

    return query.all()