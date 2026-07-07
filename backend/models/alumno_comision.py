from datetime import datetime

from db import db
from sqlalchemy import DateTime, Float, ForeignKey, Integer, func
from sqlalchemy.orm import Mapped, mapped_column, relationship


class AlumnoComision(db.Model):
    __tablename__ = "AlumnoComision"

    id_historia_alumnos: Mapped[int] = mapped_column(
        "idHistoriaAlumnos",
        Integer,
        primary_key=True,
        autoincrement=True
    )

    legajo_id: Mapped[int] = mapped_column(
        "Legajo_id",
        Integer,
        ForeignKey("legajos.id"),
        nullable=False
    )

    comision_id_comision: Mapped[int] = mapped_column(
        "Comision_idComision",
        Integer,
        ForeignKey("ComisionAsignatura.idComisionAsignatura"),
        nullable=False
    )

    condicion_academica_id: Mapped[int] = mapped_column(
        "CondicionAcademica_idCondicionAcademica",
        Integer,
        ForeignKey("CondicionAcademica.idCondicionAcademica"),
        nullable=False
    )

    nota_final: Mapped[float | None] = mapped_column(
        "notaFinal",
        Float,
        nullable=True
    )

    presentismo_porc: Mapped[float | None] = mapped_column(
        "presentismoPorc",
        Float,
        nullable=True
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

    legajo = relationship("Legajo", backref="alumno_comision_items")
    comision_asignatura = relationship(
        "ComisionAsignatura",
        backref="alumno_comision_items"
    )
    condicion_academica = relationship(
        "CondicionAcademica",
        backref="alumno_comision_items"
    )

    def __repr__(self):
        return f"<AlumnoComision {self.id_historia_alumnos}>"
