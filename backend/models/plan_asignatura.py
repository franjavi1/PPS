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
        nullable=True,
        default=0.0
    )

    final_aprobacion: Mapped[int] = mapped_column(
        "finalAprobacion",
        Integer,
        nullable=True,
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


    
    plan = relationship("Planes", backref="plan_asignaturas_items")
    
    correlativas = relationship(
        "PACorrelativa",
        backref="plan_asignatura",
        primaryjoin="and_(PlanAsignatura.id == PACorrelativa.pa_id, PACorrelativa.estado == 1)",
        lazy="joined"
    )

    # --- AUDITORIA ---
    id_persona_alta: Mapped[int] = mapped_column(Integer, nullable=True)
    id_persona_modificacion: Mapped[int] = mapped_column(Integer, nullable=True)
    id_persona_baja: Mapped[int] = mapped_column(Integer, nullable=True)
    ts_creacion: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(), nullable=True)
    ts_modificacion: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    ts_baja: Mapped[datetime] = mapped_column(DateTime, nullable=True)