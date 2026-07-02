from datetime import datetime

from db import db
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, DateTime, func


class RangosInstitucionales(db.Model):
    # Nombre de la tabla asociada en la base de datos.
    __tablename__ = "rangos_institucionales"

    # Identificador principal del rango institucional.
    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    # Descripcion del rango institucional.
    descripcion: Mapped[str] = mapped_column(
        String(45),
        nullable=False
    )

    # Nivel de jerarquia del rango institucional.
    nivel_jerarquia: Mapped[int] = mapped_column(
        "nivelJerarquia",
        Integer,
        nullable=False
    )

    # Usuario que realizo la ultima accion sobre el registro.
    usuario_accion: Mapped[int] = mapped_column(
        "usuarioAccion",
        Integer,
        nullable=False
    )

    # Fecha y hora de creacion del registro.
    ts_creacion: Mapped[datetime] = mapped_column(
        "tsCreacion",
        DateTime,
        server_default=func.now(),
        nullable=False
    )

    # Fecha y hora de la ultima modificacion del registro.
    ts_modificacion: Mapped[datetime] = mapped_column(
        "tsModificacion",
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )
