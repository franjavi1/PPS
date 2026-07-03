from datetime import datetime
from db import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, DateTime, ForeignKey, func

class Comision(db.Model):
    # Nombre de la tabla asociada en la base de datos.
    __tablename__ = "comisiones"

    # Identificador principal de la comisión.
    id_comision: Mapped[int] = mapped_column(
        "idComision",
        Integer,
        primary_key=True,
        autoincrement=True
    )

    # Relación con el plan de asignaturas.
    plan_asignaturas_id: Mapped[int] = mapped_column(
        "planAsignaturasId",
        Integer,
        ForeignKey("PlanAsignaturas.id"),
        nullable=False
    )

    # Relación con el aula.
    aula_id: Mapped[int] = mapped_column(
        "aulaId",
        Integer,
        ForeignKey("Aulas.id_aula"),
        nullable=False
    )

    # Nombre de la comisión.
    nombre: Mapped[str] = mapped_column(
        String(45),
        nullable=False
    )

    # Modalidad (ej: Presencial, Virtual).
    modalidad: Mapped[str] = mapped_column(
        String(45),
        nullable=False
    )

    # Cupo máximo de alumnos para la comisión.
    cupo_maximo: Mapped[int] = mapped_column(
        "cupoMaximo",
        Integer,
        nullable=False
    )

    # Usuario que realizó la última acción sobre el registro.
    usuario_accion: Mapped[int] = mapped_column(
        "usuarioAccion",
        Integer,
        nullable=False
    )

    # Fecha y hora de creación del registro.
    ts_creacion: Mapped[datetime] = mapped_column(
        "tsCreacion",
        DateTime,
        server_default=func.now(),
        nullable=False
    )

    # Fecha y hora de la última modificación del registro.
    ts_modificacion: Mapped[datetime] = mapped_column(
        "tsModificacion",
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )