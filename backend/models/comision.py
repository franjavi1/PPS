from datetime import datetime
from db import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, DateTime, ForeignKey, func

class Comision(db.Model):
    # Nombre de la tabla asociada en la base de datos.
    __tablename__ = "comisiones"

    # Identificador principal de la comision
    id_comision: Mapped[int] = mapped_column(
        "idComision",
        Integer,
        primary_key=True,
        autoincrement=True
    )

    # Relacion con el plan de asignaturas
    plan_asignaturas_id: Mapped[int] = mapped_column(
        "planAsignaturasId",
        Integer,
        ForeignKey("PlanAsignaturas.id"),
        nullable=False
    )

    # Relacion con el aula
    aula_id: Mapped[int] = mapped_column(
        "aulaId",
        Integer,
        ForeignKey("Aulas.id_aula"),
        nullable=False
    )

    # Nombre de la comision
    nombre: Mapped[str] = mapped_column(
        String(45),
        nullable=False
    )

    # Modalidad (Presencial, Virtual) // Ojo cambiar por ID
    modalidad: Mapped[str] = mapped_column(
        String(45),
        nullable=False
    )

    # Cupo maximo de alumnos para la comision
    cupo_maximo: Mapped[int] = mapped_column(
        "cupoMaximo",
        Integer,
        nullable=False
    )

    # Estado del registro dentro del sistema
    estado: Mapped[str] = mapped_column(
        String(45),
        nullable=False,
        default="Activo"
    )

    # Usuario que realizo la última accion sobre el registro
    usuario_accion: Mapped[int] = mapped_column(
        "usuarioAccion",
        Integer,
        nullable=False
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