from datetime import datetime

from db import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import DateTime, ForeignKey, Integer, String, func


class ComisionAsignatura(db.Model):
    __tablename__ = "ComisionAsignatura"

    id_comision_asignatura: Mapped[int] = mapped_column(
        "idComisionAsignatura",
        Integer,
        primary_key=True,
        autoincrement=True
    )

    plan_asignaturas_id: Mapped[int] = mapped_column(
        "planAsignaturasId",
        Integer,
        ForeignKey("PlanAsignaturas.id"),
        nullable=False
    )

    aula_id: Mapped[int] = mapped_column(
        "aulaId",
        Integer,
        ForeignKey("Aulas.id_aula"),
        nullable=False
    )

    nombre: Mapped[str] = mapped_column(
        String(45),
        nullable=False
    )

    modalidad: Mapped[str] = mapped_column(
        String(45),
        nullable=False
    )

    modalidadesid: Mapped[int] = mapped_column(
        "modalidadesid",
        Integer,
        ForeignKey("Modalidades.modalidadesid"),
        nullable=False
    )

    cupo_maximo: Mapped[int] = mapped_column(
        "cupoMaximo",
        Integer,
        nullable=False
    )

    estado: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1
    )


    usuario_accion: Mapped[int | None] = mapped_column(
        "usuarioAccion",
        Integer,
        nullable=True
    )

    ts_creacion: Mapped[datetime | None] = mapped_column(
        "tsCreacion",
        DateTime,
        server_default=func.now(),
        nullable=True
    )

    ts_modificacion: Mapped[datetime | None] = mapped_column(
        "tsModificacion",
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=True
    )

    comision_id: Mapped[int] = mapped_column(
        "idComision",
        Integer,
        ForeignKey("Comision.idComision"),
        nullable=False
    )

    plan_asignaturas = relationship(
        "PlanAsignatura",
        backref="comision_asignatura_items"
    )
    aula = relationship("Aula", backref="comision_asignatura_items")
    comision = relationship("Comision", backref="comision_asignatura_items")

    def __repr__(self):
        return f"<ComisionAsignatura {self.id_comision_asignatura}>"
