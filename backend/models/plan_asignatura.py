from datetime import datetime
from db import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Float, DateTime, ForeignKey, func

class PlanAsignatura(db.Model):
    __tablename__ = "PlanAsignaturas"

    id: Mapped[int] = mapped_column(
        "id",
        Integer,
        primary_key=True,
        autoincrement=True
    )

    asignatura_id: Mapped[int] = mapped_column(
        "asignaturaId",
        Integer,
        ForeignKey("asignaturas.id"),
        nullable=False
    )

    plan_id: Mapped[int] = mapped_column(
        "planId",
        Integer,
        ForeignKey("planes.id"),
        nullable=False
    )

    rango_minimo_id: Mapped[int] = mapped_column(
        "rangoMinimoId",
        Integer,
        # ForeignKey("Rangos.id"), hacer rangos
        nullable=False
    )

    sedes_id: Mapped[int] = mapped_column(
        "sedesId",
        Integer,
        ForeignKey("sedes.id"), 
        nullable=False
    )

    presentismo_porc: Mapped[float] = mapped_column(
        "presentismoPorc",
        Float,
        nullable=False,
        default=0.0
    )

    regularizacion_prom: Mapped[float] = mapped_column(
        "regularizacionProm",
        Float,
        nullable=False,
        default=0.0
    )

    final_aprobacion: Mapped[int] = mapped_column(
        "finalAprobacion",
        Integer,
        nullable=False,
        default=0
    )

    duracion: Mapped[float] = mapped_column(
        "duracion",
        Float,
        nullable=False,
        default=0.0
    )

    regimen: Mapped[str] = mapped_column(
        "regimen",
        String(45),
        nullable=False
    )

    modalidad: Mapped[str] = mapped_column(
        "modalidad",
        String(45),
        nullable=False
    )

    estado: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1
    )

    usuario_accion: Mapped[int] = mapped_column(
        "usuarioAccion",
        Integer,
        nullable=False
    )

    ts_creacion: Mapped[datetime] = mapped_column(
        "tsCreacion",
        DateTime,
        server_default=func.now(),
        nullable=False
    )

    ts_modificacion: Mapped[datetime] = mapped_column(
        "tsModificacion",
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )
    
    correlativas = relationship(
        "PACorrelativa",
        backref="plan_asignatura",
        primaryjoin="and_(PlanAsignatura.id == PACorrelativa.pa_id, PACorrelativa.estado == 1)",
        lazy="joined"
    )