from datetime import datetime
from db import db
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, DateTime, func, ForeignKey

class PACorrelativa(db.Model):
    # Nombre de la tabla asociada en la base de datos
    __tablename__ = "PACorrelativas"

    # Identificador principal
    id: Mapped[int] = mapped_column(
        "id",
        Integer,
        primary_key=True,
        autoincrement=True
    )

    # Relación con Asignatura
    asignatura_id: Mapped[int] = mapped_column(
        "asignaturaId",
        Integer,
        ForeignKey("asignaturas.id"),
        nullable=False
    )

    # Relación con Plan de Asignatura (paId)
    pa_id: Mapped[int] = mapped_column(
        "paId",
        Integer,
        ForeignKey("PlanAsignaturas.id"),
        nullable=False
    )

    # Usuario que realizó la última acción sobre el registro
    usuario_accion: Mapped[int] = mapped_column(
        "usuarioAccion",
        Integer,
        nullable=False
    )

    # Fecha y hora de creación del registro
    ts_creacion: Mapped[datetime] = mapped_column(
        "tsCreacion",
        DateTime,
        server_default=func.now(),
        nullable=False
    )

    # Fecha y hora de la última modificación del registro
    ts_modificacion: Mapped[datetime] = mapped_column(
        "tsModificacion",
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )