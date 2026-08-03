from datetime import datetime
from db import db
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, DateTime, func, ForeignKey

class PACorrelativa(db.Model):
    # Nombre de la tabla asociada en la base de datos
    __tablename__ = "PACorrelativas"

    # ID principal
    id: Mapped[int] = mapped_column(
        "id",
        Integer,
        primary_key=True,
        autoincrement=True
    )

    # Relacion con Asignatura
    asignatura_id: Mapped[int] = mapped_column(
        "asignaturaId",
        Integer,
        ForeignKey("asignaturas.id"),
        nullable=False
    )

    # Relacion con Plan de Asignatura (paId)
    pa_id: Mapped[int] = mapped_column(
        "paId",
        Integer,
        ForeignKey("PlanAsignaturas.id"),
        nullable=False
    )

    estado: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1
    )





    # --- AUDITORIA ---
    id_persona_alta: Mapped[int] = mapped_column(Integer, nullable=True)
    id_persona_modificacion: Mapped[int] = mapped_column(Integer, nullable=True)
    id_persona_baja: Mapped[int] = mapped_column(Integer, nullable=True)
    ts_creacion: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(), nullable=True)
    ts_modificacion: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    ts_baja: Mapped[datetime] = mapped_column(DateTime, nullable=True)