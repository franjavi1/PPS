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


    # Usuario que realizo la ultima accion sobre el registro
    usuario_accion: Mapped[int] = mapped_column(
        "usuarioAccion",
        Integer,
        nullable=True
    )

    # Fecha y hora de creacion del registro
    ts_creacion: Mapped[datetime] = mapped_column(
        "tsCreacion",
        DateTime,
        server_default=func.now(),
        nullable=False
    )

    # Fecha y hora de la ultima modificacion del registro
    ts_modificacion: Mapped[datetime] = mapped_column(
        "tsModificacion",
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )